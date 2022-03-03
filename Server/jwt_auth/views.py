from sys import api_version
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .serializers.common import UserSerializer
from datetime import datetime, timedelta
import jwt
from django.conf import settings

# Create your views here.

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        user_to_create = UserSerializer(data=request.data)
        try:
            user_to_create.is_valid()
            user_to_create.save()
            user_to_login = User.objects.get(email=request.data.get('email'))
            dt = datetime.now() + timedelta(days=7)
            token = jwt.encode({
                'sub':user_to_login.id,
                'exp': int(dt.strftime('%s'))
            }, settings.SECRET_KEY, 'HS256')

            return Response ({
                'token': token,
                'message': f'Registration successful'
            }, status=status.HTTP_202_ACCEPTED)        
        except:
            return Response("Failed to create user", status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class LoginView(APIView):
    def post(self, request):
        try:
            user_to_login = User.objects.get(email=request.data.get('email'))
        except User.DoesNotExist:
            return PermissionDenied(detail='User does not exist')
        if not user_to_login.check_password(request.data.get('password')):
            return PermissionDenied(detail='Unauthorised')
        dt = datetime.now() + timedelta(days=7)
        token = jwt.encode({
            'sub':user_to_login.id,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, 'HS256')

        return Response ({
            'token': token,
            'message': f'Welcome back {user_to_login.first_name}'
        }, status=status.HTTP_202_ACCEPTED)
        
class VerifyEmail(APIView):
    def post(self, request):
        print('test')
        try:
            User.objects.get(email=request.data.get('email'))
            return Response ({
            'emailExists': True,
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response ({
            'emailExists': False,
            }, status=status.HTTP_200_OK)
        except:
            raise Response(status=status.HTTP_400_BAD_REQUEST)


