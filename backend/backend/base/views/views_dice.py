from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from ..models import CharacterSheet
from ..helper.raceSheets import * 
from ..helper.statRoller import * 

@api_view(['GET'])
def statRoll(request):
    user_stats = allStatsRoll()
    return Response({"stats": user_stats})
# button will make a request to this, give the user stats.
# after user selects stats to statBlocks, return new list 