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
    # Ensure the user is authenticated through the token
    user = request.user  # The user is retrieved from the request, thanks to JWT authentication

    # Count the number of character sheets the logged-in user owns
    sheet_count = CharacterSheet.objects.filter(owner=user, active=1).count()

    # Return the sheet count in the response
    return Response({'username': user.username, 'sheet_count': sheet_count})

#Endpoint to create a sheet for the logged user 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sheet_creation(request):
    user = request.user

    # Check if the user already has 3 character sheets
    sheet_count = CharacterSheet.objects.filter(owner=user, active=True).count()
    if sheet_count >= 3:
        return Response({"msg": "You have reached the maximum of 3 character sheets."}, status=status.HTTP_400_BAD_REQUEST)

    # Get the race selection from the request data
    race = request.data.get('race')
    if race is None or int(race) not in [choice[0] for choice in CharacterSheet.Race.choices]:
        return Response({"msg": "Invalid race selection."}, status=status.HTTP_400_BAD_REQUEST)

    # Create a new character sheet with the selected race
    CharacterSheet.objects.create(owner=user, race=race)
    if race == 1:
        createHumanSheet(user)
    elif race == 2:
        createGnomeSheet(user)
    elif race == 3:
        createElfSheet(user)
    else:
        createHalflingSheet(user)

    return Response({
        "msg": f"New character sheet created for {user.username} with race {CharacterSheet.Race(race).label}."
        }, status=status.HTTP_201_CREATED)

#Endpoint to delete sheets for logged user 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sheet_delete(request, id):
    user = request.user  # Get the logged-in user
    
    try:
        # Get the sheet that belongs to the logged-in user with the given sheetID
        sheet = CharacterSheet.objects.get(id=id, owner=user)
        
        # Set the sheet to inactive (soft delete)
        sheet.active = False
        sheet.save()
        
        return Response({"msg": f"Sheet with ID {id} marked as inactive for user {user.username}"}, status=status.HTTP_200_OK)
    
    except CharacterSheet.DoesNotExist:
        # If the sheet does not exist or doesn't belong to the user, return an error response
        return Response({"msg": "Character sheet not found or not owned by the user."}, status=status.HTTP_404_NOT_FOUND)

