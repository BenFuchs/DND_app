from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class CharacterSheet(models.Model):
    class Race(models.IntegerChoices):
        HUMAN = 1, 'Human'
        GNOME = 2, 'Gnome'
        ELF = 3, 'Elf'
        HALFLING = 4, 'Halfling'
    #creation and ownership section 
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    sheet_name = models.CharField(max_length=255)
    creation_time = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    #character information
    race = models.IntegerField(choices=Race.choices, default=1) #at first all will be set to human until they reach the race selection 
    
    def __str__(self) -> str:
        return f"{self.owner} is the owner of {self.Sheet_name}, Race: {self.get_race_display()}"

class HumanSheets(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    char_name = models.ForeignKey(CharacterSheet, on_delete=models.CASCADE)

class GnomeSheets(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    char_name = models.ForeignKey(CharacterSheet, on_delete=models.CASCADE)

class ElfSheets(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    char_name = models.ForeignKey(CharacterSheet, on_delete=models.CASCADE)

class HalflingSheets(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    char_name = models.ForeignKey(CharacterSheet, on_delete=models.CASCADE)

