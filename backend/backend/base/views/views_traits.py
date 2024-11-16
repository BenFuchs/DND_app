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
    traits_path = 'misc/traits.json'

    # get traits.json data
    with open(traits_path, "r") as file:
        data = json.load(file)

    race_features = {
        race: details.get("Race Features", [])
        for race, details in data["races"].items()
    }

    try:
        # Get the character sheet associated with the current user
        character_sheet = CharacterSheet.objects.get(owner=user, id=sheetID)
        charName = character_sheet.char_name
        
        if character_sheet.race == 1:
            return Response(race_features.get("Human", []))  # Return race features for Human
        elif character_sheet.race == 2:
            return Response(race_features.get("Gnome", []))  # Return race features for Gnome
        elif character_sheet.race == 3:
            return Response(race_features.get("Elf", []))  # Return race features for Elf
        elif character_sheet.race == 4:
            return Response(race_features.get("Halfling", []))  # Return race features for Halfling
        else:
            return Response({"msg": "Invalid race."}, status=status.HTTP_400_BAD_REQUEST)
    except CharacterSheet.DoesNotExist:
        return Response({"msg": "Character sheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)