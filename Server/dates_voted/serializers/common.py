from rest_framework import serializers
from ..models import DateVoted


class DateVotedSerializer(serializers.ModelSerializer):

    class Meta:
        model = DateVoted
        fields = '__all__'
