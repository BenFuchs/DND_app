import os
import pandas as pd

def inventorySearch(itemID):
    file_path = os.path.join(os.path.dirname(__file__), '../misc/NewItems.csv')
    data = pd.read_csv(file_path)
    
    # Replace NaN values with an empty string
    data = data.fillna('')

    # Search for the item by itemID
    item = data.loc[data['ID'] == itemID]

    if not item.empty:
        # Convert row to dictionary
        item_dict = item.iloc[0].to_dict()
        
        # Remove keys where value is empty ('') or NaN
        filtered_dict = {k: v for k, v in item_dict.items() if v not in ['', None]}

        return filtered_dict
    else:
        return None

# Example usage
# print(inventorySearch(55))
