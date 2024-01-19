from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import SimpleRouter

from messaging.api_view import MessageViewSet, MessageRetrievePrevious

router = SimpleRouter()
router.register("message", MessageViewSet)
router.register("prev/message", MessageRetrievePrevious, basename="messaging")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls))
]
