from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .serializers.common import HolidaySerializer
from .models import Holiday # import Festival model


# Create your views here.
class HolidayView(APIView):
    def post(self, request):
        request.data["created_by"] = request.data['userID']
        serialized_data = HolidaySerializer(data=request.data, partial=True)
        print(request.data)
        try:
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
