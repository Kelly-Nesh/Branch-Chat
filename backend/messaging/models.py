from django.db import models



class Message(models.Model):
    user_id = models.IntegerField()
    timestamp = models.CharField(max_length=100)
    topic = models.CharField(max_length=100)
    message = models.TextField()
    message_by = models.CharField(max_length=100)
    group_name = models.CharField(max_length=100)
    complete = models.BooleanField(default=False)
    agent = models.CharField(max_length=100, null=True)
