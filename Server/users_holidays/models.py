from django.db import models

# Create your models here.

class UserHoliday(models.Model):
    user_id = models.ForeignKey(
        "jwt_auth.User",
        related_name="user_holidays",
        on_delete = models.CASCADE
        
    )
    holiday_id = models.ForeignKey(
        "holidays.Holiday",
        related_name="user_holidays",
        on_delete = models.CASCADE
        
    )
    is_admin = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)
    dates_confirmed = models.BooleanField(default=False)
    budget = models.IntegerField(default=None, blank=True, null=True)
    dates_voted_confirmed = models.BooleanField(default=False)







