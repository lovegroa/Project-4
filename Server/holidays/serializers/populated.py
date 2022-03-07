from .common import HolidaySerializer # common review serializer will be extended
from jwt_auth.serializers.common import UserSerializer # user serializer will be used to populate the owner field

class PopulatedHolidaySerializer(HolidaySerializer):
    created_by = UserSerializer()