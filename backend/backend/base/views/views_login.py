from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from ..serializers import MyTokenObtainPairSerializer
from ..models import CharacterSheet
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['GET'])
def test(req):
    return Response('test')

# Login endpoint
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Registration endpoint
@api_view(['POST'])
def register(request):
    user = User.objects.create_user(
                username=request.data['username'],
                # email=request.data['email'],
                password=request.data['password']
            )
    user.is_active = True
    user.is_staff = False
    user.save()
    return Response("new user registered")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()  # Blacklist the refresh token
        return Response({"message": "Logout successful"}, status=204)
    except Exception as e:
        return Response({"error": str(e)}, status=400)