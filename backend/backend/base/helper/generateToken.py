import jwt
import json
from datetime import datetime, timedelta
from django.conf import settings
from ..models import ElfSheets,HumanSheets,HalflingSheets,GnomeSheets

def create_jwt(payload):
    """
    Helper function to create a JWT token with the given payload.
    """
    try:
        header = {"alg": "HS256", "typ": "JWT"}
        token = jwt.encode(
            payload,
            settings.SECRET_KEY,
            algorithm="HS256",
            headers=header
        )
        return token
    except Exception as e:
        print(f"Error creating JWT: {e}")
        return None

def generate_user_token(user, sheet_data):
    """
    Generates a JWT token for a user with the given sheet data.
    """
    # Ensure sheet_data is a dictionary
    if isinstance(sheet_data, str):
        sheet_data = json.loads(sheet_data)  # Parse the JSON string into a dictionary
    
    # Access the 'data' key inside the parsed JSON
    sheet_data = sheet_data.get("data", {})  # Use .get() to avoid key errors if 'data' is missing

    print(sheet_data['race'])  # Now you should see the correct data dictionary
    charRace = sheet_data['race']
    charName = sheet_data['char_name']
    if charRace == 1:
        charID = HumanSheets.objects.filter(race=1, char_name=charName).values_list('id', flat=True).first()
        print(charID)
    elif charRace == 2:
        charID = GnomeSheets.objects.filter(race=2, char_name=charName).values_list('id', flat=True).first()
    elif charRace == 3:
        charID = ElfSheets.objects.filter(race=3, char_name=charName).values_list('id', flat=True).first()
    elif charRace == 4:
        charID = HalflingSheets.objects.filter(charRace=4, char_name=charName).values_list('id', flat=True).first()
    else:
        return "ERROR"


    
    payload = {
        "id": charID,
        "char_name": sheet_data["char_name"],
        "char_class": sheet_data["char_class"],
        "char_gold": sheet_data["char_gold"],
        "level": sheet_data["level"],
        "hitpoints": sheet_data["hitpoints"],
        "stat_Strength": sheet_data["stat_Strength"],
        "stat_Wisdom": sheet_data["stat_Wisdom"],
        "stat_Dexterity": sheet_data["stat_Dexterity"],
        "stat_Intelligence": sheet_data["stat_Intelligence"],
        "stat_Constitution": sheet_data["stat_Constitution"],
        "stat_Charisma": sheet_data["stat_Charisma"],
        "owner": user.id,
        "race": sheet_data["race"],
        "exp": datetime.utcnow() + timedelta(hours=1),  # Token expires in 1 hour
    }
    return create_jwt(payload)
