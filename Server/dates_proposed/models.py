from django.db import models

# Create your models here.

class DateProposed(models.Model):

    holiday_id = models.ForeignKey(
        "holidays.Holiday",
        related_name="dates_proposed",
        on_delete = models.CASCADE
    )
    start_date = models.DateTimeField(default=None, blank=True, null=True)
    end_date = models.DateTimeField(default=None, blank=True, null=True)

