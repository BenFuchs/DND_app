import { register } from "./registerAPI";
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RegisterState {
    user: string | null;
    loading: boolean;
    error: string | null;
  }
  
  const initialState: RegisterState = {
    user: null,
    loading: false,
    error: null,
  };


export const registerAsync = createAsyncThunk(
    'register/register',
    async ({ username, password }: { username: string; password: string }) => {
      const response = await register(username, password);
      return response.data; // Assuming the API returns { user, token }
    }
  );

// Create the slice with actions and reducers
const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle register async states
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action: PayloadAction<{ user: string; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

// Export the reducer to be added to the store
export default registerSlice.reducer;
