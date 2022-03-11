# from dates_voted.serializers.common import DateVotedSerializer
from dates_voted.serializers.populated import PopulatedDateVotedSerializer
from .common import DateProposedSerializer

class PopulatedDateProposedSerializer(DateProposedSerializer):
    # dates_voted = DateVotedSerializer(many=True)

    dates_voted = PopulatedDateVotedSerializer(many=True)
