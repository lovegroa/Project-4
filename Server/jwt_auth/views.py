from functools import partial
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from .serializers.common import UserSerializer
from datetime import datetime, timedelta
import jwt
from django.conf import settings
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from inspect import currentframe, getframeinfo


# Create your views here.

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        request.data['username'] = request.data['email'] 
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
        print(request.data)
        try:
            User.objects.get(email=request.data.get('email'))
            print('email exists', True)
            return Response ({
            'emailExists': True,
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            print('email exists', False)
            return Response ({
            'emailExists': False,
            }, status=status.HTTP_200_OK)
        except:
            raise Response(status=status.HTTP_400_BAD_REQUEST)

class GetProfile(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_profile(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound(detail="User not found")

    def get(self, request):
        print(request.data['userID'])
        profile = self.get_profile(pk=request.data['userID'])
        serialized_user = UserSerializer(profile)
        return Response(serialized_user.data, status=status.HTTP_200_OK)

    def put(self, request):

        profile = self.get_profile(pk=request.data['userID'])
        serialized_user = UserSerializer(profile, data=request.data, partial=True)
        print(
        '\033[94m',
        'it made it here',
        'line ', getframeinfo(currentframe()).lineno, 
        'within the file',
        getframeinfo(currentframe()).filename.replace('/Users/alexlovegrovee/Documents/projects/sei-project-four/Server/', ''),
        '\033[0m')
        try:
            serialized_user.is_valid()
            serialized_user.save()
            return Response(serialized_user.data, status=status.HTTP_202_ACCEPTED)
        except AssertionError as error:
            return Response({ "detail": str(error) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except:
            return Response("Unprocessable Entity", status=status.HTTP_422_UNPROCESSABLE_ENTITY)      


