import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from '../../../app/store';
import { createNewSheet, num_of_sheets } from "./sheetsAPI";

// Define the initial state for the slice
interface SheetState {
  numSheets: number;
  username: string;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: SheetState = {
  numSheets: 0,
  username: '',
  status: 'idle',
};

// Async function to fetch the number of sheets
export const getNum_of_sheetsAsync = createAsyncThunk(
  'sheets/num_of_sheets',
  async () => {
    const response = await num_of_sheets();
    return response.data; 
    // Assuming response.data is the number of sheets
  }
);

// function to create new sheet 
export const createNewSheet_Aysnc = createAsyncThunk(
  'sheets/createNewSheet',
  async () => {
    return (await createNewSheet()).data;
  }
)

// Create the slice
export const sheetSlice = createSlice({
  name: 'sheets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNum_of_sheetsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getNum_of_sheetsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.numSheets = action.payload; // Set the number of sheets
      })
      .addCase(getNum_of_sheetsAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

// Export the async action to be used in the component
export const selectNumSheets = (state: RootState) => state.sheets.numSheets;
export const selectSheetStatus = (state: RootState) => state.sheets.status;

export default sheetSlice.reducer;
