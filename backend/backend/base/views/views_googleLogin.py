from rest_framework.views import APIView
from rest_framework.response import Response
from google.oauth2 import id_token
from google.auth.transport.requests import Request
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from ..models import UserProfile
class GoogleLoginView(APIView):
    def post(self, request):
        token = request.data.get('token')
        try:
            id_info = id_token.verify_oauth2_token(token, Request(), settings.GOOGLE_CLIENT_ID)
            email = id_info['email']

            # Create or get the user based on id_info
            user, created = User.objects.get_or_create(email=email)
            user_profile, created = UserProfile.objects.get_or_create(user=user)

            # Create a refresh and access token using SimpleJWT
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            return Response({
                'access': str(access),
                'refresh': str(refresh)
            })

        except ValueError:
            return Response({'error': 'Invalid token'}, status=400)