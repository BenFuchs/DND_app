import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login } from './loginAPI';

// Define the initial state structure for authentication
interface AuthState {
  user: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    const response = await login(username, password);
    return response.data; // Assuming the API returns { user, token }
  }
);

// Create the slice with actions and reducers
const authSlice = createSlice({
  name: 'auth',
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
      // Handle login async states
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<{ user: string; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
  },
});

// Export the actions for dispatching
export const { logout } = authSlice.actions;

// Export the reducer to be added to the store
export default authSlice.reducer;
