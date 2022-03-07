from django.urls import path
from .views import HolidayView

urlpatterns = [
    path('new/', HolidayView.as_view())

]

