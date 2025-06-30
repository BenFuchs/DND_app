from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models import CharacterSheet, UserProfile
from ..helper.raceSheets import *
from ..helper.Race_Filter import get_race_model
from ..serializers import HumanSheetsSerializer, GnomeSheetsSerializer, ElfSheetsSerializer, HalflingSheetsSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def logged_sheetNum_check(request):
    user = request.user
    character_sheets = CharacterSheet.objects.filter(owner=user, active=True)
    sheet_data = []
    max_sheets = 3
    user_profile = UserProfile.objects.filter(user=user).first()
    extra_sheets = user_profile.extra_sheets
    if extra_sheets:
        max_sheets += extra_sheets

    for sheet in character_sheets:
        sheet_name = "Unnamed"
        race_model = get_race_model(sheet.race)

        if race_model:
            print(f"Debug: Fetching from {race_model.__name__} for sheet ID {sheet.id}, sheet name: {sheet.char_name}")
            race_sheet = race_model.objects.filter(owner=user, race=sheet.race).first()
            print(f"Debug: Query Result: {race_sheet}")
            if race_sheet:
                sheet_name = race_sheet.char_name
                print(f"Debug: Sheet Name: {sheet_name}")

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
        'max_sheets': max_sheets,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sheet_creation(request):
    user = request.user
    data = request.data.get('data', {})
    max_sheets = 3
    user_stats = data.get('stats')
    user_Name = data.get('characterName')
    user_Class = data.get('charClass')

    sheet_count = CharacterSheet.objects.filter(owner=user, active=True).count()
    user_profile = UserProfile.objects.filter(user=user).first()
    extra_sheet_count = user_profile.extra_sheets
    if extra_sheet_count:
        max_sheets += extra_sheet_count

    if sheet_count >= max_sheets:
        return Response({"msg": "You have reached the maximum number of character sheets, if you would like more please purchase one."}, status=status.HTTP_400_BAD_REQUEST)

    race = data.get('race')
    try:
        race = int(race)
        print("race debug", race)
    except (TypeError, ValueError):
        return Response({"msg": "Invalid race selection."}, status=status.HTTP_400_BAD_REQUEST)

    CharacterSheet.objects.create(owner=user, race=race, char_name=user_Name)

    if race == 1:
        createHumanSheet(user, user_stats, user_Name, user_Class)
    elif race == 2:
        createGnomeSheet(user, user_stats, user_Name, user_Class)
    elif race == 3:
        createElfSheet(user, user_stats, user_Name, user_Class)
    elif race == 4:
        print("race is 4")
        createHalflingSheet(user, user_stats, user_Name, user_Class)
    else:
        return Response({"Error": "Invalid race selection"})

    return Response({
        "msg": f"New character sheet created for {user.username} with race {CharacterSheet.Race(race).label}."
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sheet_delete(request):
    user = request.user
    sheet_id = request.data.get("Id")

    if not sheet_id:
        return Response({"msg": "Sheet ID is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        sheet = CharacterSheet.objects.get(id=sheet_id, owner=user, active=True)
        sheet.active = False
        sheet.save()

        race_model = get_race_model(sheet.race)
        if not race_model:
            return Response({"msg": "Race model not found."}, status=status.HTTP_400_BAD_REQUEST)

        race_sheet = race_model.objects.filter(owner=user, char_name=sheet.char_name, active=True).first()

        if race_sheet:
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
    user = request.user
    try:
        parent_sheet = CharacterSheet.objects.get(id=sheetID, active=True)
        race_model = get_race_model(parent_sheet.race)
        if not race_model:
            return Response({"msg": "Invalid race."}, status=400)

        char_sheet = race_model.objects.get(owner=parent_sheet.owner, char_name=parent_sheet.char_name, active=True)

        serializer_map = {
            1: HumanSheetsSerializer,
            2: GnomeSheetsSerializer,
            3: ElfSheetsSerializer,
            4: HalflingSheetsSerializer,
        }
        serializer_class = serializer_map.get(parent_sheet.race)
        if not serializer_class:
            return Response({"msg": "No serializer found for race."}, status=400)

        serializer = serializer_class(char_sheet)
        return Response({"data": serializer.data})

    except CharacterSheet.DoesNotExist:
        return Response({"msg": "CharacterSheet not found."}, status=404)
    except race_model.DoesNotExist:
        return Response({"msg": "Race-specific sheet not found."}, status=404)
    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=500)

    return Response({"msg": "No data found for this sheet."}, status=404)
