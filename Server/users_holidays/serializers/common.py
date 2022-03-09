from rest_framework import serializers

from ..models import UserHoliday


class UserHolidaySerializer(serializers.ModelSerializer):
        
    class Meta:
        model = UserHoliday
        fields = '__all__'