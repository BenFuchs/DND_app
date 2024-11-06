# Generated by Django 5.1.1 on 2024-11-06 09:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_alter_charactersheet_race_elfsheets_gnomesheets_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='elfsheets',
            name='char_class',
            field=models.IntegerField(choices=[(1, 'Barbarian'), (2, 'Wizard'), (3, 'Cleric'), (4, 'Rogue')], default=1),
        ),
        migrations.AddField(
            model_name='gnomesheets',
            name='char_class',
            field=models.IntegerField(choices=[(1, 'Barbarian'), (2, 'Wizard'), (3, 'Cleric'), (4, 'Rogue')], default=1),
        ),
        migrations.AddField(
            model_name='halflingsheets',
            name='char_class',
            field=models.IntegerField(choices=[(1, 'Barbarian'), (2, 'Wizard'), (3, 'Cleric'), (4, 'Rogue')], default=1),
        ),
        migrations.AddField(
            model_name='humansheets',
            name='char_class',
            field=models.IntegerField(choices=[(1, 'Barbarian'), (2, 'Wizard'), (3, 'Cleric'), (4, 'Rogue')], default=1),
        ),
        migrations.AlterField(
            model_name='elfsheets',
            name='char_name',
            field=models.CharField(max_length=10, unique=True),
        ),
        migrations.AlterField(
            model_name='gnomesheets',
            name='char_name',
            field=models.CharField(max_length=10, unique=True),
        ),
        migrations.AlterField(
            model_name='halflingsheets',
            name='char_name',
            field=models.CharField(max_length=10, unique=True),
        ),
        migrations.AlterField(
            model_name='humansheets',
            name='char_name',
            field=models.CharField(max_length=10, unique=True),
        ),
    ]