from users_holidays.serializers.populated import PopulatedUserHolidaySerializer
# from users_holidays.serializers.common import UserHolidaySerializer
from jwt_auth.serializers.common import UserSerializer # user serializer will be used to populate the owner field

class PopulatedUserSerializer(UserSerializer):
    user_holidays = PopulatedUserHolidaySerializer(many=True)
    # user_holidays = UserHolidaySerializer(many=True)