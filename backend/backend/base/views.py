from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from .serializers import MyTokenObtainPairSerializer
from .models import CharacterSheet

@api_view(['GET'])
def index(req):
    return Response('hello')

# Login endpoint
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Registration endpoint
@api_view(['POST'])
def register(request):
    user = User.objects.create_user(
                username=request.data['username'],
                email=request.data['email'],
                password=request.data['password']
            )
    user.is_active = True
    user.is_staff = False
    user.save()
    return Response("new user registered")

# Endpoint to check how many sheets are owned by current logged user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def logged_sheetNum_check(request):
    # Ensure the user is authenticated through the token
    user = request.user  # The user is retrieved from the request, thanks to JWT authentication

    # Count the number of character sheets the logged-in user owns
    sheet_count = CharacterSheet.objects.filter(owner=user).count()

    # Return the sheet count in the response
    return Response({'username': user.username, 'sheet_count': sheet_count})

#Endpoint to create a sheet for the logged user 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sheet_creation(request):
    user = request.user

    # Get or create the UserSheetTracker for the user
    sheet_count = CharacterSheet.objects.filter(owner=user, active=1).count()
    print(sheet_count)


    # Check if the user already has 3 character sheets
    if sheet_count >= 3:
        return Response({"msg": "You have reached the maximum of 3 character sheets."}, status=status.HTTP_400_BAD_REQUEST)

    # Get the sheet name from the request data
    sheet_name = request.data.get('sheet_name', 'Unnamed Sheet')  # default to 'Unnamed Sheet' if not provided

    # Create a new character sheet
    CharacterSheet.objects.create(owner=user, Sheet_name=sheet_name)

    # Update the number of sheets in the UserSheetTracker


    return Response({"msg": f"New sheet ... created for {user.username}"}, status=status.HTTP_201_CREATED)

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