from holidays.serializers.populated import PopulatedHolidaySerializer
from holidays.serializers.common import HolidaySerializer
from users_holidays.serializers.common import UserHolidaySerializer

class PopulatedUserHolidaySerializer(UserHolidaySerializer):
    holiday_id = PopulatedHolidaySerializer()