import pandas as pd

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from ..models import CharacterSheet, HalflingSheets, HumanSheets, GnomeSheets, ElfSheets

from ..helper.inventoryParse import inventorySearch
from ..helper.inventoryDetails import get_inventory_details
# works!
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addItemToPlayerInv(request):
    user = request.user
    itemID = request.data.get("itemID")  # ID of the item the user wants to add to their inventory
    print(itemID)
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
        
        # Access and update the inventory field
        inventory = char_sheet.inventory or {}  # Initialize inventory if it's None
        
        # Update the inventory with the new item
        if itemID in inventory:
            inventory[itemID] += 1  # Increase quantity if the item is already in inventory
        else:
            inventory[itemID] = 1  # Add new item with quantity 1

        # Save the updated inventory back to the character sheet
        char_sheet.inventory = inventory
        char_sheet.save()

        return Response({"msg": "Item added to inventory successfully.", "inventory": inventory}, status=status.HTTP_200_OK)

    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Log the error for debugging if needed
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getInventory(request):
    user = request.user
    sheetID = request.query_params.get("id")
    try:
        # Retrieve the user's character sheet and its inventory
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
        inventory = char_sheet.inventory
        print(f"Backend inventory before parsing: {inventory}")  # Debug: print inventory before parsing
        item_details = get_inventory_details(inventory)
        print(f"Backend item details after parsing: {item_details}")  # Debug: print parsed item details

        return Response({"inventory": item_details}, status=status.HTTP_200_OK)
    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)

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