from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .serializers.common import UserHolidaySerializer
from holidays.models import Holiday

# Create your views here.
class UserHolidayView(APIView):
    def post(self, request):
        request.data["user_id"] = request.data['userID']
        print(request.data)
        try:
            holiday = Holiday.objects.get(pk=request.data['holiday_id'])
            print(holiday.created_by.id)
            request.data['is_admin'] = holiday.created_by.id == request.data["user_id"]
            serialized_data = UserHolidaySerializer(data=request.data, partial=True)
            serialized_data.is_valid()
            print(serialized_data.validated_data)
            serialized_data.save()
            return Response(serialized_data.data, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            return Response({ "detail": str(e) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except AssertionError as e:
            return Response({ "detail": str(e) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)            
        except:
            print('test')
            return Response(
                { "detail": "Unprocessable Entity" },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )