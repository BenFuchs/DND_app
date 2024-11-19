from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from ..models import CharacterSheet
from ..helper.raceSheets import * 
from ..serializers import HumanSheetsSerializer, GnomeSheetsSerializer, ElfSheetsSerializer, HalflingSheetsSerializer


# Endpoint to check how many sheets are owned by current logged user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def logged_sheetNum_check(request):
    user = request.user
    character_sheets = CharacterSheet.objects.filter(owner=user, active=True)
    sheet_data = []

    for sheet in character_sheets:
        sheet_name = "Unnamed"
        race_model = None

        if sheet.race == CharacterSheet.Race.HUMAN:
            race_model = HumanSheets
        elif sheet.race == CharacterSheet.Race.GNOME:
            race_model = GnomeSheets
        elif sheet.race == CharacterSheet.Race.ELF:
            race_model = ElfSheets
        elif sheet.race == CharacterSheet.Race.HALFLING:
            race_model = HalflingSheets

        if race_model:
            # Debugging: Log the query and results
            print(f"Debug: Fetching from {race_model.__name__} for sheet ID {sheet.id}, sheet name: {sheet.char_name}")
            race_sheet = race_model.objects.filter(owner=user, race=sheet).first()
            print(f"Debug: Query Result: {race_sheet}")
            if race_sheet:
                sheet_name = race_sheet.char_name

        sheet_data.append({
            'sheet_name': sheet.char_name,
            'race': sheet.get_race_display(),
            'creation_time': sheet.creation_time,
            'sheetID': sheet.id
        })

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
    CharacterSheet.objects.create(owner=user, race=race, char_name=user_Name)
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
        # Mark global sheet as inactive
        sheet = CharacterSheet.objects.get(id=sheet_id, owner=user, active=True)
        sheet.active = False
        sheet.save()

        # Fetch associated race sheet
        race = sheet.race
        race_sheet = None
        if race == CharacterSheet.Race.HUMAN:
            race_sheet = HumanSheets.objects.filter(owner=user, char_name=sheet.char_name, active=True).first()
        elif race == CharacterSheet.Race.GNOME:
            race_sheet = GnomeSheets.objects.filter(owner=user, char_name=sheet.char_name, active=True).first()
        elif race == CharacterSheet.Race.ELF:
            race_sheet = ElfSheets.objects.filter(owner=user, char_name=sheet.char_name, active=True).first()
        elif race == CharacterSheet.Race.HALFLING:
            race_sheet = HalflingSheets.objects.filter(owner=user, char_name=sheet.char_name, active=True).first()

        if race_sheet:
            # Mark the race-specific sheet as inactive
            race_sheet.active = False
            race_sheet.save()
        else:
            return Response({"msg": "No active race-specific sheet found."}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "msg": f"Sheet with ID {sheet_id} marked as inactive for user {user.username}."
        }, status=status.HTTP_200_OK)

    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found or not owned by the user."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": "An error occurred while deleting the sheet."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_sheet(request, sheetID):
    # Ensure the user is authenticated through the token
    user = request.user  # The user is retrieved from the request, thanks to JWT authentication
    
    try:
        # Get the parent sheet      
        parent_sheet = CharacterSheet.objects.get(id=sheetID, active=True)

        # Check the race of the sheet
        sheet_race = parent_sheet.race
        parent_sheet_owner = parent_sheet.owner
        sheet_name = parent_sheet.char_name

        if sheet_race == 1:  
            char_sheet = HumanSheets.objects.get(owner=parent_sheet_owner, char_name = sheet_name, active=True)
            serializer = HumanSheetsSerializer(char_sheet)
            return Response({"data": serializer.data})
        elif sheet_race ==2:
            char_sheet = GnomeSheets.objects.get(owner=parent_sheet_owner, char_name = sheet_name, active=True)
            serializer = GnomeSheetsSerializer(char_sheet)
            return Response({"data": serializer.data})
        elif sheet_race ==3:
            char_sheet = ElfSheets.objects.get(owner=parent_sheet_owner, char_name = sheet_name, active=True)
            serializer = ElfSheetsSerializer(char_sheet)
            return Response({"data": serializer.data})
        elif sheet_race ==4:
            char_sheet = HalflingSheets.objects.get(owner=parent_sheet_owner, char_name = sheet_name, active=True)
            serializer = HalflingSheetsSerializer(char_sheet)
            return Response({"data": serializer.data})

    except CharacterSheet.DoesNotExist:
        return Response({"msg": "CharacterSheet not found."}, status=404)
    except HumanSheets.DoesNotExist:
        return Response({"msg": "HumanSheets not found for the given owner."}, status=404)
    except Exception as e:
        # Log the error for debugging if needed
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=500)

    return Response({"msg": "No data found for this sheet."}, status=404)