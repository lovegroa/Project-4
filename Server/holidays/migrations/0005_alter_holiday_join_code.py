# Generated by Django 4.0.3 on 2022-03-10 17:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('holidays', '0004_alter_holiday_join_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='holiday',
            name='join_code',
            field=models.CharField(blank=True, default='1EDGBKHXVXWU8YB2', max_length=16, null=True),
        ),
    ]
