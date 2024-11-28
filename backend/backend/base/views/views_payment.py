from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models import Order, UserProfile
from ..serializers import OrderSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def orderView(request):
    user = request.user
    serializer = OrderSerializer(data=request.data)
    print(request.data)
    
    if serializer.is_valid():
        # Save the order to the database
        serializer.save()
        
        # Increment the user's extra_sheets field
        user_profile = UserProfile.objects.filter(user=user).first() # Adjust this if you directly extended the User model
        user_profile.extra_sheets += 1
        print(user_profile.extra_sheets)
        user_profile.save()
        
        return Response(
            {"message": "Order created successfully", "order": serializer.data},
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
