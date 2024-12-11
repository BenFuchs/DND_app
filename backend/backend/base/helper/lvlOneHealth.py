from .xSidedDice import Dice

class LevelOneHealth():
    def __init__(self, charClass):
        self.charClass = charClass # initialize empty class 

    def getLevelOneHP(self):
        if self.charClass == 1:
            HP = 12
            return HP
        elif self.charClass == 2:
            HP = 6
            return HP
        elif self.charClass == 3:
            HP = 8
            return HP
        elif self.charClass == 4:
            HP = 8
            return HP        

    def getLevelXHP(self):
        if self.charClass == 1:
            hitDice = Dice(12)
            HP_ROLL = hitDice.roll()
            if HP_ROLL is None:
                raise ValueError("HP_ROLL returned None for class 1")
            print(HP_ROLL)
            return HP_ROLL
        elif self.charClass == 2:
            hitDice = Dice(6)
            HP_ROLL = hitDice.roll()
            if HP_ROLL is None:
                raise ValueError("HP_ROLL returned None for class 2")
            return HP_ROLL
        elif self.charClass == 3:
            hitDice = Dice(8)
            HP_ROLL = hitDice.roll()
            if HP_ROLL is None:
                raise ValueError("HP_ROLL returned None for class 3")
            return HP_ROLL
        elif self.charClass == 4:
            hitDice = Dice(8)
            HP_ROLL = hitDice.roll()
            if HP_ROLL is None:
                raise ValueError("HP_ROLL returned None for class 4")
            return HP_ROLL
        else:
            raise ValueError(f"Unknown class: {self.charClass}")