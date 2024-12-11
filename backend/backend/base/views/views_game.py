from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from ..models import CharacterSheet, HalflingSheets, HumanSheets, GnomeSheets, ElfSheets
from ..helper.generateToken import generate_user_token
from ..helper.modifiers import modifiers
from ..helper.inventoryParse import inventorySearch
from ..helper.RaceSheetEnum import RaceSheets
from ..helper.lvlOneHealth import LevelOneHealth


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def currencyCalc(request):
    user = request.user  # The user is retrieved from the request, thanks to JWT authentication
    amount = request.data.get("amount")    # Amount to add or subtract
    action = request.data.get("action")    # 'add' or 'subtract'
    race = request.data.get("race")
    sheetID = request.data.get("id")
    if amount is None or action is None:
        return Response({"msg": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Get the character sheet associated with the current user
        character_sheets = CharacterSheet.objects.filter(owner=user, race=race, active=True)
        # Now we need to access the race-specific table based on sheet_race
        for character_sheet in character_sheets:
            if character_sheet.race == 1:
                char_sheet = HumanSheets.objects.filter(owner=character_sheet.owner, id=sheetID).first()
            elif character_sheet.race == 2:
                char_sheet = GnomeSheets.objects.filter(owner=character_sheet.owner, id=sheetID).first()
            elif character_sheet.race == 3:
                char_sheet = ElfSheets.objects.filter(owner=character_sheet.owner, id=sheetID).first()
            elif character_sheet.race == 4:
                char_sheet = HalflingSheets.objects.filter(owner=character_sheet.owner, id=sheetID).first()
            else:
                return Response({"msg": "Invalid race."}, status=status.HTTP_400_BAD_REQUEST)

        # Get current gold from the race-specific sheet
        current_gold = char_sheet.char_gold

        # Update the gold based on the action (add or subtract)
        if action == "add":
            char_sheet.char_gold = current_gold + amount
        elif action == "subtract":
            if current_gold - amount < 0:
                return Response({"msg": "Insufficient gold."}, status=status.HTTP_400_BAD_REQUEST)
            char_sheet.char_gold = current_gold - amount
        else:
            return Response({"msg": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        # Save the updated race-specific sheet
        char_sheet.save()

        # Return a success response
        return Response({"msg": "Gold updated successfully.", "new_gold": char_sheet.char_gold})

    except CharacterSheet.DoesNotExist:
        return Response({"msg": "CharacterSheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except (HumanSheets.DoesNotExist, GnomeSheets.DoesNotExist, ElfSheets.DoesNotExist, HalflingSheets.DoesNotExist):
        return Response({"msg": "Race-specific sheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Log the error for debugging if needed
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getGold(request):
    user = request.user
    race = request.query_params.get('race')  
    sheetID = request.query_params.get('id')

    try:
        # Get all character sheets associated with the current user and race
        character_sheets = CharacterSheet.objects.filter(owner=user, race=race, active=True)
        
        if not character_sheets.exists():
            return Response({"msg": "CharacterSheet not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Now loop through the character sheets and check the race
        for character_sheet in character_sheets:
            if character_sheet.race == 1:
                char_sheet = HumanSheets.objects.filter(owner=user, id=sheetID).first()
            elif character_sheet.race == 2:
                char_sheet = GnomeSheets.objects.filter(owner=user, id=sheetID).first()
            elif character_sheet.race == 3:
                char_sheet = ElfSheets.objects.filter(owner=user, id=sheetID).first()
            elif character_sheet.race == 4:
                char_sheet = HalflingSheets.objects.filter(owner=user, id=sheetID).first()
            else:
                continue  # Skip invalid races
            
            if char_sheet:  # Check if the sheet for this race exists
                # Return the gold value
                char_gold = char_sheet.char_gold
                return Response({"gold": char_gold})

        # If no valid sheet found
        return Response({"msg": "Race-specific sheet not found."}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMods(request):
    user = request.user
    race = request.query_params.get('race')  
    sheetID = request.query_params.get('id')

    # Define the stat fields you want to retrieve
    stat_fields = [
        'stat_Strength',
        'stat_Dexterity',
        'stat_Constitution',
        'stat_Intelligence',
        'stat_Wisdom',
        'stat_Charisma'
    ]
    try:
        # Get all character sheets associated with the current user, race, and sheet ID
        character_sheets = CharacterSheet.objects.filter(owner=user, race=race, active=True)

        if not character_sheets.exists():
            return Response({"msg": "CharacterSheet not found."}, status=status.HTTP_404_NOT_FOUND)

        # Loop through all character sheets and check race to fetch the correct race-specific sheet
        for character_sheet in character_sheets:
            if character_sheet.race == 1:
                char_sheet = HumanSheets.objects.filter(owner=character_sheet.owner, id=sheetID).first()
            elif character_sheet.race == 2:
                char_sheet = GnomeSheets.objects.filter(owner=character_sheet.owner, id=sheetID).first()
            elif character_sheet.race == 3:
                char_sheet = ElfSheets.objects.filter(owner=character_sheet.owner, id=sheetID).first()
            elif character_sheet.race == 4:
                char_sheet = HalflingSheets.objects.filter(owner=character_sheet.owner, id=sheetID).first()
            else:
                continue  # Skip invalid races
            
            if char_sheet:  # Check if the sheet exists for this race
                # Collect stat modifiers in a dictionary
                stat_modifiers = {field: modifiers(getattr(char_sheet, field, None)) for field in stat_fields}

                # Return the stat modifiers for this sheet
                return Response({"Mods": stat_modifiers})

        # If no valid sheet found
        return Response({"msg": "Race-specific sheet not found."}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        # Log the error for debugging if needed
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addItemToPlayerInv(request):
    user = request.user
    itemID = request.data.get("itemID")  # ID of the item the user wants to add to their inventory
    race = request.data.get("race")
    sheetID = request.data.get("id")

    # Retrieve the item data from the CSV
    item = inventorySearch(itemID)
    if isinstance(item, str):
        return Response({"msg": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        # Get the character sheet associated with the current user
        character_sheet = CharacterSheet.objects.get(owner=user, race=race)

        # Access the race-specific table based on `race`
        if character_sheet.race == 1:
            char_sheet = HumanSheets.objects.get(owner=character_sheet.owner, id=sheetID)
        elif character_sheet.race == 2:
            char_sheet = GnomeSheets.objects.get(owner=character_sheet.owner, id=sheetID)
        elif character_sheet.race == 3:
            char_sheet = ElfSheets.objects.get(owner=character_sheet.owner, id=sheetID)
        elif character_sheet.race == 4:
            char_sheet = HalflingSheets.objects.get(owner=character_sheet.owner, id=sheetID)
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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_sheet_token(request):
    user = request.user
    sheet_data = request.data.get("sheet_data")
    if not sheet_data:
        return Response({"error": "Sheet data is required"}, status=400)

    token = generate_user_token(user, sheet_data)
    if token:
        return Response({"token": token}, status=200)
    else:
        return Response({"error": "Failed to generate token"}, status=500)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def levelUp(request):
    race = request.data.get('race')
    sheetID = request.data.get('id')
    charClass = request.data.get('charClass')
    print(charClass)
    race_models = {
        'HumanSheets': HumanSheets,
        'GnomeSheets': GnomeSheets,
        'ElfSheets': ElfSheets,
        'HalflingSheets': HalflingSheets,
    }
    user_race_name = RaceSheets(race).name
    user_race_sheet = race_models.get(user_race_name)

    try:
        userSheet = user_race_sheet.objects.get(id=sheetID)
    except user_race_sheet.DoesNotExist:
        return Response({'error': 'Sheet not found'}, status=404)

    userSheet.level += 1
    ConMod = (userSheet.stat_Constitution - 10)/2
    print(ConMod)
    level_health = LevelOneHealth(charClass)
    new_hitpoints = level_health.getLevelXHP() + ConMod
    if new_hitpoints is None:
        raise ValueError("new_hitpoints cannot be None")
    print(f"Hitpoints to add: {new_hitpoints}")

    userSheet.hitpoints += new_hitpoints
    print(f'New total hitpoints: {userSheet.hitpoints}')
    userSheet.save()
    
    # Return the updated hitpoints along with the success message
    return Response({
        'Level up!': f'{userSheet.char_name} has leveled up to level {userSheet.level}',
        'hitpoints': userSheet.hitpoints
    })

