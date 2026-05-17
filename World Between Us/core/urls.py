from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('index/', views.index, name='index_alt'),
    path('register/', views.user_register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('create_post/', views.create_post, name='create_post'),
    path('api/grievances/', views.api_submit_grievance, name='api_submit_grievance'),
    path('api/applications/', views.api_submit_application, name='api_submit_application'),
]

