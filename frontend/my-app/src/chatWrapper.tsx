import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { getChatRoomsAsync, setSocketData } from './features/ChatRoom/chatRoomSlice';
import "react-toastify/dist/ReactToastify.css";
import ChatRoomComp from './features/ChatRoom/chatRoomComp';
import { toast } from 'react-toastify';
import LoadingIcon from './features/hashLoading/loadingIcon';

const ChatWrapper: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { room_names, loading } = useAppSelector((state) => state.chatRoom);

  useEffect(() => {
    // Fetch the list of chat rooms when the component loads
    dispatch(getChatRoomsAsync());
  }, [dispatch]);

  const handleRoomAction = (room: string, password: string, action: 'connect' | 'create') => {
    if (action === 'connect') {
      if (room && password) {
        const socketUrl = `wss://
127.0.0.1:8000/ws/chat/${room}/`;
  
        // Dispatch socket connection data to Redux (not the WebSocket instance)
        dispatch(setSocketData({ socketUrl, socketStatus: 'connecting' }));
  
        const createWebSocket = () => {
          const socket = new WebSocket(socketUrl);
          
          socket.onopen = () => {
            dispatch(setSocketData({ socketUrl, socketStatus: 'connected' }));
            console.log('Connected to chat room!');
            navigate(`/chat/${room}?password=${encodeURIComponent(password)}`);
          };
  
          socket.onerror = (err) => {
            console.error('WebSocket error:', err);
            toast.error('Failed to connect to the chat room.');
            dispatch(setSocketData({ socketUrl: '', socketStatus: 'disconnected' }));
            // Retry logic if connection fails
            setTimeout(createWebSocket, 2000); // Retry after 2 seconds
          };
  
          socket.onclose = (event) => {
            if (!event.wasClean) {
              console.log('WebSocket closed unexpectedly, retrying...');
              setTimeout(createWebSocket, 2000); // Retry after 2 seconds
            }
          };
        };
  
        createWebSocket(); // Initial WebSocket connection attempt
  
      } else {
        toast.error('Please provide both a room name and password.');
      }
    } else if (action === 'create') {
      dispatch(getChatRoomsAsync());
    }
  };
  
  

  return (
    <div>
      <h1>Chat Room</h1>
      {loading && <LoadingIcon loading={loading}/>}
      <ChatRoomComp
        room_names={room_names}
        onRoomAction={handleRoomAction}
      />
    </div>
  );
};

export default ChatWrapper;
