from django.db import models
from shortuuid import uuid


class Message(models.Model):
    conversation_id = models.CharField(max_length=100)
    timestamp = models.CharField(max_length=100)
    topic = models.CharField(max_length=100)
    message = models.TextField()
    sender = models.CharField(max_length=100)
    hasAgent = models.BooleanField(default=False)
    complete = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.conversation_id:
            self.conversation_id = uuid(name=self.timestamp)[:8]
        super().save(*args, **kwargs)


class Customer(models.Model):
    user_id = models.CharField(max_length=100, primary_key=True)
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        if not self.user_id:
            self.user_id = 'user_{}'.format(uuid(name=self.username)[:8])
        super().save(*args, **kwargs)


class Agent(models.Model):
    employee_id = models.CharField(max_length=100, primary_key=True)
    password = models.CharField(max_length=100, null=False)
