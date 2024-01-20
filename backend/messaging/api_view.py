from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from .serializers import (MessageSerializer, Message, Agent,
                          Customer, AgentSerializer, CustomerSerializer)
from rest_framework.response import Response


class MessageViewSet(ModelViewSet):
    serializer_class = MessageSerializer
    lookup_field = 'convo_id'

    def get_queryset(self):
        queryset = Message.objects.filter(complete=False, sender__contains='user').order_by(
            "-id")
        new = []
        convo_ids = []
        for i in queryset:
            if i.conversation_id not in convo_ids:
                new.append(i)
                # print(i.hasAgent)
                convo_ids.append(i.conversation_id)

        return MessageSerializer(instance=new, many=True).data

    def create(self, request):
        msg = Message.objects.create(**request.data)
        conversation_id = msg.conversation_id
        if msg.hasAgent:
            # When an agent responds to conversation
            Message.objects.filter(
                conversation_id=conversation_id).update(hasAgent=True)
        return Response({"conversation_id": conversation_id})

    def update(self, request, *args, **kwargs):
        Message.objects.filter(
            conversation_id=kwargs['convo_id']).update(complete=True)

        return Response({"complete": True})


class MessageRetrieveHistory(ReadOnlyModelViewSet):
    serializer_class = MessageSerializer

    def get_queryset(self):
        convo_id = self.request.GET['convo_id']
        queryset = Message.objects.filter(
            conversation_id=convo_id).order_by("id")
        # print(queryset, convo_id)
        return MessageSerializer(queryset, many=True).data


class CustomerModelViewSet(ModelViewSet):
    serializer_class = CustomerSerializer

    def create(self, request):
        user_id = Customer.objects.get_or_create(**request.data)[0].user_id
        return Response({"user_id": user_id})


class AgentModelViewSet(ModelViewSet):
    serializer_class = AgentSerializer

    def create(self, request):
        emp_id = Agent.objects.get_or_create(**request.data)[0].employee_id
        return Response({"emp_id": emp_id})
