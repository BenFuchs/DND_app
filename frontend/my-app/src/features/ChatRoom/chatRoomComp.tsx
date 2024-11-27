import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getChatRoomsAsync } from './chatRoomSlice';
import { setSocketData } from '../ChatRoom/chatRoomSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SERVER = 'http://127.0.0.1:8000'; // Backend URL

interface ChatRoomCompProps {
  room_names: string[];
  onRoomAction: (room: string, password: string, action: 'connect' | 'create') => void;
}

const ChatRoomComp: React.FC<ChatRoomCompProps> = ({ room_names, onRoomAction }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const roomNames = useAppSelector((state) => state.chatRoom.room_names);

  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [roomJoined, setRoomJoined] = useState(false);

  // Fetch chat rooms when the component mounts
  useEffect(() => {
    dispatch(getChatRoomsAsync());
  }, [dispatch]);

  const handleCreateRoom = async () => {
    if (!roomName || !password) {
      alert('Please provide both a room name and password.');
      return;
    }
    try {
      await axios.post(`${SERVER}/createChatRoom/`, { room_name: roomName, password });
      alert('Room created successfully!');
      setRoomName('');
      setPassword('');
      dispatch(getChatRoomsAsync()); // Re-fetch rooms
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error creating room.');
    }
  };

  const handleJoinRoom = async () => {
    if (!selectedRoom || !passwordInput) {
      setJoinError('Please provide a password.');
      return;
    }
    try {
      const response = await axios.post(`${SERVER}/verifyRoomPassword/`, {
        room_name: selectedRoom,
        password: passwordInput,
      });

      if (response.data.valid) {
        alert('Successfully joined the room!');
        setRoomJoined(true);

        // Create a new WebSocket connection and dispatch to Redux
        const socketUrl = `ws://127.0.0.1:8000/ws/chat/${selectedRoom}/`;
        const socket = new WebSocket(socketUrl);

        dispatch(setSocketData({ socketUrl, socketStatus: 'connecting' }));

        socket.onopen = () => {
          dispatch(setSocketData({ socketUrl, socketStatus: 'connected' }));
        };

        socket.onclose = () => {
          dispatch(setSocketData({ socketUrl, socketStatus: 'disconnected' }));
        };

        socket.onerror = () => {
          dispatch(setSocketData({ socketUrl, socketStatus: 'disconnected' }));
        };

        // Navigate to the chat room view
        navigate(`/chat/${selectedRoom}`);
      } else {
        setJoinError('Invalid password. Please try again.');
      }
    } catch (err) {
      console.error('Error joining the room:', err);
      setJoinError('Error verifying password.');
    }
  };

  const connectToRoom = (room: string, password: string) => {
  const socketUrl = `ws://127.0.0.1:8000/ws/chat/${room}/`;

  // Function to create WebSocket connection
  const createWebSocket = () => {
    const socket = new WebSocket(socketUrl);
    
    socket.onopen = () => {
      dispatch(setSocketData({ socketUrl, socketStatus: 'connected' }));
      console.log('Connected to chat room!');
      navigate(`/chat/${room}?password=${encodeURIComponent(password)}`);
    };
    
    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
      alert('Failed to connect to the chat room.');
      dispatch(setSocketData({ socketUrl: '', socketStatus: 'disconnected' }));
      // Retry logic if needed
      setTimeout(createWebSocket, 2000); // Retry after 2 seconds
    };
    
    socket.onclose = (event) => {
      if (!event.wasClean) {
        console.log('WebSocket closed unexpectedly, retrying...');
        setTimeout(createWebSocket, 2000); // Retry after 2 seconds
      }
    };
  };

  createWebSocket(); // Initial connection attempt
};

  return (
    <div>
      {/* Create Room Section */}
      <div>
        <h2>Create Room</h2>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>

      {/* Join Room Section */}
      <div>
        <h2>Available Rooms</h2>
        {roomNames.length > 0 ? (
          roomNames.map((room, index) => (
            <button key={index} onClick={() => setSelectedRoom(room)}>
              {room || 'Unnamed Room'}
            </button>
          ))
        ) : (
          <p>No rooms available. Create one to get started!</p>
        )}

        {selectedRoom && !roomJoined && (
          <div>
            <h3>Join Room: {selectedRoom}</h3>
            <input
              type="password"
              placeholder="Enter Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            {joinError && <p style={{ color: 'red' }}>{joinError}</p>}
            <button onClick={handleJoinRoom}>Join Room</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomComp;
