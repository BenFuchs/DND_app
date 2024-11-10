from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import *

# login
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)     
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff

        return token
    
class HumanSheetsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HumanSheets
        fields = '__all__'  # Or list the specific fields you want to serialize

class GnomeSheetsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GnomeSheets
        fields = '__all__'  # Or list the specific fields you want to serialize

class ElfSheetsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElfSheets
        fields = '__all__'  # Or list the specific fields you want to serialize

class HalflingSheetsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HalflingSheets
        fields = '__all__'  # Or list the specific fields you want to serialize