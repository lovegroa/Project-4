from rest_framework import serializers
from ..models import Holiday # import Festival model


class HolidaySerializer(serializers.ModelSerializer):

    class Meta:
        model = Holiday
        fields = '__all__'