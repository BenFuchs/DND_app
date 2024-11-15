import random

class Dice:
    def __init__(self, sides=6):
        self.sides = int(sides)
        self.roll_count = None  # Initialize roll_count to None

    def roll(self):
        self.roll_count = random.randint(1, self.sides)
        return self.roll_count  # Return the roll result

    def getResult(self):
        if self.roll_count is None:
            raise ValueError("Dice hasn't been rolled yet.")
        return self.roll_count




# # #example
# dice = Dice(12)
# result = dice.roll()  # Rolls the dice and returns the result
# print("Roll result:", result)
# # print("Get result:", dice.getResult())  # Should return the same result
