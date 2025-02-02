# Generated by Django 5.1.1 on 2024-11-10 11:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_elfsheets_char_gold_elfsheets_stat_charisma_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='elfsheets',
            name='active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='gnomesheets',
            name='active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='halflingsheets',
            name='active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='humansheets',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
