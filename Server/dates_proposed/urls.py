from django.urls import path
from .views import DateProposedView

urlpatterns = [
    path('', DateProposedView.as_view())

]