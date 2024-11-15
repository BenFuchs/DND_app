import pandas as pd

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from ..models import CharacterSheet, HalflingSheets, HumanSheets, GnomeSheets, ElfSheets, InventoryItem

from ..helper.inventoryParse import inventorySearch
from ..helper.inventoryDetails import get_inventory_details
# works!
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addItemToPlayerInv(request):
    user = request.user
    itemID = request.data.get("itemID")  # The ID of the item the user wants to add
    sheetID = request.data.get("id")
    
    # Retrieve the item data from the CSV
    item = inventorySearch(itemID)
    if not item:
        return Response({"msg": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        # Get the character sheet associated with the current user
        character_sheet = CharacterSheet.objects.get(owner=user, id=sheetID)
        charName = character_sheet.char_name

        # Access the race-specific table based on `race`
        if character_sheet.race == 1:
            char_sheet = HumanSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        elif character_sheet.race == 2:
            char_sheet = GnomeSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        elif character_sheet.race == 3:
            char_sheet = ElfSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        elif character_sheet.race == 4:
            char_sheet = HalflingSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        else:
            return Response({"msg": "Invalid race."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve or create the InventoryItem
        item_obj, created = InventoryItem.objects.get_or_create(itemID=itemID)

        if created:
            # If the item was created, add it to the inventory
            char_sheet.inventory.add(item_obj)
        else:
            # If the item already exists, increase the quantity
            item_obj.quantity += 1
            item_obj.save()

        # Save the updated character sheet
        char_sheet.save()

        return Response({"msg": "Item added to inventory successfully.", "inventory": char_sheet.inventory.values('itemID', 'quantity')}, status=status.HTTP_200_OK)

    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getInventory(request):
    user = request.user
    sheetID = request.query_params.get("id")
    try:
        # Retrieve the user's character sheet
        character_sheet = CharacterSheet.objects.get(owner=user, id=sheetID)
        charName = character_sheet.char_name

        # Access the race-specific table based on `race`
        if character_sheet.race == 1:
            char_sheet = HumanSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        elif character_sheet.race == 2:
            char_sheet = GnomeSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        elif character_sheet.race == 3:
            char_sheet = ElfSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        elif character_sheet.race == 4:
            char_sheet = HalflingSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        else:
            return Response({"msg": "Invalid race."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve and process inventory
        inventory_items = char_sheet.inventory.all()  # This will get the InventoryItem objects
        
        # Prepare a list of item details
        item_details = []
        for item in inventory_items:
            item_data = {
                'itemID': item.itemID,
                'quantity': item.quantity,
                'name': inventorySearch(item.itemID)['name'],  # Assuming you are using inventorySearch to get item details from CSV
                # You can add more fields here if needed
            }
            item_details.append(item_data)

        return Response({"inventory": item_details}, status=status.HTTP_200_OK)

    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# works!
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def searchItems(request):
    search_term = request.query_params.get("query", "").lower()
    file_path = 'misc/NewItems.csv'
    data = pd.read_csv(file_path)

    # Replace NaN values with an empty string or any other default value
    data = data.fillna('')

    # Filter items based on search term
    results = data[data['name'].str.lower().str.startswith(search_term)]
    items = results.to_dict(orient='records')  # Convert to a list of dictionaries

    return Response({"items": items}, status=status.HTTP_200_OK)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def removeItem(request):
    user = request.user
    itemID = request.data.get("itemID")  # The ID of the item to remove
    sheetID = request.data.get("id")  # The character sheet ID

    try:
        # Get the character sheet associated with the current user
        character_sheet = CharacterSheet.objects.get(owner=user, id=sheetID)
        charName = character_sheet.char_name

        # Access the race-specific table based on `race`
        if character_sheet.race == 1:
            char_sheet = HumanSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        elif character_sheet.race == 2:
            char_sheet = GnomeSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        elif character_sheet.race == 3:
            char_sheet = ElfSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        elif character_sheet.race == 4:
            char_sheet = HalflingSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        else:
            return Response({"msg": "Invalid race."}, status=status.HTTP_400_BAD_REQUEST)

        # Attempt to get the InventoryItem
        item_obj = char_sheet.inventory.filter(itemID=itemID).first()

        if not item_obj:
            return Response({"msg": "Item does not exist in user's inventory"}, status=status.HTTP_400_BAD_REQUEST)

        # Reduce quantity or remove item if quantity is 1
        if item_obj.quantity > 1:
            item_obj.quantity -= 1
            item_obj.save()
        else:
            # Remove the item completely if quantity is 1
            char_sheet.inventory.remove(item_obj)
            item_obj.delete()

        # Prepare the updated inventory response
        updated_inventory = [{"itemID": item.itemID, "quantity": item.quantity} for item in char_sheet.inventory.all()]

        return Response({"msg": "Item removed from inventory successfully.", "inventory": updated_inventory}, status=status.HTTP_200_OK)

    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)