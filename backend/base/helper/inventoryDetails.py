from .inventoryParse import inventorySearch

def get_inventory_details(inventory):
    item_details = []
    
    for item_id, quantity in inventory.items():
        # Call the CSV parser to get item information based on the ID
        item_info = inventorySearch(int(item_id))
        
        if item_info is not None:  # Ensure we only add valid item info
            item_info["quantity"] = quantity  # Add quantity to item info
            item_details.append(item_info)
        else:
            print(f"Item with ID {item_id} not found.")
    
    return item_details