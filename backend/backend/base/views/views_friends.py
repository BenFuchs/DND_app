from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from django.db.models import Q
from ..models import Friendship
from django.contrib.auth.models import User


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserFriends(request):
    user = request.user

    # Use Q for OR queries
    accepted_friendships = Friendship.objects.filter(
        Q(from_user=user) | Q(to_user=user),
        status='ACCEPTED'
    )

    # Extract friend user objects
    friends = [
    {
        'id': f.to_user.id if f.from_user == user else f.from_user.id,
        'username': f.to_user.username if f.from_user == user else f.from_user.username,
    }
    for f in accepted_friendships
    if f.from_user and f.to_user  # Ensures that both users are not None
]

    return Response({"friends": friends})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addFriendToList(request):
    user = request.user
    friend_id = request.data.get('friend_id')

    # Validate friend_id
    try:
        friend = User.objects.get(id=friend_id)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=404)

    # Prevent sending friend request to self
    if friend == user:
        return Response({"detail": "You cannot add yourself as a friend"}, status=400)

    # Create or update friendship
    friendship, created = Friendship.objects.update_or_create(
        from_user=user,
        to_user=friend,
        defaults={'status': Friendship.PENDING}
    )
    
    if created:
        return Response({"detail": "Friend request sent"})
    else:
        return Response({"detail": "Friendship already exists or updated"})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_to_friend_request(request):
    friendship_id = request.data.get('friendship_id')
    action = request.data.get('action')  # 'accept' or 'reject'

    try:
        friendship = Friendship.objects.get(id=friendship_id, to_user=request.user)
    except Friendship.DoesNotExist:
        return Response({'detail': 'Friend request not found'}, status=404)

    if action == 'accept':
        friendship.status = Friendship.ACCEPTED
        friendship.save()
        return Response({'detail': 'Friend request accepted'})
    elif action == 'reject':
        friendship.status = Friendship.REJECTED
        friendship.save()
        return Response({'detail': 'Friend request rejected'})
    else:
        return Response({'detail': 'Invalid action'}, status=400)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def removeFriendship(request):
    friendship_id = request.data.get('friendship_id')
    try: 
        friendship = Friendship.objects.get(id=friendship_id, from_user=request.user)
    except Friendship.DoesNotExist:
        return Response({'detail': 'Friend not found'}, status=404)
    
    friendship.status = Friendship.REJECTED
    friendship.save();
    return Response({"detail": "Friend removed"})
