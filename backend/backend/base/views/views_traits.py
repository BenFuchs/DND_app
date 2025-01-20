import os 
import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from ..models import CharacterSheet, HalflingSheets, HumanSheets, GnomeSheets, ElfSheets

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getSheetRaceTraits(request):
    user = request.user
    sheetID = request.data.get('id')
    traits_path = os.path.join(os.path.dirname(__file__), '../../../../misc/traits.json')
    # print(traits_path)
    # get traits.json data
    try:
        with open(traits_path, "r") as file:
            data = json.load(file)
    except FileNotFoundError:
        return Response({"msg": "Traits file not found."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except json.JSONDecodeError:
        return Response({"msg": "Error decoding traits file."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    race_features = {
        race: details.get("Race Features", [])
        for race, details in data["races"].items()
    }

    try:
        # Get the character sheet associated with the current user
        character_sheet = CharacterSheet.objects.get(owner=user, id=sheetID)
        charName = character_sheet.char_name
        
        race_map = {
            1: "Human",
            2: "Gnome",
            3: "Elf",
            4: "Halfling"
        }
        
        race_name = race_map.get(character_sheet.race)
        if race_name:
            return Response(race_features.get(race_name, []))  # Return race features
        else:
            return Response({"msg": "Invalid race."}, status=status.HTTP_400_BAD_REQUEST)
    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error: {e}")
        
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getClassFeats(request):
    user = request.user
    char_name = request.data.get('char_name')
    feats_path = os.path.join(os.path.dirname(__file__), '../../../../misc/classFeats.json')

    try:
        with open(feats_path, "r", encoding="utf-8") as file:
            data = json.load(file)
    except FileNotFoundError:
        return Response({"msg": "Class feats file not found."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return Response({"msg": "Error decoding class feats file."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    class_features = data.get("classes", {})
    print(f"class_features: {class_features}")

    try:
        # Get the character sheet associated with the current user
        character_sheet = CharacterSheet.objects.get(owner=user, char_name=char_name)
        char_race = character_sheet.race

        race_sheet_model = {
            1: HumanSheets,
            2: GnomeSheets,
            3: ElfSheets,
            4: HalflingSheets
        }.get(char_race)

        if not race_sheet_model:
            return Response({"msg": "Invalid race option"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the specific sheet
        specific_sheet = race_sheet_model.objects.get(owner=user, char_name=char_name)

        # Map char_class to class features
        class_feature_map = {
            1: "barbarian",
            2: "wizard",
            3: "cleric",
            4: "rogue"
        }
        class_key = class_feature_map.get(specific_sheet.char_class)

        if not class_key:
            return Response({"msg": "Invalid char_class"}, status=status.HTTP_400_BAD_REQUEST)

        # Debugging: Print the class features and class key
        print(f"class_features: {class_features}")
        print(f"class_key: {class_key}")

        # Get the class features and return
        response_data = class_features.get(class_key, [])
        print(f"response_data: {response_data}")  # Debugging
        return Response(response_data)

    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": f"An error occurred: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)