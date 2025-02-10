import os
import pandas as pd

def inventorySearch(itemID):
    file_path = os.path.join(os.path.dirname(__file__), '../misc/NewItems.csv')
    data = pd.read_csv(file_path)
    
    # Replace NaN values with an empty string or any other default value
    data = data.fillna('')
    print(f"CSV Columns: {data.columns.tolist()}")

    # Search for the item by itemID
    item = data[data['ID'] == itemID]
    
    if not item.empty:
        return item.iloc[0].to_dict()
    else:
        return None