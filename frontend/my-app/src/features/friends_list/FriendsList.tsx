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
import styles from "../../StyleSheets/FriendsSideNav.module.css";

// Define the type for props
interface FriendsListProps {
  isSidenavOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ isSidenavOpen, openNav, closeNav }) => {
  const dispatch = useAppDispatch();
  const { friends, pendingRequests, searchResults, loading, error } = useAppSelector(
    (state: RootState) => state.friendsList
  );
  const [selectedTab, setSelectedTab] = useState("accepted");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getAllFriendsAsync());
    dispatch(getPendingRequestsAsync());
  }, [dispatch]);

  const handleSendFriendInvite = (userId: number) => {
    dispatch(sendFriendInviteAsync(userId));
  };

  const handleRespondToRequest = (friend_id: number, action: string) => {
    dispatch(respondToFriendRequestAsync({ friend_id, action }));
  };

  const handleRemoveFriend = (friend_id: number) => {
    console.log('Removing friendship with ID:', friend_id);  // Debugging log
    dispatch(removeFriendAsync(friend_id)).then(() => {
      dispatch(getAllFriendsAsync());
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      dispatch(searchUsersAsync(searchQuery));
      console.log(`Target user: '${searchQuery}'`);
    }
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Button to open sidenav */}

      {/* Sidenav */}
      {isSidenavOpen && (
        <div className={`${styles.sidenav} ${isSidenavOpen ? styles.open : ""}`}>
          <button className={styles.closebtn} onClick={closeNav}>
            &times;
          </button>
          {/* Tabs for different views */}
          <div className={styles.tabs}>
            <button
              className={selectedTab === "accepted" ? styles.activeTab : ""}
              onClick={() => handleTabChange("accepted")}
            >
              Accepted Friends
            </button>
            <button
              className={selectedTab === "pending" ? styles.activeTab : ""}
              onClick={() => handleTabChange("pending")}
            >
              Pending Requests
            </button>
            <button
              className={selectedTab === "search" ? styles.activeTab : ""}
              onClick={() => handleTabChange("search")}
            >
              Search
            </button>
          </div>

          {/* Show the content based on the selected tab */}
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
                      <button
                        onClick={() => handleRemoveFriend(friend.id)}
                        className={styles.removeButton}
                      >
                        Remove Friend
                      </button>
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
                      <button
                        onClick={() =>
                          handleRespondToRequest(request.id, "accept")
                        }
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleRespondToRequest(request.id, "reject")
                        }
                      >
                        Reject
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {selectedTab === "search" && (
            <div>
              <h3>Search Users</h3>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for users..."
              />
              <button onClick={handleSearch}>Search</button>

              {/* Display search results */}
              <div>
                {loading ? (
                  <div>Loading...</div>
                ) : Array.isArray(searchResults) && searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((user) => (
                      <li key={user.id}>
                        {user.username} -
                        <button
                          onClick={() => handleSendFriendInvite(user.id)}
                          className={styles.sendInviteButton}
                        >
                          Send Friend Request
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>No users found for "{searchQuery}".</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
