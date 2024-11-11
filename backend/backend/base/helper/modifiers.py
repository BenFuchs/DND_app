from ..models import ElfSheets,GnomeSheets,HalflingSheets,HumanSheets

def modifiers(stat):
    if stat is None:
        return None  # or return a default value like 0 if you prefer
    return (stat - 10) // 2