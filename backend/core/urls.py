from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import SimpleRouter

from messaging.api_view import (MessageViewSet, MessageRetrieveHistory, CustomerModelViewSet,
                                AgentModelViewSet, ResumeViewSet)

router = SimpleRouter()
router.register("message", MessageViewSet, basename="messaging")
router.register("chat/history", MessageRetrieveHistory,
                basename="messaging")
router.register("customer", CustomerModelViewSet, basename='messaging')
router.register("agent", AgentModelViewSet, basename='messaging')
router.register("resume", ResumeViewSet, basename='messaging')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls))
]
