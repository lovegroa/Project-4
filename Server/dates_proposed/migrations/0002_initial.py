# Generated by Django 4.0.3 on 2022-03-10 17:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('holidays', '0001_initial'),
        ('dates_proposed', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='dateproposed',
            name='holiday_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dates_proposed', to='holidays.holiday'),
        ),
    ]
