import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sendOrder } from './paypalAPI';

interface PaypalState {
  loading: boolean;
  error: string | null;
}

const initialState: PaypalState = {
  loading: false,
  error: null,
};

export const sendOrderAsync = createAsyncThunk(
  'paypal/sendOrder',
  async (orderData: { paypal_id: string; total_amount: string }, { rejectWithValue }) => {
    try {
      const response = await sendOrder(orderData);
      return response;
    } catch (error) {
    //   return rejectWithValue(error.response?.data || 'Failed to send order');
    }
  }
);

const paypalSlice = createSlice({
  name: 'paypal',
  initialState,
  reducers: {
    clearCart: (state) => {
      // Define cart clearing logic here if applicable
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOrderAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCart } = paypalSlice.actions;
export default paypalSlice.reducer;
