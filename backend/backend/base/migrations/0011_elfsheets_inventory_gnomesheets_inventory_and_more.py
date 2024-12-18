# Generated by Django 5.1.1 on 2024-11-12 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0010_elfsheets_race_gnomesheets_race_halflingsheets_race_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='elfsheets',
            name='inventory',
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name='gnomesheets',
            name='inventory',
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name='halflingsheets',
            name='inventory',
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name='humansheets',
            name='inventory',
            field=models.JSONField(default=dict),
        ),
    ]
