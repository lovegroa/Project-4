from rest_framework import serializers
from ..models import DateProposed


class DateProposedSerializer(serializers.ModelSerializer):

    class Meta:
        model = DateProposed
        fields = '__all__'
