from jwt_auth.serializers.common import UserSerializer
from dates_voted.serializers.common import DateVotedSerializer

class PopulatedDateVotedSerializer(DateVotedSerializer):
    user_id = UserSerializer()