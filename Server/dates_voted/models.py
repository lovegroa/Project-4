from django.db import models

# Create your models here.

class DateVoted(models.Model):

    user_id = models.ForeignKey(
        "jwt_auth.User",
        related_name="user_voted",
        on_delete = models.CASCADE
    )
    date_proposed_id = models.ForeignKey(
        "dates_proposed.DateProposed",
        related_name="dates_voted",
        on_delete = models.CASCADE
    )
    date_confirmed = models.BooleanField(default=False)

