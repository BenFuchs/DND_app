from .xSidedDice import Dice

dice = Dice()

def StatRoll():
    def roll_multiple_dice(num_dice, sides=6):
        dice_rolls = []
        for _ in range(num_dice):
            dice = Dice(sides)
            roll = dice.roll()
            dice_rolls.append(roll)
            # print(f"Rolled a {sides}-sided die: {roll}")
        
        lowest_roll = min(dice_rolls)
        return dice_rolls, lowest_roll
    
    num_dice = 4
    rolls, lowest_roll = roll_multiple_dice(num_dice)

    rollsSum = sum(rolls)
    statRoll = rollsSum - lowest_roll
    print(statRoll)
    return statRoll

def allStatsRoll():
    stat_numbers = []
    while len(stat_numbers) <6:
        newStat = StatRoll()
        stat_numbers.append(newStat)
    # print(stat_numbers)
    return stat_numbers

def statSelection():
    userStats = allStatsRoll()  # Get all the stat rolls from allStatsRoll()

    # The order of stat names
    stat_names = ["Strength", "Wisdom", "Dexterity", "Intelligence", "Constitution", "Charisma"]
    assigned_stats = {}  # This will store the selected stats for the user

    # Loop through each stat and ask the user to select it
    for stat_name in stat_names:
        while len(userStats) > 0:
            print(f"Please select your {stat_name} stat:")
            print(userStats)  # Display available stats
            selection = input("Enter the stat roll number you want to assign to " + stat_name + ": ")

            # Ensure the selection is a valid index from the userStats list
            try:
                selection = int(selection)  # Convert input to integer
                if selection in userStats:
                    assigned_stats[stat_name] = selection
                    userStats.remove(selection)  # Remove the selected stat
                    break  # Exit the loop once a valid selection is made
                else:
                    print("Invalid selection. Please select a valid stat from the list.")
            except ValueError:
                print("Invalid input. Please enter a valid number corresponding to the stat roll.")
    
    print(f"Assigned Stats: {assigned_stats}")
    return assigned_stats

# Testing the statSelection function
# statSelection()

#testing local
# StatRoll()
# allStatsRoll()