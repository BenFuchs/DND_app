from ..models import HumanSheets, GnomeSheets, ElfSheets, HalflingSheets

RACE_MODEL_MAP = {
    1: HumanSheets,
    2: GnomeSheets,
    3: ElfSheets,
    4: HalflingSheets,
}

def get_race_model(race: int):
    return RACE_MODEL_MAP.get(race)

def get_character_sheet_by_race(owner, race: int, sheet_id: int):
    model = get_race_model(race)
    if not model:
        return None
    return model.objects.filter(owner=owner, id=sheet_id).first()
