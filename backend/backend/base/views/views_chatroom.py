from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings
from ..models import ChatRoom, CharacterSheet, HumanSheets, HalflingSheets, ElfSheets, GnomeSheets
from enum import Enum
import jwt

class RaceSheets(Enum):
    HumanSheets = 1
    GnomeSheets = 2
    ElfSheets = 3
    HalflingSheets = 4


@api_view(['POST'])
def CreateRoom(request):
    room_name = request.data.get('room_name')
    password = request.data.get('password')

    if ChatRoom.objects.filter(room_name=room_name).exists():
        return Response({'error': 'Room name already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    # Save the room with a hashed password
    ChatRoom.objects.create(room_name=room_name, password=make_password(password))
    return Response({'message': 'Room created successfully.'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def GetRooms(request):
    # Use .all() to fetch all rooms
    existing_rooms = ChatRoom.objects.all()
    
    # Iterate over the rooms and print each room's name
    room_names = [room.room_name for room in existing_rooms]
    # print(room_names)  # or return room_names in the response
    
    # Return a response with the list of room names
    return Response({'rooms': room_names}, status=status.HTTP_200_OK)

@api_view(['POST'])
def verify_room_password(request):
    room_name = request.data.get('room_name')
    entered_password = request.data.get('password')

    try:
        room = ChatRoom.objects.get(room_name=room_name)
        if check_password(entered_password, room.password): 
            user = request.user
            # parentSheet = CharacterSheet.objects.filter(owner=user)
            # print(parentSheet.char_name)
            return Response({"valid": True})
        else:
            return Response({"valid": False}, status=400)
    except ChatRoom.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)
    
@api_view(['POST'])
def WIP(request):
    # Get the JWT token from the request body (assuming the token is sent in the request body)
    token = request.data.get('SDT')  # Adjust if you pass the token differently, e.g., as URL parameter
    
    if not token:
        return Response({"error": "Token is required"}, status=400)

    try:
        # Decode the JWT token
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

        # Extract user data from the payload
        logged_in_user_id = decoded_token.get('id')
        logged_in_user_name = decoded_token.get('char_name')
        logged_in_user_race = decoded_token.get('race')

        race_models = {
            'HumanSheets': HumanSheets,
            'GnomeSheets': GnomeSheets,
            'ElfSheets': ElfSheets,
            'HalflingSheets': HalflingSheets,
        }

        # Check if the user data is valid
        if not logged_in_user_id or not logged_in_user_name:
            return Response({"error": "Invalid token data"}, status=400)

        # Optionally, you can fetch the character sheet from the database if needed
        # user_char = CharacterSheet.objects.get(id=logged_in_user_id, char_name=logged_in_user_name)
        try:
            user_race_sheet_data = RaceSheets(logged_in_user_race)  
            user_race_sheet = user_race_sheet_data.name  # Get the enum name (e.g., "HumanSheets")

            race_model = race_models.get(user_race_sheet)
            RaceSheet = race_model.objects.get(char_name = logged_in_user_name)
            logged_in_user_gold = RaceSheet.char_gold
            print(logged_in_user_gold)
        except ValueError:
            return Response({"error": "Invalid race number"}, status=400)
        except race_model.DoesNotExist:
            return Response({"error": "Character sheet not found for the user"}, status=404)

        # Return the user's gold (from the token)
        return Response({"gold": logged_in_user_gold})

    except jwt.ExpiredSignatureError:
        return Response({"error": "Token has expired"}, status=400)
    except jwt.InvalidTokenError:
        return Response({"error": "Invalid token"}, status=400)