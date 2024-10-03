from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# login
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)     
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff

        return token