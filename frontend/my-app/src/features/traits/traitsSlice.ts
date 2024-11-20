// In your traitsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRaceTraits, getClassFeatures } from './traitsAPI';

const initialState = {
  features: [] as { name: string; description: string }[], // Update type to store name and description
  classFeatures: [] as { name: string; description: string}[],
  loading: false,  // Add loading state
};

// Async thunk to fetch race traits
export const getRaceTraitsAsync = createAsyncThunk(
  "traits/getRaceTraits",
  async (sheetID: number) => {
    const response = await getRaceTraits(sheetID);
    return response.data; // Assuming the backend returns the full features array with name and description
  }
);

export const getClassFeaturesAsync = createAsyncThunk(
  "traits/getClassFeatures",
  async (char_name: string) => {
    const response = await getClassFeatures(char_name)
    console.log(response.data); //debugging line
    return response.data;
  }
)

// Create the slice
const traitsSlice = createSlice({
  name: "traits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRaceTraitsAsync.pending, (state) => {
        state.loading = true;  // Set loading to true when request starts
      })
      .addCase(getRaceTraitsAsync.fulfilled, (state, action) => {
        // console.log("Payload received in fulfilled:", action.payload); // Log the payload here
        state.features = action.payload; // Store the full feature objects with name and description
        state.loading = false;  // Handle error and stop loading
      })
      .addCase(getRaceTraitsAsync.rejected, (state) => {
        state.loading = false;  // Handle error and stop loading
      })
      .addCase(getClassFeaturesAsync.fulfilled, (state, action)=> {
        state.classFeatures = action.payload;
        state.loading = false;
      })

  }
});

export default traitsSlice.reducer;
