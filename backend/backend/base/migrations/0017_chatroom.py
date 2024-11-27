# Generated by Django 5.1.1 on 2024-11-26 09:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0016_inventoryitem_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatRoom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_name', models.CharField(max_length=255, unique=True)),
                ('password', models.CharField(max_length=255)),
            ],
        ),
    ]
