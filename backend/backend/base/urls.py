from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path('', views.test),
    path('login/', views.MyTokenObtainPairView.as_view()),
    path('register/', views.register),
    path('sheetNum/', views.logged_sheetNum_check),
    path('sheetCreation/', views.sheet_creation),
    path('sheetDel/<int:id>/', views.sheet_delete),
    path('statRoll/', views.statRoll),
]
