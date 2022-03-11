from jwt_auth.serializers.common import UserSerializer
from users_holidays.serializers.common import UserHolidaySerializer

class PopulatedUserHolidaySerializerWithUser(UserHolidaySerializer):
    user_id = UserSerializer()