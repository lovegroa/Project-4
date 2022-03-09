# Generated by Django 4.0.3 on 2022-03-09 21:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('holidays', '0005_alter_holiday_join_code'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users_holidays', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userholiday',
            name='dates_voted_confirmed',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='userholiday',
            name='holiday_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_holidays', to='holidays.holiday'),
        ),
        migrations.AlterField(
            model_name='userholiday',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_holidays', to=settings.AUTH_USER_MODEL),
        ),
    ]
