"""Loads csv data into database"""
from csv import DictReader
from django.core.management import BaseCommand

from messaging.models import Customer, Message


class Command(BaseCommand):
    # Display help message
    help = "Loads data from GeneralistRails_Project_MessageData.csv"
    LOAN_REPAYMENT_KEYWORDS = ['clear', 'pay',
                               'paid', 'batch', 'send', 'penalt', 'lipa']
    LOAN_APPLICATION_KEYWORDS = ['get', 'appl', 'reject', 'approve', 'give']
    ACCOUNT_KEYWORDS = ['account', 'login', 'password', 'email', 'details']

    TOPIC_KEYWORDS = {
        "loan application": LOAN_APPLICATION_KEYWORDS,
        "loan repayment": LOAN_REPAYMENT_KEYWORDS,
        "account": ACCOUNT_KEYWORDS
    }

    def getTopic(self, msg):
        """Chooses and returns topic from defined keywords"""
        topic = ''
        for key, val in self.TOPIC_KEYWORDS.items():
            for keyword in val:
                if keyword in msg:
                    topic = key
        return topic

    def createUser(self, userID):
        """Creates a user and returns user id"""
        username = f"user{userID}"
        password = f"pass{userID}"
        customer = Customer.objects.get_or_create(
            username=username, password=password)
        return customer[0].user_id

    def handle(self, *args, **kwargs):
        """Reads csv file and loads the data into the database"""
        with open("GeneralistRails_Project_MessageData.csv", 'r') as file:
            for row in DictReader(file):
                topic = self.getTopic(row['Message Body'])
                if not topic:
                    topic = "other"
                message = row['Message Body']
                timestamp = row['Timestamp (UTC)']
                sender = self.createUser(row['User ID'])
                Message.objects.create(timestamp=timestamp, topic=topic,
                                       message=message, sender=sender)
                print('-', end='')
        print("\nDone")
