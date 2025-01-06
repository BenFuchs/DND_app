import pandas as pd

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from ..models import CharacterSheet, HalflingSheets, HumanSheets, GnomeSheets, ElfSheets, InventoryItem, CharacterInventory

from ..helper.inventoryParse import inventorySearch
from ..helper.inventoryDetails import get_inventory_details
# works!
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addItemToPlayerInv(request):
    user = request.user
    itemID = request.data.get("itemID")
    sheetID = request.data.get("id")
    
    # Retrieve the item data from the CSV
    item_data = inventorySearch(itemID)
    if not item_data:
        return Response({"msg": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        # Get the character sheet
        character_sheet = CharacterSheet.objects.get(owner=user, id=sheetID)

        # Retrieve or create the InventoryItem
        item, _ = InventoryItem.objects.get_or_create(itemID=itemID, defaults={'name': item_data['name']})
        print(item)

        # Update or create CharacterInventory entry
        char_inventory, created = CharacterInventory.objects.get_or_create(
            character=character_sheet,
            item=item,
            defaults={'quantity': 1}
        )
        if not created:
            char_inventory.quantity += 1
            char_inventory.save()

        # Return updated inventory
        inventory_items = CharacterInventory.objects.filter(character=character_sheet).select_related('item')
        response_inventory = [
            {"itemID": inv.item.itemID, "quantity": inv.quantity, "name": inv.item.name}
            for inv in inventory_items
        ]

        return Response({"msg": "Item added to inventory successfully.", "inventory": response_inventory}, status=status.HTTP_200_OK)

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
        character_sheet = CharacterSheet.objects.get(owner=user, id=sheetID)
        inventory_items = CharacterInventory.objects.filter(character=character_sheet).select_related('item')

        # Prepare a list of inventory details
        item_details = [
            {"itemID": inv.item.itemID, "quantity": inv.quantity, "name": inv.item.name}
            for inv in inventory_items
        ]

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
    file_path = '/Users/benayah/Desktop/Code/dnd/DND_app/misc/NewItems.csv'
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

        # Access the race-specific sheet by checking the race
        if character_sheet.race == 1:  # Human
            char_sheet = HumanSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        elif character_sheet.race == 2:  # Gnome
            char_sheet = GnomeSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        elif character_sheet.race == 3:  # Elf
            char_sheet = ElfSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        elif character_sheet.race == 4:  # Halfling
            char_sheet = HalflingSheets.objects.get(owner=character_sheet.owner, char_name=charName)
        else:
            return Response({"msg": "Invalid race."}, status=status.HTTP_400_BAD_REQUEST)

        # Attempt to get the InventoryItem from the CharacterInventory
        character_inventory = CharacterInventory.objects.filter(character=character_sheet, item__itemID=itemID).first()

        if not character_inventory:
            return Response({"msg": "Item does not exist in user's inventory"}, status=status.HTTP_400_BAD_REQUEST)

        # Reduce quantity or remove item if quantity is 1
        if character_inventory.quantity > 1:
            character_inventory.quantity -= 1
            character_inventory.save()
        else:
            # Remove the item completely if quantity is 1
            character_sheet.inventory.remove(character_inventory.item)
            character_inventory.delete()

        # Prepare the updated inventory response
        updated_inventory = [{"itemID": item.itemID, "quantity": item.quantity} for item in character_sheet.inventory.all()]

        return Response({"msg": "Item removed from inventory successfully.", "inventory": updated_inventory}, status=status.HTTP_200_OK)

    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
