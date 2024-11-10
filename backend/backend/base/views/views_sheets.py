from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from ..models import CharacterSheet
from ..helper.raceSheets import * 


# Endpoint to check how many sheets are owned by current logged user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def logged_sheetNum_check(request):
    user = request.user  # The user is retrieved from the request, thanks to JWT authentication
    
    # Get all active character sheets for the user
    character_sheets = CharacterSheet.objects.filter(owner=user, active=True)
    
    sheet_data = []
    
    for sheet in character_sheets:
        race_model = None
        sheet_name = "Unnamed"  # Default name if no specific name is found for the sheet
        sheetID = sheet.id
        # Determine the race-specific model based on the sheet's race
        if sheet.race == CharacterSheet.Race.HUMAN:
            race_model = HumanSheets
        elif sheet.race == CharacterSheet.Race.GNOME:
            race_model = GnomeSheets
        elif sheet.race == CharacterSheet.Race.ELF:
            race_model = ElfSheets
        elif sheet.race == CharacterSheet.Race.HALFLING:
            race_model = HalflingSheets
        
        # Fetch the name for the current sheet if a race_model is available
        if race_model:
            race_sheet = race_model.objects.filter(owner=user).first()
            if race_sheet:
                sheet_name = race_sheet.char_name  # Set specific name for each sheet

        # Append the sheet details to the list
        sheet_data.append({
            'sheet_name': sheet_name,
            'race': sheet.get_race_display(),
            'creation_time': sheet.creation_time,
            'sheetID': sheetID
        })

    # Return the sheet count and detailed information
    return Response({
        'username': user.username,
        'sheet_count': character_sheets.count(),
        'sheets': sheet_data,

    })

#Endpoint to create a sheet for the logged user / requires logged in user and sending statBlocks
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sheet_creation(request):
    print(request.data)
    user = request.user
    data = request.data.get('data', {}) #use data to get information 
    #info from data
    user_stats = data.get('stats')  
    user_Name = data.get('characterName')
    user_Class = data.get('charClass')
    # Check if the user already has 3 character sheets
    sheet_count = CharacterSheet.objects.filter(owner=user, active=True).count()
    if sheet_count >= 3:
        return Response({"msg": "You have reached the maximum of 3 character sheets."}, status=status.HTTP_400_BAD_REQUEST)

    # Get the race selection from the request data
    race = data.get('race')
    if race is None or int(race) not in [choice[0] for choice in CharacterSheet.Race.choices]:
        return Response({"msg": "Invalid race selection."}, status=status.HTTP_400_BAD_REQUEST)

    # Create a new character sheet with the selected race
    CharacterSheet.objects.create(owner=user, race=race)
    if race == 1:
        createHumanSheet(user, user_stats, user_Name, user_Class)
    elif race == 2:
        createGnomeSheet(user, user_stats, user_Name, user_Class)
    elif race == 3:
        createElfSheet(user, user_stats, user_Name, user_Class)
    else:
        createHalflingSheet(user, user_stats, user_Name, user_Class)

    return Response({
        "msg": f"New character sheet created for {user.username} with race {CharacterSheet.Race(race).label}."
        }, status=status.HTTP_201_CREATED)

#Endpoint to delete sheets for logged user @api_view(['POST'])
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sheet_delete(request):
    user = request.user
    sheet_id = request.data.get("Id")
    
    if not sheet_id:
        return Response({"msg": "Sheet ID is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        #global sheet inactive
        sheet = CharacterSheet.objects.get(id=sheet_id, owner=user)
        sheet.active = False
        sheet.save()
        # race sheet inactive
        race = sheet.race
        if race == CharacterSheet.Race.HUMAN:
            race_sheet = HumanSheets.objects.get(owner=user)
        elif race == CharacterSheet.Race.GNOME:
            race_sheet = GnomeSheets.objects.get(owner=user)
        elif race == CharacterSheet.Race.ELF:
            race_sheet = ElfSheets.objects.get(owner=user)
        elif race == CharacterSheet.Race.HALFLING:
            race_sheet = HalflingSheets.objects.get(owner=user)
        else:
            return Response({"msg": "Unknown race, cannot find associated race sheet."}, status=status.HTTP_400_BAD_REQUEST)

        # Mark the race sheet as inactive
        race_sheet.active = False
        race_sheet.save()



        return Response({"msg": f"Sheet with ID {sheet_id} marked as inactive for user {user.username}"}, status=status.HTTP_200_OK)

    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found or not owned by the user."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_sheet(request):
    # Ensure the user is authenticated through the token
    user = request.user  # The user is retrieved from the request, thanks to JWT authentication
    
    # Get the sheetID from the request data (using 'GET' method, consider changing to 'GET' parameter if needed)
    sheetID = request.query_params.get('sheetID')  # Changed to query params for GET request
    
    # Ensure the sheetID is provided
    if not sheetID:
        return Response({"msg": "Sheet ID is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Retrieve the CharacterSheet object for the authenticated user and the specific sheetID
    try:
        sheet = CharacterSheet.objects.get(id=sheetID, owner=user, active=True)
        
        # Prepare the base character sheet data
        sheet_data = {
            'sheet_name': sheet.sheet_name,
            'creation_time': sheet.creation_time,
            'race': sheet.get_race_display(),  # Human, Elf, etc. (using the Race choices for display)
            'active': sheet.active,
        }
        
        # Now, based on the race, we fetch race-specific data
        race = sheet.race
        race_sheet = None
        
        if race == CharacterSheet.Race.HUMAN:
            race_sheet = HumanSheets.objects.get(owner=user, char_name=sheet.sheet_name, active=True)
        elif race == CharacterSheet.Race.GNOME:
            race_sheet = GnomeSheets.objects.get(owner=user, char_name=sheet.sheet_name, active=True)
        elif race == CharacterSheet.Race.ELF:
            race_sheet = ElfSheets.objects.get(owner=user, char_name=sheet.sheet_name, active=True)
        elif race == CharacterSheet.Race.HALFLING:
            race_sheet = HalflingSheets.objects.get(owner=user, char_name=sheet.sheet_name, active=True)

        # If the specific race sheet is found, add race-specific data to the response
        if race_sheet:
            race_data = {
                'char_name': race_sheet.char_name,
                'char_class': race_sheet.get_char_class_display(),
                'char_gold': race_sheet.char_gold,
                'stats': {
                    'Strength': race_sheet.stat_Strength,
                    'Wisdom': race_sheet.stat_Wisdom,
                    'Dexterity': race_sheet.stat_Dexterity,
                    'Intelligence': race_sheet.stat_Intelligence,
                    'Constitution': race_sheet.stat_Constitution,
                    'Charisma': race_sheet.stat_Charisma,
                }
            }
            sheet_data['race_data'] = race_data
        else:
            sheet_data['race_data'] = None  # If race-specific data is not found
        
        return Response(sheet_data, status=status.HTTP_200_OK)

    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found or not owned by the user."}, status=status.HTTP_404_NOT_FOUND)

    except (HumanSheets.DoesNotExist, GnomeSheets.DoesNotExist, ElfSheets.DoesNotExist, HalflingSheets.DoesNotExist):
        return Response({"msg": "Race-specific sheet not found."}, status=status.HTTP_404_NOT_FOUND)