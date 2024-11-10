import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { currencyCalc } from './gameAPI'; 

// Define the initial state
interface GameState {
  gold: number;
  loading: boolean;
  error: string;
}

const initialState: GameState = {
  gold: 0,
  loading: false,
  error: '',
};

// Create an async thunk to handle the currency calculation
export const updateGold = createAsyncThunk(
  'game/updateGold', 
  async ({ amount, action, race }: { amount: number, action: 'add' | 'subtract', race:number }, { rejectWithValue }) => {
    try {
      const response = await currencyCalc(amount, action,race);
      return response.data.new_gold; // Assuming backend sends the new gold value
    } catch (error) {
    //   return rejectWithValue(error.response?.data?.msg || 'An error occurred');
    }
  }
);

// Create the slice
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Additional reducers can be added here if needed for manual updates
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateGold.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(updateGold.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.gold = action.payload;  // Update the gold with the new value
      })
      .addCase(updateGold.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;  // Handle error messages
      });
  },
});

export default gameSlice.reducer;
