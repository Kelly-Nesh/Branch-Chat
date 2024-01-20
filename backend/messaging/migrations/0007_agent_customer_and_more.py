# Generated by Django 4.2 on 2024-01-19 20:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messaging', '0006_message_complete'),
    ]

    operations = [
        migrations.CreateModel(
            name='Agent',
            fields=[
                ('name', models.CharField(max_length=150)),
                ('employee_id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('password', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('user_id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=150)),
                ('password', models.CharField(max_length=100)),
            ],
        ),
        migrations.RenameField(
            model_name='message',
            old_name='group_name',
            new_name='conversation_id',
        ),
        migrations.RenameField(
            model_name='message',
            old_name='message_by',
            new_name='sender',
        ),
        migrations.RemoveField(
            model_name='message',
            name='agent',
        ),
        migrations.RemoveField(
            model_name='message',
            name='user_id',
        ),
    ]