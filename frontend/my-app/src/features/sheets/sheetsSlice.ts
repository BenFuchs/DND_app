import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from '../../app/store';
import { num_of_sheets, create_new_sheet, rollStats } from "./sheetsAPI";


// Define the initial state for the slice
interface SheetState {
  numSheets: number;
  username: string;
  status: 'idle' | 'loading' | 'failed';
  error?: string;  // Add error property for better error handling
  stats: []
}

const initialState: SheetState = {
  numSheets: 0,
  username: '',
  status: 'idle',
  error: undefined,  // Initialize error as undefined
  stats: []
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

// Async function to create a new sheet
export const create_new_sheetAsync = createAsyncThunk(
  'sheets/create_new_sheet',
  async (characterData: { characterName: string; charClass: number; race: number; stats: number[] }) => {
    const { characterName, charClass, race, stats} = characterData;  // Destructure the properties from characterData
    // console.log(characterData); //debug line works
    const response = await create_new_sheet(characterName, charClass, race, stats);
    return response.data;
  }
);

// Async function to roll stats for user
export const rollStatsAsync = createAsyncThunk(
  'sheets/rollStats',
  async()=> {
    const response = await rollStats();
    console.log(response.data); //debug line 
    return response.data.stats;
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
      .addCase(getNum_of_sheetsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;  // Capture error message
      })
      .addCase(create_new_sheetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(create_new_sheetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        // No need to store sheet here unless you want to track the created sheet
        // state.sheet = action.payload;  // Uncomment if you want to store created sheet data
      })
      .addCase(create_new_sheetAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;  // Capture error message
      })
      .addCase(rollStatsAsync.pending, (state)=> {
        state.status = 'loading';
      })
      .addCase(rollStatsAsync.fulfilled, (state, action)=> {
        state.status = 'idle';
        state.stats = action.payload; // Store the rolled stats in state
        // dont think any stat change is needed here for now
      })
      .addCase(rollStatsAsync.rejected, (state, action)=> {
        state.status = 'failed';
        state.error = action.error.message;  // Capture error message
      })
  },
});

// Export the async action to be used in the component
export const selectNumSheets = (state: RootState) => state.sheets.numSheets;
export const selectSheetStatus = (state: RootState) => state.sheets.status;
export const selectError = (state: RootState) => state.sheets.error;
export const selectStats = (state: RootState) => state.sheets.stats;

export default sheetSlice.reducer;
