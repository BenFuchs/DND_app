# from ..models import ElfSheets,HalflingSheets,HumanSheets,GnomeSheets
import pandas as pd
import csv 

def inventorySearch(id):
    filePath = 'misc/NewItems.csv'
    data = pd.read_csv(filePath)

    # Ensure 'ID' column is treated as integer for precise matching
    data['ID'] = data['ID'].astype(int)

    # Filter the DataFrame for the specific row ID
    row = data[data['ID'] == id]
    
    # Check if row exists and handle NaN values
    if not row.empty:
        item = row.iloc[0].fillna('').to_dict()  # Replace NaN values with an empty string
        return item
    else:
        return None


# local testing
# inventorySearch(1)