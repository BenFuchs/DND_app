import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import {
  getAllFriendsAsync,
  sendFriendInviteAsync,
  respondToFriendRequestAsync,
  removeFriendAsync,
  getPendingRequestsAsync,
  searchUsersAsync,
} from "./friendsListSlice";
import { Box, Drawer, Button, TextField, List, ListItemButton, ListItemText, Divider } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

interface FriendsListProps {
  isSidenavOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
  isDarkMode: boolean;
}

const FriendsList: React.FC<FriendsListProps> = ({
  isSidenavOpen,
  openNav,
  closeNav,
  isDarkMode,
}) => {
  const dispatch = useAppDispatch();
  const { friends, pendingRequests, searchResults } =
    useAppSelector((state: RootState) => state.friendsList);
  const [selectedTab, setSelectedTab] = useState("accepted");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getAllFriendsAsync());
    dispatch(getPendingRequestsAsync());
  }, [dispatch]);

  const handleSendFriendInvite = (userId: number) => {
    dispatch(sendFriendInviteAsync(userId));
    toast('Invite Sent!')
  };

  const handleRespondToRequest = (friend_id: number, action: string) => {
    dispatch(respondToFriendRequestAsync({ friend_id, action }));
    if (action === 'accept') {
    toast.success("Friend Request Accepted!")
    } else {
      toast.error("Frieend Reqest Denied!")
    }
  };

  const handleRemoveFriend = (friend_id: number) => {
    dispatch(removeFriendAsync(friend_id)).then(() => {
      dispatch(getAllFriendsAsync());
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      dispatch(searchUsersAsync(searchQuery));
    }
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItemButton onClick={() => handleTabChange("accepted")}>
          <ListItemText primary="Accepted Friends" />
        </ListItemButton>
        <ListItemButton onClick={() => handleTabChange("pending")}>
          <ListItemText primary="Pending Requests" />
        </ListItemButton>
        <ListItemButton onClick={() => handleTabChange("search")}>
          <ListItemText primary="Search" />
        </ListItemButton>
      </List>
      <Divider />

    </Box>
  );

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return toast.error("An Error has Occured");
  // }
  
  return (
    <div>
      <ToastContainer />
      <Drawer
        anchor="left"
        open={isSidenavOpen}
        onClose={closeNav}
        sx={{}}
      >
        {DrawerList}
      

      {/* Display content based on selected tab */}
      <Box sx={{ padding: 2 }}>
        {selectedTab === "accepted" && (
          <div>
            <h3>Accepted Friends</h3>
            {friends.length === 0 ? (
              <div>No friends found.</div>
            ) : (
              <ul>
                {friends.map((friend) => (
                  <li key={friend.id}>
                    {friend.username} -
                    <Button
                      variant="contained"
                      onClick={() => handleRemoveFriend(friend.id)}
                    >
                      Remove Friend
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {selectedTab === "pending" && (
          <div>
            <h3>Pending Friend Requests</h3>
            {pendingRequests.length === 0 ? (
              <div>No pending requests.</div>
            ) : (
              <ul>
                {pendingRequests.map((request) => (
                  <li key={request.id}>
                    {request.username} -
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleRespondToRequest(request.id, "accept")
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleRespondToRequest(request.id, "reject")
                      }
                    >
                      Reject
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {selectedTab === "search" && (
          <div>
            <h3>Search Users</h3>
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              label="Search for users"
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
            <div>
              {Array.isArray(searchResults) && searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((user) => (
                    <li key={user.id}>
                      {user.username} -
                      <Button
                        variant="contained"
                        onClick={() => handleSendFriendInvite(user.id)}
                      >
                        Send Friend Request
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No users found for "{searchQuery}".</div>
              )}
            </div>
          </div>
        )}
      </Box>
      </Drawer>
    </div>
  );
};

export default FriendsList;
