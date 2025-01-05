import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllFriends, sendFriendInvite, respondToFriendRequest, removeFriend, getPendingRequests, searchUsers } from './friendsListAPI';

// Types for Friend and Friendship actions
interface Friend {
  id: number;
  username: string;
}

interface PendingRequest {
  id: number;
  username: string;
}

interface FriendsState {
  friends: Friend[];
  pendingRequests: PendingRequest[];
  searchResults: Friend[];
  loading: boolean;
  error: string | null;
}

const initialState: FriendsState = {
  friends: [],
  pendingRequests: [],
  searchResults: [],
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

export const getPendingRequestsAsync = createAsyncThunk<PendingRequest[], void>(
  'friendsList/getPendingRequests',
  async () => {
    try {
      const response = await getPendingRequests();
      if (response.data && Array.isArray(response.data["pending requests"])) {
        return response.data["pending requests"];
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      throw new Error(
        'Failed to fetch pending requests: ' +
        (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }
);

export const searchUsersAsync = createAsyncThunk(
  'friendsList/searchUsers',
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await searchUsers(username);
      console.log('Search API Response:', response); // Check the response structure
      if (response.data && Array.isArray(response.data.users)) {
        return response.data.users; // Access the 'users' array and return it
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to search users');
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
        state.error = action.error.message || 'Failed to fetch friends';
      })

      // Send friend invite
      .addCase(sendFriendInviteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFriendInviteAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendFriendInviteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send friend invite';
      })

      // Respond to friend request
      .addCase(respondToFriendRequestAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToFriendRequestAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(respondToFriendRequestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to respond to friend request';
      })

      // Remove friend
      .addCase(removeFriendAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFriendAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFriendAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove friend';
      })

      // Get pending requests
      .addCase(getPendingRequestsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingRequestsAsync.fulfilled, (state, action: PayloadAction<PendingRequest[]>) => {
        state.pendingRequests = action.payload;
        state.loading = false;
      })
      .addCase(getPendingRequestsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pending requests';
      })

      // Search users
      .addCase(searchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.searchResults = []; // Clear previous results
      })
      .addCase(searchUsersAsync.fulfilled, (state, action: PayloadAction<Friend[]>) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =  'Failed to search users';
      });
  },
});

export default friendsListSlice.reducer;
