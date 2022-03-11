from holidays.serializers.populated import PopulatedHolidaySerializer
from users_holidays.serializers.common import UserHolidaySerializer

class PopulatedUserHolidaySerializer(UserHolidaySerializer):
    holiday_id = PopulatedHolidaySerializer()
