from xml.dom.pulldom import parseString
from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from users_holidays.serializers.populated import PopulatedUserHolidaySerializer
from .serializers.common import UserHolidaySerializer
from holidays.models import Holiday
from .models import UserHoliday
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated



# Create your views here.
class UserHolidayView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_user_holiday(user_id, holiday_id):
        try:
            return UserHoliday.objects.get(user_id=user_id, holiday_id=holiday_id)
        except UserHoliday.DoesNotExist:
            raise NotFound(detail="UserHoliday not found")

    def get_user_holidayWithPK(self, pk):
        try:
            return UserHoliday.objects.get(pk=pk)
        except UserHoliday.DoesNotExist:
            raise NotFound(detail="UserHoliday not found")

    def get(self, _request, pk):
        print(pk)
        user_holiday = self.get_user_holidayWithPK(pk=pk)
        serialized_user_holiday = PopulatedUserHolidaySerializer(user_holiday)
        return Response(serialized_user_holiday.data, status=status.HTTP_200_OK)

    def post(self, request):
        request.data["user_id"] = request.data['userID']
        print(request.data)
        try:
            serialized_data = UserHolidaySerializer(data=request.data, partial=True)
            serialized_data.is_valid()
            print(serialized_data)
            serialized_data.save()
            print('test2')
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
    def put(self, request, pk):

        user_holiday = self.get_user_holidayWithPK(pk=pk)
        serialized_data = UserHolidaySerializer(user_holiday, data=request.data, partial=True)
        try:
            serialized_data.is_valid()
            print(serialized_data.validated_data)

            serialized_data.save()

            return Response(PopulatedUserHolidaySerializer(user_holiday).data, status=status.HTTP_202_ACCEPTED)
        except AssertionError as error:
            return Response({ "detail": str(error) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except:
            return Response("Unprocessable Entity", status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class JoinUserHolidayView(APIView):
        permission_classes = (IsAuthenticated,)
        def get_holiday(self, join_code):
            try:
                return Holiday.objects.get(join_code=join_code)
            except UserHoliday.DoesNotExist:
                raise NotFound(detail="Holiday not found")

        def get_user_holiday(self, user_id, holiday_id):
            try:
                return UserHoliday.objects.get(user_id=user_id, holiday_id=holiday_id)
            except UserHoliday.DoesNotExist:
                raise NotFound(detail="UserHoliday not found")

        def user_holiday_exists(self, user_id, holiday_id):
            try:
                UserHoliday.objects.get(user_id=user_id, holiday_id=holiday_id)
                return True
            except:
                return False

        def post(self, request):
            holiday = self.get_holiday(join_code=request.data['join_code'])
            print(holiday.id)
            request.data["user_id"] = request.data['userID']
            request.data["holiday_id"] = holiday.id


            if self.user_holiday_exists(user_id = request.data['user_id'], holiday_id=holiday.id):
                print('user is already part of holiday')
                user_holiday = self.get_user_holiday(user_id = request.data['user_id'], holiday_id=holiday.id)
                serialized_user_holiday = UserHolidaySerializer(user_holiday)
                return Response(serialized_user_holiday.data, status=status.HTTP_200_OK)
            print('user is not part of holiday')

            try:
                print(request.data)
                serialized_data = UserHolidaySerializer(data=request.data, partial=True)
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