from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    email = models.CharField(max_length=50, unique=True) # update email field to be unique
    first_name = models.CharField(max_length=50) # add new field
    last_name = models.CharField(max_length=50) # add new field
    profile_image = models.CharField(max_length=300, blank=True, default='https://i.pinimg.com/736x/b3/b2/c9/b3b2c9fdf7d8fd04df890417578ec0d7.jpg') # add new field

    def __str__(self):
        return f"User: {self.first_name} {self.last_name}"
