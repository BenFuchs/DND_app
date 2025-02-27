// src/store/inventorySlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInventory, searchItems, addItemToInventory, removeItemFromInventory, getItemData } from '../inventory/inventoryAPI';

// Define an initial state for the inventory
export interface Item {
    ID: number;
    name: string;
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

interface InventoryState {
  items: Item[]; // Array to hold items
  searchResults: Item[]; // Array for search results
  isLoading: boolean; // To track loading state
  error: string | null; // To track errors
  data : Item;
}

const initialState: InventoryState = {
  items: [],
  searchResults: [],
  isLoading: false,
  error: null,
  data: {
    ID: 0,
    name: '',
    description: '',
    category: '',
    rarity: '',
    classification: '',
    ac: '',
    damage: '',
    damage_type: '',
    properties: '',
    cost: '',
  },
};

// Async thunk for getting inventory
export const getInventoryAsync = createAsyncThunk(
  'inventory/getInventory',
  async ({ ID }: { ID: number }, { rejectWithValue }) => {
    try {
      const response = await getInventory(ID);
      // console.log(response.data) 
      return response.data.inventory; // Assuming the response has an 'inventory' field
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to get inventory');
    }
  }
);

// Async thunk for searching items
export const searchItemsAsync = createAsyncThunk(
  'inventory/searchForItems',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await searchItems(query);
      // console.log(response.data.items)
      return response.data.items; // Assuming the response has an 'items' field
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to search items');
    }
  }
);

// Async thunk for retreiving item data for display
export const getItemDataAsync = createAsyncThunk(
  'inventory/getItemData',
  async({itemID} : {itemID: number}) => {
    try {
      const response = await getItemData(itemID)
      // console.log(response.data) //debugging 
      return response.data
    } catch (error) {
      return error
    }
  }
);

// Async thunk for adding item to inventory
export const addItemToInventoryAsync = createAsyncThunk(
  'inventory/addItem',
  async ({ itemID, ID }: { itemID: number; ID: number }, { rejectWithValue }) => {
    try {
      const response = await addItemToInventory(itemID, ID);
      // console.log(response.data.inventory);
      return response.data.inventory; // Assuming the response contains the updated inventory
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to add item to inventory');
    }
  }
);

export const removeItemFromInventoryAsync = createAsyncThunk(
  'inventory/removeItem',
  async ({itemID, ID}: {itemID: number, ID: number}, {rejectWithValue}) => {
    try {
      const response = await removeItemFromInventory(itemID, ID);
      return response.data.inventory
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to add item to inventory');
    }
  }
)

// Create the slice
const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearInventory: (state) => {
      state.items = [];
      state.searchResults = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchInventory
    builder
    .addCase(getInventoryAsync.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getInventoryAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
      state.error = null;
    })
    .addCase(getInventoryAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    })

    // Handle searchForItems
    .addCase(searchItemsAsync.pending, (state) => {
      state.isLoading = false;
    })
    .addCase(searchItemsAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.searchResults = action.payload;
      state.error = null;
    })
    .addCase(searchItemsAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    })

    // Handle addItem
    .addCase(addItemToInventoryAsync.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(addItemToInventoryAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload; // Updated inventory
      state.error = null;
    })
    .addCase(addItemToInventoryAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    })
    .addCase(removeItemFromInventoryAsync.fulfilled, (state, action)=> {
      state.isLoading = false;
      state.items = action.payload
      state.error = null
    })
    .addCase(removeItemFromInventoryAsync.rejected, (state, action)=> {
      state.isLoading = false;
      state.error = action.payload as string;
    })
    .addCase(removeItemFromInventoryAsync.pending, (state)=> {
      state.isLoading = true;
    })
    .addCase(getItemDataAsync.fulfilled, (state,action)=> {
      state.isLoading = false;
      state.data = action.payload;
    })
    .addCase(getItemDataAsync.rejected, (state, action)=> {
      state.isLoading = false;
      state.error = action.payload as string;
    })
  },
});

export const { clearInventory } = inventorySlice.actions;
export default inventorySlice.reducer;
