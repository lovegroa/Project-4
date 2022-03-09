from operator import mod
from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password
from inspect import currentframe, getframeinfo


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data):
        if data.get('password'):
            password = data.pop('password')
            password_confirmation = data.pop('password_confirmation')

            if password != password_confirmation:
                raise ValidationError({'password_confirmation': 'Does not match password'})
            # removed as it makes password criteria too strict and not clear how to display on front end
            # try:
            #     password_validation.validate_password(password)
            # except ValidationError as error:
            #     print (error)
            #     raise ValidationError ({'password': error})
            
            data['password'] = make_password(password)
        return data

    class Meta:
        model = User
        fields = ("id", "email", "username", "first_name", "last_name", "profile_image", "password", "password_confirmation", "user_holidays")