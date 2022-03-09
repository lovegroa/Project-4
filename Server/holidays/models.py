from django.db import models
import string
import random

# Create your models here.
def id_generator(size=16, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

class Holiday(models.Model):
    title = models.CharField(max_length=30, default=None)
    join_code = models.CharField(max_length=16, default=id_generator(), blank=True, null=True)
    budget = models.IntegerField(default=None, blank=True, null=True)
    budget_currency = models.CharField(max_length=1, blank=True, null=True)
    start_date = models.DateTimeField(default=None, blank=True, null=True)
    end_date = models.DateTimeField(default=None, blank=True, null=True)
    destination = models.CharField(default=None, max_length=30, blank=True, null=True)
    image = models.CharField(max_length=500, blank=True, null=True, default='https://content.tui.co.uk/adamtui/2021_12/7_13/878f7fde-84ca-4804-85a5-adf700e44176/LOC_MDV_shutterstock_1938868960WebOriginalCompressed.jpg?i10c=img.resize(width:658);img.crop(width:658%2Cheight:370)')
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    created_by = models.ForeignKey(
        "jwt_auth.User",
        related_name="holidays",
        on_delete = models.CASCADE

    )




