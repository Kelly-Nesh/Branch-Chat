from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import Message, Customer, Agent


class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"


class CustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class AgentSerializer(ModelSerializer):
    class Meta:
        model = Agent
        fields = "__all__"
