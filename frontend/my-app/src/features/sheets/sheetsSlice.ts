import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from '../../app/store';
import { num_of_sheets, create_new_sheet, rollStats, sheet_delete, getSheetData } from "./sheetsAPI";
import { SheetData } from "./SheetsComp";

// Define the initial state for the slice
interface SheetState {
  numSheets: SheetData | null;  // Modify this to accept a structured object or null
  username: string;
  status: 'idle' | 'failed';
  error?: string;
  stats: number[];
  Id: number;
  data: {}
  loading: boolean;
}

const initialState: SheetState = {
  numSheets: null,  // Default to null
  username: '',
  status: 'idle',
  error: undefined,
  stats: [],
  Id: 0,
  data: {},
  loading: true,
};

// Async function to fetch the number of sheets
export const getNum_of_sheetsAsync = createAsyncThunk(
  'sheets/num_of_sheets',
  async () => {
    const response = await num_of_sheets();
    // console.log("API Response:", response.data); // Debugging line
    return response.data; // Ensure the data structure matches SheetData
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
    // console.log(response.data); //debug line 
    return response.data.stats;
  }
)

export const deleteSheetAsync = createAsyncThunk(
  'sheets/sheet_delete',
  async (Id: number) => {
      const response = await sheet_delete(Id);
      return response.data;
  // Return response data if any message needs to be displayed
  }
);

export const getSheetDataAsync = createAsyncThunk(
  'sheets/getSheetData',
  async(sheetID:number)=> {
    const response = await getSheetData(sheetID);
    // console.log(response.data); // debugging line
    return response.data;
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
        state.loading = true;
      })
      .addCase(getNum_of_sheetsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loading = false;
        state.numSheets = action.payload; // Set the number of sheets
      })
      .addCase(getNum_of_sheetsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;  // Capture error message
      })
      .addCase(create_new_sheetAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(create_new_sheetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loading = false;
        // No need to store sheet here unless you want to track the created sheet
        // state.sheet = action.payload;  // Uncomment if you want to store created sheet data
      })
      .addCase(create_new_sheetAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;  // Capture error message
      })
      .addCase(rollStatsAsync.pending, (state)=> {
        state.loading = true;
      })
      .addCase(rollStatsAsync.fulfilled, (state, action)=> {
        state.status = 'idle';
        state.loading = false;
        state.stats = action.payload; // Store the rolled stats in state
        // dont think any stat change is needed here for now
      })
      .addCase(rollStatsAsync.rejected, (state, action)=> {
        state.status = 'failed';
        state.error = action.error.message;  // Capture error message
      })
      .addCase(deleteSheetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loading = false;
        if (state.numSheets) {
          state.numSheets.sheets = state.numSheets.sheets.filter(
            (sheet) => sheet.sheetID !== action.payload.sheetID
          );
        }
      })
      .addCase(deleteSheetAsync.pending, (state)=> {
        state.loading = true;
      })
      .addCase(deleteSheetAsync.rejected, (state, action)=> {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getSheetDataAsync.fulfilled, (state, action)=> {
        state.status = 'idle';
        state.loading = false;
        state.data = action.payload;
      })
  },
});

// Export the async action to be used in the component
export const selectNumSheets = (state: RootState) => state.sheets.numSheets;
export const selectSheetStatus = (state: RootState) => state.sheets.status;
export const selectError = (state: RootState) => state.sheets.error;
export const selectStats = (state: RootState) => state.sheets.stats;
export const selectDelete = (state:RootState) => state.sheets.Id;
export const selectLoading = (state:RootState) => state.sheets.loading;

export default sheetSlice.reducer;
