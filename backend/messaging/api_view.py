from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from .serializers import MessageSerializer, Message
from rest_framework.response import Response


class MessageViewSet(ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.order_by("-id")

    def create(self, request):
        m=Message.objects.create(**request.data)
        print(m, m.message, m.message_by, m.group_name)
        return Response({"message": "created"})


class MessageRetrievePrevious(ReadOnlyModelViewSet):
    serializer_class = MessageSerializer

    def get_queryset(self):
        queryset = Message.objects.filter(
            group_name=self.request.GET['group_name']).order_by("id")
        print(queryset)
        return MessageSerializer(queryset, many=True).data
