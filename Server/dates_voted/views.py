from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from dates_voted.models import DateVoted
from .serializers.common import DateVotedSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound



# Create your views here.
class DateVotedView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_date_voted_with_pk(self, pk):
        try:
            return DateVoted.objects.get(pk=pk)
        except DateVoted.DoesNotExist:
            raise NotFound(detail="DateVoted not found")

    def post(self, request):
        request.data["user_id"] = request.data['userID']
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
    
    def put(self, request):
        request.data["user_id"] = request.data['userID']

        date_voted = self.get_date_voted_with_pk(pk=request.data['date_voted_id'])
        serialized_data = DateVotedSerializer(date_voted, data=request.data, partial=True)
        try:
            serialized_data.is_valid()
            print(serialized_data.validated_data)

            serialized_data.save()

            return Response(serialized_data.data, status=status.HTTP_202_ACCEPTED)
        except AssertionError as error:
            return Response({ "detail": str(error) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except:
            return Response("Unprocessable Entity", status=status.HTTP_422_UNPROCESSABLE_ENTITY)