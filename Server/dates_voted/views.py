from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .serializers.common import DateVotedSerializer

# Create your views here.
class DateVotedView(APIView):
    def post(self, request):
        try:
            serialized_data = DateVotedSerializer(data=request.data)
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