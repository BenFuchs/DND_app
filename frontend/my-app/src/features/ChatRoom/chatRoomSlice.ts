import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getChatRooms, WIP } from './chatRoomAPI'; // Assuming you have this API function for fetching rooms.

interface ChatRoomState {
  loading: boolean;
  room_names: string[];
  socketUrl: string | null;
  socketStatus: string | 'disconnected' | 'connecting' | 'connected';
  WIP: number;
}

const initialState: ChatRoomState = {
  loading: false,
  room_names: [],
  socketUrl: null,
  socketStatus: 'disconnected',
  WIP: 0,
};

// Async thunk for fetching chat rooms
export const getChatRoomsAsync = createAsyncThunk(
  'chatRoom/getChatRooms',
  async () => {
    const response = await getChatRooms(); // API call to get room names
    return response.data.rooms; // Adjust depending on the response format
  }
);

export const WIP_Async = createAsyncThunk(
  'chatRoom/WIP',
  async()=> {
    const response = await WIP();
    console.log(response.data.gold); // Debugging line
    return response.data;
  }
)

// Redux slice for managing chat rooms and WebSocket connection
const chatRoomSlice = createSlice({
  name: 'chatRoom',
  initialState,
  reducers: {
    setSocketData(state, action: PayloadAction<{ socketUrl: string; socketStatus: string }>) {
      state.socketUrl = action.payload.socketUrl;
      state.socketStatus = action.payload.socketStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatRoomsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChatRoomsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.room_names = action.payload;
      })
      .addCase(getChatRoomsAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(WIP_Async.fulfilled, (state, action) => {
        state.loading = false;
        state.WIP = action.payload;
      })
  }
});

export const { setSocketData } = chatRoomSlice.actions;

export default chatRoomSlice.reducer;
