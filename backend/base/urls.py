from django.contrib import admin
from django.urls import path
from .views.views_googleLogin import GoogleLoginView
from rest_framework_simplejwt.views import  TokenRefreshView
from . import views
from . import consumers

urlpatterns = [
    path('', views.test), #testing endpoint
    #Login Register endpoints
    path('login/', views.MyTokenObtainPairView.as_view()),
    path('register/', views.register),
    path('logout/', views.logout),
    path('refresh/', TokenRefreshView.as_view()),
    #Google Login endpoint
    path('api/auth/google/', GoogleLoginView.as_view(), name='google-login'),


    #Sheet endpoints
    path('sheetNum/', views.logged_sheetNum_check),
    path('sheetCreation/', views.sheet_creation),
    path('sheet_delete/', views.sheet_delete),
    path('getSheetData/<int:sheetID>/', views.get_specific_sheet),
    
    #Game endpoints
    path('statRoll/', views.statRoll),
    path('currencyCalc/', views.currencyCalc),
    path('getGold/', views.getGold),
    path('getMods/', views.getMods),
    path('diceRoll/', views.nSidedDice),
    path('SDT/', views.create_sheet_token),
    path('levelUp/', views.levelUp),

    #Inventory endpoints
    path('getInventory/', views.getInventory),
    path('searchItems/', views.searchItems),
    path('addToInventory/', views.addItemToPlayerInv),
    path('removeItem/', views.removeItem),
    path('itemData/', views.getItemInfo),
    
    #Traits endpoints
    path('getRaceFeatures/', views.getSheetRaceTraits),
    path('getClassFeatures/', views.getClassFeats),

    #ChatRoom endpoints
    path('createChatRoom/', views.CreateRoom),
    path('getChatRooms/', views.GetRooms),
    path('verifyRoomPassword/', views.verify_room_password),
    path('deleteChatRoom/', views.delete_chatroom),

    #Paypal endpoints
    path('orders/', views.orderView),

    #Friends list endpoints
    path('getAllFriends/', views.getUserFriends),
    path('sendFriendRequest/', views.sendFriendRequest),
    path('respondToFriendRequest/', views.respond_to_friend_request),
    path('removeFriend/', views.removeFriendship),
    path('getPendingRequests/', views.getPendingRequests),
    path('searchUsers/', views.searchUsers),

]   

