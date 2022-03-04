from django.urls import path
from .views import GetProfile, RegisterView, LoginView, VerifyEmail

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('profile/', GetProfile.as_view()),
    path('verify_email/', VerifyEmail.as_view())

]

