import os 
import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from ..models import CharacterSheet
from ..helper.Race_Filter import get_race_model

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getSheetRaceTraits(request):
    user = request.user
    sheetID = request.data.get('id')
    traits_path = os.path.join(os.path.dirname(__file__), '../misc/traits.json')

    try:
        with open(traits_path, "r") as file:
            data = json.load(file)
    except FileNotFoundError:
        return Response({"msg": "Traits file not found."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except json.JSONDecodeError:
        return Response({"msg": "Error decoding traits file."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        character_sheet = CharacterSheet.objects.get(owner=user, id=sheetID)
        
        race_map = {
            1: "Human",
            2: "Gnome",
            3: "Elf",
            4: "Halfling"
        }

        race_name = race_map.get(character_sheet.race)

        if race_name and race_name in data["races"]:
            race_data = data["races"][race_name]
            return Response({
                "features": race_data.get("Race Features", []),
                "languages": race_data.get("Languages", [])
            })
        else:
            return Response({"msg": "Invalid race."}, status=status.HTTP_400_BAD_REQUEST)
    
    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getClassFeats(request):
    user = request.user
    char_name = request.data.get('char_name')
    feats_path = os.path.join(os.path.dirname(__file__), '../misc/classFeats.json')

    try:
        with open(feats_path, "r", encoding="utf-8") as file:
            data = json.load(file)
    except FileNotFoundError:
        return Response({"msg": "Class feats file not found."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return Response({"msg": "Error decoding class feats file."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    class_features = data.get("classes", {})

    try:
        character_sheet = CharacterSheet.objects.get(owner=user, char_name=char_name)
        char_race = character_sheet.race

        race_model = get_race_model(char_race)
        if not race_model:
            return Response({"msg": "Invalid race option"}, status=status.HTTP_400_BAD_REQUEST)

        specific_sheet = race_model.objects.get(owner=user, char_name=char_name)

        class_feature_map = {
            1: "barbarian",
            2: "wizard",
            3: "cleric",
            4: "rogue"
        }
        class_key = class_feature_map.get(specific_sheet.char_class)

        if not class_key:
            return Response({"msg": "Invalid char_class"}, status=status.HTTP_400_BAD_REQUEST)

        response_data = class_features.get(class_key, [])
        return Response(response_data)

    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": f"An error occurred: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
