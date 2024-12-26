import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { getAllFriendsAsync, sendFriendInviteAsync, respondToFriendRequestAsync, removeFriendAsync } from './friendsListSlice';

const FriendsList = () => {
  const dispatch = useAppDispatch();
  const { friends, loading, error } = useAppSelector((state: RootState) => state.friendsList);

  useEffect(() => {
    dispatch(getAllFriendsAsync());
  }, [dispatch]);

  const handleSendFriendInvite = (friendId: number) => {
    dispatch(sendFriendInviteAsync(friendId));
  };

  const handleRespondToRequest = (friendshipId: number, action: string) => {
    dispatch(respondToFriendRequestAsync({ friendshipId, action }));
  };

  const handleRemoveFriend = (friendshipId: number) => {
    dispatch(removeFriendAsync(friendshipId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!Array.isArray(friends)) {
    return <div>No friends available</div>;
  }

  return (
    <div>
      {friends.length === 0 ? (
        <div>No friends found.</div>
      ) : (
        <ul>
          {friends.map((friend) => (
            <li key={friend.id}>
              {friend.username} - 
              <button onClick={() => handleRemoveFriend(friend.id)}>Remove Friend</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
