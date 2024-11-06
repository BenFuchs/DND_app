# Generated by Django 5.1.1 on 2024-11-06 10:09

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_elfsheets_char_class_gnomesheets_char_class_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='humansheets',
            name='stat_Charisma',
            field=models.IntegerField(default=0, validators=[django.core.validators.MaxValueValidator(20), django.core.validators.MinValueValidator(8)]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='humansheets',
            name='stat_Constitution',
            field=models.IntegerField(default=0, validators=[django.core.validators.MaxValueValidator(20), django.core.validators.MinValueValidator(8)]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='humansheets',
            name='stat_Dexterity',
            field=models.IntegerField(default=0, validators=[django.core.validators.MaxValueValidator(20), django.core.validators.MinValueValidator(8)]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='humansheets',
            name='stat_Intelligence',
            field=models.IntegerField(default=0, validators=[django.core.validators.MaxValueValidator(20), django.core.validators.MinValueValidator(8)]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='humansheets',
            name='stat_Strength',
            field=models.IntegerField(default=0, validators=[django.core.validators.MaxValueValidator(20), django.core.validators.MinValueValidator(8)]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='humansheets',
            name='stat_Wisdom',
            field=models.IntegerField(default=0, validators=[django.core.validators.MaxValueValidator(20), django.core.validators.MinValueValidator(8)]),
            preserve_default=False,
        ),
    ]
