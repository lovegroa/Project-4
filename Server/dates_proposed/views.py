from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from users_holidays.views import UserHolidayView
from .serializers.common import DateProposedSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly


# Create your views here.
class DateProposedView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def post(self, request):
        user_holiday = UserHolidayView.get_user_holiday(user_id = request.data['userID'], holiday_id = request.data['holiday_id'])
        if not user_holiday.is_admin: 
            return Response(
                { "detail": "User does not have permission" },
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            serialized_data = DateProposedSerializer(data=request.data)
            serialized_data.is_valid()
            serialized_data.save()
            return Response(serialized_data.data, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            return Response({ "detail": str(e) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except AssertionError as e:
            return Response({ "detail": str(e) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)            
        except:
            return Response(
                { "detail": "Unprocessable Entity" },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )