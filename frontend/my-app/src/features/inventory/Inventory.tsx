import React, { useState, useEffect } from "react";
import Papa from "papaparse";

// Define the structure for the item
interface Item {
  name: string;
  image: string;
  description: string;
  category: string;
  rarity: string;
  classification: string;
  ac: string;
  damage: string;
  damage_type: string;
  properties: string;
  cost: string;
}

const Inventory = () => {
  const [items, setItems] = useState<Item[]>([]); // All items from CSV
  const [inventory, setInventory] = useState<Item[]>([]); // User's inventory
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query for autocomplete
  const [filteredItems, setFilteredItems] = useState<Item[]>([]); // Filtered items for search

  // Load and parse the CSV file
  useEffect(() => {
    // Replace with the actual path to your CSV file or fetch it from a server
    const csvFilePath = "misc/Mythical Ink Items.csv";
    if (csvFilePath) {
      Papa.parse(csvFilePath, {
        download: true,
        complete: (result) => {
          // Assuming your CSV headers match the keys in the Item interface
          setItems(result.data as Item[]);
        },
        header: true,
      });
    } else {
      console.log("error in file path")
    }
  }, []);

  // Handle search input change and filter items based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = items.filter(item =>
        item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [searchQuery, items]);

  // Add item to the inventory
  const addItemToInventory = (item: Item) => {
    setInventory((prev) => [...prev, item]);
  };

  // Remove item from the inventory
  const removeItemFromInventory = (item: Item) => {
    setInventory((prev) => prev.filter((invItem) => invItem.name !== item.name));
  };

  return (
    <div>
      <h1>Inventory</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for an item"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Autocomplete/Filtered Item List */}
      {searchQuery && (
        <ul>
          {filteredItems.map((item) => (
            <li key={item.name}>
              {item.name}
              <button onClick={() => addItemToInventory(item)}>Add</button>
            </li>
          ))}
        </ul>
      )}

      <h2>Your Inventory</h2>
      <ul>
        {inventory.map((item, index) => (
          <li key={index}>
            <div>
              <strong>{item.name}</strong>
              <button onClick={() => removeItemFromInventory(item)}>Remove</button>
              {/* Display more item details */}
              <div>{item.description}</div>
            </div>
          </li>
        ))}
      </ul>

      <div>
        <h3>Item Details</h3>
        {/* You can display detailed information for a selected item here */}
      </div>
    </div>
  );
};

export default Inventory;
