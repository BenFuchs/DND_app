import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { currencyCalc, getGold, getMods, getSheetDataToken, LevelUp, rollDice } from './gameAPI'; 

// Define the initial state
interface GameState {
  gold: any;
  loading: boolean;
  error: string;
  level: number;
  mods: []
  rolls: []
}

const initialState: GameState = {
  gold: 0,
  loading: false,
  error: '',
  level: 1,
  mods: [],
  rolls: []
};

// Create an async thunk to handle the currency calculation
export const updateGold = createAsyncThunk(
  'game/updateGold', 
  async ({ amount, action, race, id }: { amount: number, action: 'add' | 'subtract', race:number, id:number }, { rejectWithValue }) => {
    try {
      const response = await currencyCalc(amount, action,race,id);
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
    // console.log(response.data)
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

export const getSheetDataTokenAsync = createAsyncThunk(
  'game/getSDT',
  async()=> {
    const response = await getSheetDataToken();
    // console.log(response.data);
    return response.data;
  }
)

export const levelUpAsync = createAsyncThunk(
  'game/levelUp',
  async ({race, id, charClass}: {race:number; id: number, charClass: number}) => {
    const response = await LevelUp(race, id, charClass);
    console.log(response.data); //debugging line
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
      .addCase(levelUpAsync.fulfilled, (state,action)=> {
        state.loading = false;
        state.level = action.payload;
      })
      .addCase(levelUpAsync.rejected, (state, action)=> {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(levelUpAsync.pending, (state)=> {
        state.loading = true;
      })
  },
});

export default gameSlice.reducer;
