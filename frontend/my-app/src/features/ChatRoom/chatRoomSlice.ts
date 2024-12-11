import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getChatRooms, deleteRoom } from './chatRoomAPI'; // Assuming you have this API function for fetching rooms.

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

export const deleteChatRoomAsync = createAsyncThunk(
  'chatRoom/deleteChatRoom',
  async ({ roomName, password }: { roomName: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await deleteRoom(roomName, password);
      return response.data; 
    } catch (error: any) {
      // console.error('Delete room error:', error.response?.data || error.message); // debugging line
      return rejectWithValue(error.response?.data || 'Error deleting room');
    }
  }
);

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
      .addCase(deleteChatRoomAsync.fulfilled, (state, action)=> {
        state.loading = false;
        state.room_names = action.payload;
      })
      .addCase(deleteChatRoomAsync.rejected, (state)=> {
        state.loading = false;
      })
      .addCase(deleteChatRoomAsync.pending, (state)=> {
        state.loading = true;
      })
  }
});

export const { setSocketData } = chatRoomSlice.actions;

export default chatRoomSlice.reducer;
