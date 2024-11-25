import React, { useEffect, useState } from 'react';
import { RootState } from '../../app/store';
import { addItemToInventoryAsync, getInventoryAsync, removeItemFromInventoryAsync, searchItemsAsync } from '../inventory/inventorySlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

interface InventoryComponentProps {
  ID: number;
}

const InventoryComponent: React.FC<InventoryComponentProps> = ({ ID }) => {
  const dispatch = useAppDispatch();
  const inventory = useAppSelector((state: RootState) => state.inventory.items);
  const error = useAppSelector((state: RootState) => state.inventory.error);
  const searchResults = useAppSelector((state: RootState) => state.inventory.searchResults);
  const [item, setItem] = useState<string>(''); // The item name input
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // To control the dropdown visibility
  const [selectedItemID, setSelectedItemID] = useState<number | null>(null); // Track selected item ID

  useEffect(() => {
    dispatch(getInventoryAsync({ ID })); // Get the user's inventory
  }, [dispatch, ID]);

  useEffect(() => {
    if (item) {
      dispatch(searchItemsAsync(item)); // Trigger search when input is changed
      setShowDropdown(true);
    } else {
      setShowDropdown(false); // Hide dropdown if no input
    }
  }, [item, dispatch]);

  const handleItemSelect = (selectedItem: string, itemID: number) => {
    setItem(selectedItem); // Set the item name
    setSelectedItemID(itemID); // Set the item ID
    setShowDropdown(false); // Close the dropdown
  };

  const handleAddToInventory = () => {
    console.log('adding item to inventory')
    if (selectedItemID !== null) {
      // Dispatch action to add the selected item to the user's inventory
      dispatch(addItemToInventoryAsync({ itemID: selectedItemID, ID }));
      console.log(item) //prints the item name 
      // Re-fetch the inventory after adding the item
      dispatch(getInventoryAsync({ ID }));
      // window.location.reload()
      // Clear input and selected item ID
      setItem('');
      setSelectedItemID(null);
    }
  };

  const handleRemoveFromInventory = (itemID: number) => {
    console.log(itemID)
    dispatch(removeItemFromInventoryAsync({itemID, ID}))
    dispatch(getInventoryAsync({ ID }));
    window.location.reload()
  }

  console.log(inventory)

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Inventory</h2>
      {inventory && inventory.length > 0 ? (
        <ul>
          {inventory.map((invItem: any, index: number) => (
            <li key={index}>
              {[invItem.name]} - Quantity: {invItem.quantity} - <button onClick={() => (handleRemoveFromInventory(invItem.itemID))}>Remove</button>

            </li>
          ))}
        </ul>
      ) : (
        <p>Your inventory is empty.</p>
      )}

      <div style={{ position: 'relative' }}>
        <label>Add item to inventory: </label>
        <input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          onFocus={() => item && setShowDropdown(true)} // Show dropdown when input is focused
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay to allow click events
        />

        {showDropdown && searchResults && searchResults.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              listStyleType: 'none',
              margin: 0,
              padding: '0.5rem',
              maxHeight: '150px',
              overflowY: 'auto',
              zIndex: 1000,
            }}
          >
            {searchResults.map((result, index) => (
              <li
                key={index}
                style={{
                  padding: '0.5rem',
                  cursor: 'pointer',
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                }}
              >
                {/* Select the item when clicked */}
                <span onMouseDown={() => handleItemSelect(result.name, result.ID)}>
                  {result.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleAddToInventory} disabled={!selectedItemID}>
        Add Selected Item to Inventory
      </button>
    </div>
  );
};

export default InventoryComponent;
// The item names in the inventory get set to unknown and are connected to the search item input bar. need to find a fix for that. maybe second enpoint to read through the csv list and get just the names of items in the users inventory 