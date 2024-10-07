from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from ..serializers import MyTokenObtainPairSerializer
from ..models import CharacterSheet

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

