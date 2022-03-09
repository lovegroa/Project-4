from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from holidays.serializers.populated import PopulatedHolidaySerializer
from users_holidays.views import UserHolidayView
from holidays.models import Holiday
from rest_framework.exceptions import NotFound
from users_holidays.serializers.common import UserHolidaySerializer
from .serializers.common import HolidaySerializer
from rest_framework.permissions import IsAuthenticated

class HolidayView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        request.data["created_by"] = request.data['userID']
        # request.data.pop('budget_currency')
        print(request.data)
        serialized_data = HolidaySerializer(data=request.data, partial=True)
        try:
            # this first part adds the holiday to the holiday database
            serialized_data.is_valid()
            serialized_data.save()

            # this second part adds the user holiday relationship to the user holiday database
            user_holiday_data = {
                'holiday_id': serialized_data.data['id'],
                'user_id': request.data['userID'],
                'is_admin': True,
                'budget':-1
            }
            serialized_data2 = UserHolidaySerializer(data=user_holiday_data, partial=True)
            serialized_data2.is_valid()
            serialized_data2.save()
            print('it saved')
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
    def get_holiday(self, pk):
        try:
            return Holiday.objects.get(pk=pk)
        except Holiday.DoesNotExist:
            raise NotFound(detail="Holiday not found")

    def get(self, request, pk):
        user_holiday = UserHolidayView.get_user_holiday(user_id = request.data['userID'], holiday_id = pk)
        if user_holiday is None: 
            return Response(
                { "detail": "User holiday now found" },
                status=status.HTTP_401_UNAUTHORIZED
            )
        holiday = self.get_holiday(pk=pk)
        serialized_holiday = PopulatedHolidaySerializer(holiday)
        return Response(serialized_holiday.data, status=status.HTTP_200_OK)

    def put(self, request):
        holiday_to_update = self.get_holiday(pk=request.data['holiday_id'])
        user_holiday = UserHolidayView.get_user_holiday(user_id = request.data['userID'], holiday_id = request.data['holiday_id'])
        if not user_holiday.is_admin: 
            return Response(
                { "detail": "User does not have permission" },
                status=status.HTTP_401_UNAUTHORIZED
            )
        print('User is valid')
        try:
            serialized_data = HolidaySerializer(holiday_to_update, data=request.data, partial=True)
            serialized_data.is_valid()
            serialized_data.save()
            return Response(serialized_data.data, status=status.HTTP_202_ACCEPTED)
        except IntegrityError as e:
            return Response({ "detail": str(e) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except AssertionError as e:
            return Response({ "detail": str(e) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)            
        except:
            return Response(
                { "detail": "Unprocessable Entity" },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

    def delete(self, _request, pk):
        holiday = self.get_holiday(pk=pk)
        holiday.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)