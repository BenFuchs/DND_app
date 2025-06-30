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
from ..helper.Race_Filter import get_character_sheet_by_race
import json

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
        char_sheet = get_character_sheet_by_race(user, int(race), int(sheetID))

        if not char_sheet:
            return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)

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
        char_sheet = get_character_sheet_by_race(user, int(race), int(sheetID))
            
        if char_sheet:  # Check if the sheet for this race exists
                # Return the gold value
                char_gold = char_sheet.char_gold
                return Response({"gold": char_gold})
        else:
            return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)

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
        char_sheet = get_character_sheet_by_race(user, int(race), int(sheetID))
        if char_sheet:  # Check if the sheet exists for this race
            # Collect stat modifiers in a dictionary
            stat_modifiers = {field: modifiers(getattr(char_sheet, field, None)) for field in stat_fields}

            # Return the stat modifiers for this sheet
            return Response({"Mods": stat_modifiers})
        else :
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
    print(sheet_data)
    if not sheet_data:
        return Response({"error": "Sheet data is required"}, status=400)

    token = generate_user_token(user, sheet_data)
    if token:
        print(token)
        return Response({"token": token}, status=200)
    else:
        return Response({"error": "Failed to generate token"}, status=500)
    
@api_view(["GET"])
def timed_sheet_data_sync(request):
    user= request.user
    race = int(request.query_params.get('race')) 
    sheetID = request.query_params.get('id')
    currentHP = request.query_params.get('CurrentHitPoints')
    tempHP = request.query_params.get("TempHitPoints")
    chosen_proficiencies_raw = request.query_params.get("ChosenProficiencies")
    chosen_proficiencies = json.loads(chosen_proficiencies_raw) if chosen_proficiencies_raw else []

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
    print('ID: ',userSheet.id)
    #Update HP
    userSheet.CurrentHitPoints = currentHP
    userSheet.TempHitPoints = tempHP

    #Update chosen Proficiencies
    userSheet.ChosenProficiencies = chosen_proficiencies
    print("Chosen proficiencies being saved:", chosen_proficiencies)

    #Save updated data
    userSheet.save()

    return Response({
        'CurrentHP':currentHP,
        'TempHP': tempHP,
        'ChosenProficiencies': chosen_proficiencies
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def levelUp(request):
    charClass = request.data.get('charClass')
    race = request.data.get('race')
    sheetID = request.data.get('id')

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

    # Level up
    userSheet.level += 1
    print(userSheet.MaxHitPoints)
    # Update HP
    levelHitpoints = LevelOneHealth(charClass)
    newHitpoints = levelHitpoints.getLevelXHP()
    userSheet.MaxHitPoints += newHitpoints
    print("New MaxHitPoints: ", userSheet.MaxHitPoints)
    userSheet.save()

    return Response({
        'Level': userSheet.level,
        'Newhitpoints': userSheet.MaxHitPoints,
        'Message': f"{userSheet.char_name} leveled up to {userSheet.level} with {userSheet.MaxHitPoints} HP",
    })