from django.urls import path
from .views import DateVotedView

urlpatterns = [
    path('', DateVotedView.as_view())

]