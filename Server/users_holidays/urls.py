from django.urls import path
from .views import JoinUserHolidayView, UserHolidayView

urlpatterns = [
    path('', UserHolidayView.as_view()),
    path('join/', JoinUserHolidayView.as_view()),
    path('<int:pk>/', UserHolidayView.as_view())
]