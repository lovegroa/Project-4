# Generated by Django 4.0.3 on 2022-03-10 17:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('dates_voted', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='datevoted',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dates_voted', to=settings.AUTH_USER_MODEL),
        ),
    ]
