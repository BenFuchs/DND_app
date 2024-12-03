from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.contrib.auth.hashers import make_password, check_password
from ..models import ChatRoom, CharacterSheet

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