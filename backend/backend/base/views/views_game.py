from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from ..models import CharacterSheet, HalflingSheets, HumanSheets, GnomeSheets, ElfSheets

from ..helper.modifiers import modifiers

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def currencyCalc(request):
    user = request.user  # The user is retrieved from the request, thanks to JWT authentication
    amount = request.data.get("amount")    # Amount to add or subtract
    action = request.data.get("action")    # 'add' or 'subtract'
    race = request.data.get("race")
    if amount is None or action is None:
        return Response({"msg": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Get the character sheet associated with the current user
        character_sheet = CharacterSheet.objects.get(owner=user, race=race)
        # Now we need to access the race-specific table based on sheet_race
        if character_sheet.race == 1:
            char_sheet = HumanSheets.objects.get(owner=character_sheet.owner)
        elif character_sheet.race == 2:
            char_sheet = GnomeSheets.objects.get(owner=character_sheet.owner)
        elif character_sheet.race == 3:
            char_sheet = ElfSheets.objects.get(owner=character_sheet.owner)
        elif character_sheet.race == 4:
            char_sheet = HalflingSheets.objects.get(owner=character_sheet.owner)
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
        # Get the character sheet associated with the current user
        character_sheet = CharacterSheet.objects.get(owner=user, race=race)
        print(character_sheet.race)
        # Now we need to access the race-specific table based on sheet_race
        if character_sheet.race == 1:
            char_sheet = HumanSheets.objects.get(owner=character_sheet.owner, id=sheetID)
            print(char_sheet.char_gold)
        elif character_sheet.race == 2:
            char_sheet = GnomeSheets.objects.get(owner=character_sheet.owner, id=sheetID)
            print("test")
        elif character_sheet.race == 3:
            char_sheet = ElfSheets.objects.get(owner=character_sheet.owner, id=sheetID)
            print(char_sheet.char_gold)
        elif character_sheet.race == 4:
            char_sheet = HalflingSheets.objects.get(owner=character_sheet.owner, id=sheetID)
            print(char_sheet.char_gold)
        else:
            return Response({"msg": "Invalid race."}, status=status.HTTP_400_BAD_REQUEST)

        char_Gold = char_sheet.char_gold
        return Response(char_Gold)

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

        # Collect stat modifiers in a dictionary
        stat_modifiers = {field: modifiers(getattr(char_sheet, field, None)) for field in stat_fields}

        return Response({"Mods": stat_modifiers})
       
    except CharacterSheet.DoesNotExist:
        return Response({"msg": "CharacterSheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except (HumanSheets.DoesNotExist, GnomeSheets.DoesNotExist, ElfSheets.DoesNotExist, HalflingSheets.DoesNotExist):
        return Response({"msg": "Race-specific sheet not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Log the error for debugging if needed
        print(f"Error: {e}")
        return Response({"msg": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
