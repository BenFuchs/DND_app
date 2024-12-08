from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.contrib.auth.hashers import make_password, check_password
from ..models import ChatRoom, CharacterSheet, HumanSheets, HalflingSheets, ElfSheets, GnomeSheets
from enum import Enum

class RaceSheets(Enum):
    HumanSheets = 1
    GnomeSheets = 2
    ElfSheets = 3
    HalflingSheets = 3


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
    user_id = request.data.get('Id')
    userName = request.data.get('username')
    
    user_char = CharacterSheet.objects.get(id=user_id, char_name=userName)
    user_race_num = user_char.race  # Assume this is an integer (1 for Human, 2 for Gnome, etc.)
    
    # Map race enum to the corresponding model class
    race_models = {
        'HumanSheets': HumanSheets,
        'GnomeSheets': GnomeSheets,
        'ElfSheets': ElfSheets,
        'HalflingSheets': HalflingSheets,
    }
    
    try:
        user_race_sheet_data = RaceSheets(user_race_num)  
        user_race_sheet = user_race_sheet_data.name  # Get the enum name (e.g., "HumanSheets")
        
        # Get the model class corresponding to the race
        race_model = race_models.get(user_race_sheet)
        if not race_model:
            return Response({"error": "Race model not found"}, status=400)
        
        # Fetch the race sheet data for the user
        raceSheet = race_model.objects.get(char_name=userName)
        userGold = raceSheet.char_gold
        print(userGold)

    except ValueError:
        return Response({"error": "Invalid race number"}, status=400)
    except race_model.DoesNotExist:
        return Response({"error": "Character sheet not found for the user"}, status=404)

    return Response({userGold})