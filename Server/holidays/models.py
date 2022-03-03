from turtle import title
from django.db import models

# Create your models here.

class Holiday(models.Model):
    title = models.CharField(max_length=30, default=None)
    budget = models.IntegerField(default=None)
    created_at = models.DateTimeField(auto_now_add=True)


