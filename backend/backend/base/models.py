from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator


class CharacterSheet(models.Model):
    class Race(models.IntegerChoices):
        HUMAN = 1, 'Human'
        GNOME = 2, 'Gnome'
        ELF = 3, 'Elf'
        HALFLING = 4, 'Halfling'
    #creation and ownership section 
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    sheet_name = models.CharField(max_length=255) #at first sheet name will be empty, later we will insert character name as sheet name 
    creation_time = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    #character information
    race = models.IntegerField(choices=Race.choices, default=1) #at first all will be set to human until they reach the race selection 
    
    def __str__(self) -> str:
        return f"{self.owner} is the owner of {self.Sheet_name}, Race: {self.get_race_display()}"

class HumanSheets(models.Model):
    class CharClass(models.IntegerChoices):
        BARBARIAN = 1, 'Barbarian' 
        WIZARD =2, 'Wizard' 
        CLERIC = 3, 'Cleric' 
        ROUGEE = 4, 'Rogue'
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    char_name = models.CharField(max_length=10,unique = True) #characters name 
    char_class = models.IntegerField(choices=CharClass.choices, default=1) #default to barbarian
    char_gold = models.IntegerField(validators=[MinValueValidator(0)], default=0) # characters gold 
    active = models.BooleanField(default=True)

    
    #stats
    stat_Strength = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Wisdom = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Dexterity = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Intelligence = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Constitution = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Charisma = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)


class GnomeSheets(models.Model):
    class CharClass(models.IntegerChoices):
        BARBARIAN = 1, 'Barbarian' 
        WIZARD =2, 'Wizard' 
        CLERIC = 3, 'Cleric' 
        ROUGEE = 4, 'Rogue'
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    char_name = models.CharField(max_length=10,unique = True)
    char_class = models.IntegerField(choices=CharClass.choices, default=1) #default to barbarian
    char_gold = models.IntegerField(validators=[MinValueValidator(0)], default=0) # characters gold 
    active = models.BooleanField(default=True)

    #stats
    stat_Strength = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Wisdom = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Dexterity = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Intelligence = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Constitution = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Charisma = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)


class ElfSheets(models.Model):
    class CharClass(models.IntegerChoices):
        BARBARIAN = 1, 'Barbarian' 
        WIZARD =2, 'Wizard' 
        CLERIC = 3, 'Cleric' 
        ROUGEE = 4, 'Rogue'
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    char_name = models.CharField(max_length=10,unique = True)
    char_class = models.IntegerField(choices=CharClass.choices, default=1) #default to barbarian
    char_gold = models.IntegerField(validators=[MinValueValidator(0)], default=0) # characters gold 
    active = models.BooleanField(default=True)

    #stats
    stat_Strength = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Wisdom = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Dexterity = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Intelligence = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Constitution = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Charisma = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)


class HalflingSheets(models.Model):
    class CharClass(models.IntegerChoices):
        BARBARIAN = 1, 'Barbarian' 
        WIZARD =2, 'Wizard' 
        CLERIC = 3, 'Cleric' 
        ROUGEE = 4, 'Rogue'
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    char_name = models.CharField(max_length=10,unique = True)
    char_class = models.IntegerField(choices=CharClass.choices, default=1) #default to barbarian
    char_gold = models.IntegerField(validators=[MinValueValidator(0)], default=0) # characters gold 
    active = models.BooleanField(default=True)

    #stats
    stat_Strength = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Wisdom = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Dexterity = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Intelligence = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Constitution = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Charisma = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)


