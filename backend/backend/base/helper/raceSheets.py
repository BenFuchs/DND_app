from ..models import ElfSheets, GnomeSheets, HalflingSheets, HumanSheets
from .statRoller import statSelection

def createHumanSheet(user, user_Stats, user_Name, user_Class):
    stats = user_Stats
    # Race trait +1 to all stats
    stat_Strength = int(stats[0]) + 1
    stat_Wisdom = int(stats[1]) + 1
    stat_Dexterity = int(stats[2]) + 1
    stat_Intelligence = int(stats[3]) + 1
    stat_Constitution = int(stats[4]) + 1
    stat_Charisma = int(stats[5]) + 1

    HumanSheets.objects.create(
        owner=user, 
        char_name=user_Name, 
        char_class=user_Class,
        stat_Strength=stat_Strength,
        stat_Wisdom=stat_Wisdom,
        stat_Dexterity=stat_Dexterity,
        stat_Intelligence=stat_Intelligence,
        stat_Constitution=stat_Constitution,
        stat_Charisma=stat_Charisma
    )    
    return {"msg": f"Human character sheet created for {user.username} with name {user_Name} and class {HumanSheets.CharClass(user_Class).label}."}


def createGnomeSheet(user, user_Stats, user_Name, user_Class):
    # Apply race trait +2 to Intelligence for Gnome
    stats = user_Stats
    stat_Strength = int(stats[0])  # Stats passed as an array, index 0 = Strength
    stat_Wisdom = int(stats[1])    # Index 1 = Wisdom
    stat_Dexterity = int(stats[2]) # Index 2 = Dexterity
    stat_Intelligence = int(stats[3]) + 2  # Race trait for Gnome (add 2 to Intelligence)
    stat_Constitution = int(stats[4]) # Index 4 = Constitution
    stat_Charisma = int(stats[5])    # Index 5 = Charisma

    GnomeSheets.objects.create(
        owner=user, 
        char_name=user_Name, 
        char_class=user_Class,
        stat_Strength=stat_Strength,
        stat_Wisdom=stat_Wisdom,
        stat_Dexterity=stat_Dexterity,
        stat_Intelligence=stat_Intelligence,
        stat_Constitution=stat_Constitution,
        stat_Charisma=stat_Charisma
    )    
    return {"msg": f"Gnome character sheet created for {user.username} with name {user_Name} and class {GnomeSheets.CharClass(user_Class).label}."}


def createElfSheet(user, user_Stats, user_Name, user_Class):
    # Apply race trait +2 to Dexterity for Elf
    stats = user_Stats
    stat_Strength = int(stats[0])  # Index 0 = Strength
    stat_Wisdom = int(stats[1])    # Index 1 = Wisdom
    stat_Dexterity = int(stats[2]) + 2  # Race trait for Elf (add 2 to Dexterity)
    stat_Intelligence = int(stats[3])  # Index 3 = Intelligence
    stat_Constitution = int(stats[4]) # Index 4 = Constitution
    stat_Charisma = int(stats[5])    # Index 5 = Charisma

    ElfSheets.objects.create(
        owner=user, 
        char_name=user_Name, 
        char_class=user_Class,
        stat_Strength=stat_Strength,
        stat_Wisdom=stat_Wisdom,
        stat_Dexterity=stat_Dexterity,
        stat_Intelligence=stat_Intelligence,
        stat_Constitution=stat_Constitution,
        stat_Charisma=stat_Charisma
    )    
    return {"msg": f"Elf character sheet created for {user.username} with name {user_Name} and class {ElfSheets.CharClass(user_Class).label}."}


def createHalflingSheet(user, user_Stats, user_Name, user_Class):
    # Apply race trait +2 to Dexterity for Halfling
    stats = user_Stats
    stat_Strength = int(stats[0])  # Index 0 = Strength
    stat_Wisdom = int(stats[1])    # Index 1 = Wisdom
    stat_Dexterity = int(stats[2]) + 2  # Race trait for Halfling (add 2 to Dexterity)
    stat_Intelligence = int(stats[3])  # Index 3 = Intelligence
    stat_Constitution = int(stats[4]) # Index 4 = Constitution
    stat_Charisma = int(stats[5])    # Index 5 = Charisma

    HalflingSheets.objects.create(
        owner=user, 
        char_name=user_Name, 
        char_class=user_Class,
        stat_Strength=stat_Strength,
        stat_Wisdom=stat_Wisdom,
        stat_Dexterity=stat_Dexterity,
        stat_Intelligence=stat_Intelligence,
        stat_Constitution=stat_Constitution,
        stat_Charisma=stat_Charisma
    )    
    return {"msg": f"Halfling character sheet created for {user.username} with name {user_Name} and class {HalflingSheets.CharClass(user_Class).label}."}
