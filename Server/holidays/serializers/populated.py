from dates_proposed.serializers.populated import PopulatedDateProposedSerializer
from users_holidays.serializers.populated2 import PopulatedUserHolidaySerializerWithUser
from .common import HolidaySerializer # common review serializer will be extended

class PopulatedHolidaySerializer(HolidaySerializer):
    # created_by = UserSerializer()
    dates_proposed = PopulatedDateProposedSerializer(many=True)
    user_holidays = PopulatedUserHolidaySerializerWithUser(many=True)