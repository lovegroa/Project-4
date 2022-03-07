from django.urls import path
from .views import UserHolidayView

urlpatterns = [
    path('', UserHolidayView.as_view())

]