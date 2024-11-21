import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getClassFeatures } from './classFeatsAPI';

const initialState = {
    classFeatures: [] as { name: string; description: string }[],
    loading: false,
};

export const getClassFeaturesAsync = createAsyncThunk(
    "traits/getClassFeatures",
    async (char_name: string) => {
      const response = await getClassFeatures(char_name)
      console.log(response.data); //debugging line
      return response.data;
    }
);

const classFeaturesSlice = createSlice({
    name:"classTraits",
    initialState,
    reducers: {},
    extraReducers:  (builder) => {
        builder
            .addCase(getClassFeaturesAsync.pending, (state)=> {
                state.loading = true;
            })
            .addCase(getClassFeaturesAsync.fulfilled, (state, action)=> {
                state.loading = false;
                state.classFeatures = action.payload;
            })
            .addCase(getClassFeaturesAsync.rejected, (state, action)=> {
                state.loading = false;

            })
    }
})

export default classFeaturesSlice.reducer;
