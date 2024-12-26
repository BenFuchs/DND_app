import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllFriends, sendFriendInvite, respondToFriendRequest, removeFriend } from './friendsListAPI';

// Types for Friend and Friendship actions
interface Friend {
  id: number;
  username: string;
}

interface FriendsState {
  friends: Friend[];
  loading: boolean;
  error: string | null;
}

const initialState: FriendsState = {
  friends: [],
  loading: false,
  error: null,
};

// Thunks for interacting with the API

// Get all friends
export const getAllFriendsAsync = createAsyncThunk<Friend[], void>(
  'friendsList/getAllFriends',
  async () => {
    try {
      const response = await getAllFriends();
      if (response && Array.isArray(response.data.friends)) {
        return response.data.friends;
      } else {
        throw new Error('Data is not an array');
      }
    } catch (error) {
      throw new Error('Failed to fetch friends: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
);

// Send friend invite
export const sendFriendInviteAsync = createAsyncThunk<void, number>(
  'friendsList/sendFriendInvite',
  async (friendId) => {
    try {
      await sendFriendInvite(friendId);
    } catch (error) {
      throw new Error('Failed to send friend invite');
    }
  }
);

// Respond to friend request (accept or decline)
export const respondToFriendRequestAsync = createAsyncThunk<void, { friendshipId: number, action: string }>(
  'friendsList/respondToFriendRequest',
  async ({ friendshipId, action }) => {
    try {
      await respondToFriendRequest(friendshipId, action);
    } catch (error) {
      throw new Error('Failed to respond to friend request');
    }
  }
);

// Remove friend
export const removeFriendAsync = createAsyncThunk<void, number>(
  'friendsList/removeFriend',
  async (friendshipId) => {
    try {
      await removeFriend(friendshipId);
    } catch (error) {
      throw new Error('Failed to remove friend');
    }
  }
);

const friendsListSlice = createSlice({
  name: 'friendsList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch friends
      .addCase(getAllFriendsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFriendsAsync.fulfilled, (state, action: PayloadAction<Friend[]>) => {
        state.loading = false;
        state.friends = action.payload;
      })
      .addCase(getAllFriendsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      })
      
      // Send friend invite
      .addCase(sendFriendInviteAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendFriendInviteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send friend invite';
      })
      
      // Respond to friend request
      .addCase(respondToFriendRequestAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(respondToFriendRequestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to respond to friend request';
      })
      
      // Remove friend
      .addCase(removeFriendAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(removeFriendAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove friend';
      });
  },
});

export default friendsListSlice.reducer;
