import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { currencyCalc, getGold, getMods, rollDice } from './gameAPI'; 

// Define the initial state
interface GameState {
  gold: number;
  loading: boolean;
  error: string;
  mods: []
  rolls: []
}

const initialState: GameState = {
  gold: 0,
  loading: false,
  error: '',
  mods: [],
  rolls: []
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

// get gold from db 
export const getGoldAsync = createAsyncThunk(
  'game/getGold',
  async({race, sheetID}: {race:number, sheetID:number}) => {
    const response = await getGold(race, sheetID);
    return response.data;
  }
)

export const getModsAsync = createAsyncThunk(
  'game/getMods',
  async({race, sheetID}: {race:number, sheetID:number})=> {
    const response = await getMods(race, sheetID);
    return response.data;
  }
)

export const rollDiceAsync = createAsyncThunk(
  'game/rollDice',
  async ({ diceType, amount }: { diceType: number; amount: number }) => {
    const response = await rollDice(diceType, amount);
    // console.log(response.data)
    return response.data;
  }
)

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
      })
      .addCase(getGoldAsync.fulfilled,(state, action: PayloadAction<number>) => {
        state.loading = false;
        state.gold = action.payload;
      })
      .addCase(getModsAsync.fulfilled, (state, action)=> {
        state.loading = false;
        state.mods = action.payload;
      })
      .addCase(rollDiceAsync.fulfilled, (state, action)=> {
        state.loading = false;
        state.rolls = action.payload;
      })
  },
});

export default gameSlice.reducer;
