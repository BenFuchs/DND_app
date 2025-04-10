from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

class Order(models.Model):
    paypal_id = models.CharField(max_length=255, unique=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.paypal_id} - ${self.total_amount}"
        
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    extra_sheets = models.IntegerField(default=0)

class InventoryItem(models.Model):
    itemID = models.IntegerField()  # The ID of the item
    quantity = models.IntegerField(default=1)  # The quantity of the item
    name= models.CharField(max_length=50, default='')

    def __str__(self):
        return f"Item ID: {self.itemID}, Quantity: {self.quantity}"

class CharacterSheet(models.Model):
    class Race(models.IntegerChoices):
        HUMAN = 1, 'Human'
        GNOME = 2, 'Gnome'
        ELF = 3, 'Elf'
        HALFLING = 4, 'Halfling'
    #creation and ownership section 
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_time = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)
    inventory = models.ManyToManyField(
            InventoryItem,
            through='CharacterInventory',
            related_name='characters'
        )
    #character information
    race = models.IntegerField(choices=Race.choices, default=1) #at first all will be set to human until they reach the race selection 
    char_name = models.CharField(max_length=10, default='') # this is what we will connect 
    def __str__(self) -> str:
        return f"{self.owner} is the owner of {self.char_name}, Race: {self.get_race_display()}"
    

class CharacterInventory(models.Model):
    character = models.ForeignKey(CharacterSheet, on_delete=models.CASCADE)
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

class HumanSheets(models.Model):
    class CharClass(models.IntegerChoices):
        BARBARIAN = 1, 'Barbarian' 
        WIZARD =2, 'Wizard' 
        CLERIC = 3, 'Cleric' 
        ROUGEE = 4, 'Rogue'
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    char_name = models.CharField(max_length=10) #characters name 
    char_class = models.IntegerField(choices=CharClass.choices, default=1) #default to barbarian
    char_gold = models.IntegerField(validators=[MinValueValidator(0)], default=0) # characters gold 
    active = models.BooleanField(default=True)
    race = models.ForeignKey(CharacterSheet, on_delete=models.CASCADE, default=1)
    level = models.IntegerField(default=1)
    hitpoints = models.IntegerField(default=0)

    
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
    char_name = models.CharField(max_length=10)
    char_class = models.IntegerField(choices=CharClass.choices, default=1) #default to barbarian
    char_gold = models.IntegerField(validators=[MinValueValidator(0)], default=0) # characters gold 
    active = models.BooleanField(default=True)
    race = models.ForeignKey(CharacterSheet, on_delete=models.CASCADE, default=2)
    level = models.IntegerField(default=1)
    hitpoints = models.IntegerField(default=0)
   
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
    char_name = models.CharField(max_length=10)
    char_class = models.IntegerField(choices=CharClass.choices, default=1) #default to barbarian
    char_gold = models.IntegerField(validators=[MinValueValidator(0)], default=0) # characters gold 
    active = models.BooleanField(default=True)
    race = models.ForeignKey(CharacterSheet, on_delete=models.CASCADE, default=3)
    level = models.IntegerField(default=1)
    hitpoints = models.IntegerField(default=0)
 
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
    char_name = models.CharField(max_length=10)
    char_class = models.IntegerField(choices=CharClass.choices, default=1) #default to barbarian
    char_gold = models.IntegerField(validators=[MinValueValidator(0)], default=0) # characters gold 
    active = models.BooleanField(default=True)
    race = models.ForeignKey(CharacterSheet, on_delete=models.CASCADE, default=4)
    level = models.IntegerField(default=1)
    hitpoints = models.IntegerField(default=0)

    #stats
    stat_Strength = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Wisdom = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Dexterity = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Intelligence = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Constitution = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)
    stat_Charisma = models.IntegerField(validators=[MaxValueValidator(20), MinValueValidator(8)], default=0)

class ChatRoom(models.Model):
    room_name = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)  # Store hashed passwords in production

    def __str__(self):
        return self.room_name


class Friendship(models.Model):
    PENDING = 'PENDING'
    ACCEPTED = 'ACCEPTED'
    REJECTED = 'REJECTED'

    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
    ]

    from_user = models.ForeignKey(User, related_name='friendships_sent', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='friendships_received', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        return f"{self.from_user.username} -> {self.to_user.username} ({self.status})"