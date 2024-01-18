from rest_framework.viewsets import ModelViewSet
from .serializers import MessageSerializer, Message
from rest_framework.response import Response


class MessageViewSet(ModelViewSet):
    serializer_class = MessageSerializer
    fields = "__all__"
    queryset = Message.objects.all()

    def create(self, request):
        Message.objects.create(**request.data)
        return Response({"message": "created"})