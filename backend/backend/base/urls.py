from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path('', views.index),
    path('login/', views.MyTokenObtainPairView.as_view()),
    path('register/', views.register),
]
