from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    email = models.CharField(max_length=50, unique=True) # update email field to be unique
    first_name = models.CharField(max_length=50) # add new field
    last_name = models.CharField(max_length=50) # add new field
    profile_image = models.CharField(max_length=300) # add new field

    def __str__(self):
        return f"{self.first_name} {self.last_name} "
