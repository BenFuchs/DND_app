from ..models import ElfSheets, GnomeSheets, HalflingSheets, HumanSheets
from .statRoller import statSelection

def createHumanSheet(user):
    char_name = input("Please enter your Human character's name: ")

    # Select class
    while True:
        try:
            print("Please select a class for Human:")
            for choice in HumanSheets.CharClass.choices:
                print(f"{choice[0]}: {choice[1]}")
            
            char_class = input("Enter the class number: ")
            char_class = int(char_class)
            if char_class not in [choice[0] for choice in HumanSheets.CharClass.choices]:
                print("Invalid class selection. Please try again.")
            else:
                break
        except ValueError:
            print("Invalid input. Please enter a number corresponding to a class.")
    
    stats = statSelection()
    #race trait +1 to all stats
    stat_Strength = int(stats.get("Strength")) + 1
    stat_Wisdom = int(stats.get("Wisdom")) + 1
    stat_Dexterity = int(stats.get("Dexterity")) + 1
    stat_Intelligence = int(stats.get("Intelligence")) + 1
    stat_Constitution = int(stats.get("Constitution")) + 1
    stat_Charisma = int(stats.get("Charisma")) + 1

    HumanSheets.objects.create(
        owner=user, 
        char_name=char_name, 
        char_class=char_class,
        stat_Strength=stat_Strength,
        stat_Wisdom=stat_Wisdom,
        stat_Dexterity=stat_Dexterity,
        stat_Intelligence=stat_Intelligence,
        stat_Constitution=stat_Constitution,
        stat_Charisma=stat_Charisma
    )    
    return {"msg": f"Human character sheet created for {user.username} with name {char_name} and class {HumanSheets.CharClass(char_class).label}."}


def createGnomeSheet(user):
    char_name = input("Please enter your Gnome character's name: ")

    # Select class
    while True:
        try:
            print("Please select a class for Gnome:")
            for choice in GnomeSheets.CharClass.choices:
                print(f"{choice[0]}: {choice[1]}")
            
            char_class = input("Enter the class number: ")
            char_class = int(char_class)
            if char_class not in [choice[0] for choice in GnomeSheets.CharClass.choices]:
                print("Invalid class selection. Please try again.")
            else:
                break
        except ValueError:
            print("Invalid input. Please enter a number corresponding to a class.")

    # Get stats from statSelection
    stats = statSelection()
    stat_Strength = int(stats.get("Strength")) 
    stat_Wisdom = int(stats.get("Wisdom")) 
    stat_Dexterity = int(stats.get("Dexterity")) 
    stat_Intelligence = int(stats.get("Intelligence")) + 2 #race trait
    stat_Constitution = int(stats.get("Constitution")) 
    stat_Charisma = int(stats.get("Charisma")) 

    GnomeSheets.objects.create(
        owner=user, 
        char_name=char_name, 
        char_class=char_class,
        stat_Strength=stat_Strength,
        stat_Wisdom=stat_Wisdom,
        stat_Dexterity=stat_Dexterity,
        stat_Intelligence=stat_Intelligence,
        stat_Constitution=stat_Constitution,
        stat_Charisma=stat_Charisma
    )    
    return {"msg": f"Gnome character sheet created for {user.username} with name {char_name} and class {GnomeSheets.CharClass(char_class).label}."}


def createElfSheet(user):
    char_name = input("Please enter your Elf character's name: ")

    # Select class
    while True:
        try:
            print("Please select a class for Elf:")
            for choice in ElfSheets.CharClass.choices:
                print(f"{choice[0]}: {choice[1]}")
            
            char_class = input("Enter the class number: ")
            char_class = int(char_class)
            if char_class not in [choice[0] for choice in ElfSheets.CharClass.choices]:
                print("Invalid class selection. Please try again.")
            else:
                break
        except ValueError:
            print("Invalid input. Please enter a number corresponding to a class.")

    # Get stats from statSelection
    stats = statSelection()
    stat_Strength = int(stats.get("Strength")) 
    stat_Wisdom = int(stats.get("Wisdom")) 
    stat_Dexterity = int(stats.get("Dexterity")) + 2 #race trait
    stat_Intelligence = int(stats.get("Intelligence")) 
    stat_Constitution = int(stats.get("Constitution")) 
    stat_Charisma = int(stats.get("Charisma")) 

    ElfSheets.objects.create(
        owner=user, 
        char_name=char_name, 
        char_class=char_class,
        stat_Strength=stat_Strength,
        stat_Wisdom=stat_Wisdom,
        stat_Dexterity=stat_Dexterity,
        stat_Intelligence=stat_Intelligence,
        stat_Constitution=stat_Constitution,
        stat_Charisma=stat_Charisma
    )    
    return {"msg": f"Elf character sheet created for {user.username} with name {char_name} and class {ElfSheets.CharClass(char_class).label}."}


def createHalflingSheet(user):
    char_name = input("Please enter your Halfling character's name: ")

    # Select class
    while True:
        try:
            print("Please select a class for Halfling:")
            for choice in HalflingSheets.CharClass.choices:
                print(f"{choice[0]}: {choice[1]}")
            
            char_class = input("Enter the class number: ")
            char_class = int(char_class)
            if char_class not in [choice[0] for choice in HalflingSheets.CharClass.choices]:
                print("Invalid class selection. Please try again.")
            else:
                break
        except ValueError:
            print("Invalid input. Please enter a number corresponding to a class.")

    # Get stats from statSelection
    stats = statSelection()
    stat_Strength = int(stats.get("Strength")) 
    stat_Wisdom = int(stats.get("Wisdom")) 
    stat_Dexterity = int(stats.get("Dexterity")) + 2 #race trait
    stat_Intelligence = int(stats.get("Intelligence")) 
    stat_Constitution = int(stats.get("Constitution")) 
    stat_Charisma = int(stats.get("Charisma")) 

    HalflingSheets.objects.create(
        owner=user, 
        char_name=char_name, 
        char_class=char_class,
        stat_Strength=stat_Strength,
        stat_Wisdom=stat_Wisdom,
        stat_Dexterity=stat_Dexterity,
        stat_Intelligence=stat_Intelligence,
        stat_Constitution=stat_Constitution,
        stat_Charisma=stat_Charisma
    )    
    return {"msg": f"Halfling character sheet created for {user.username} with name {char_name} and class {HalflingSheets.CharClass(char_class).label}."}