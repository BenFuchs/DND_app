from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from ..models import CharacterSheet, HalflingSheets, HumanSheets, GnomeSheets, ElfSheets

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
        elif character_sheet.race.race == 2:
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