import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getChatRoomsAsync } from './chatRoomSlice';
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';

const SERVER = 'http://127.0.0.1:8000/';

interface ChatRoomCompProps {
  room_names: string[];
  onRoomAction: (room: string, password: string, action: 'connect' | 'create') => void;
}

const ChatRoomComp: React.FC<ChatRoomCompProps> = ({ room_names, onRoomAction }) => {
  const dispatch = useAppDispatch();
  const roomNames = useAppSelector((state) => state.chatRoom.room_names);
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [inputPassword, setInputPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {sheetID} = useParams();

  // Fetch available chat rooms on mount
  useEffect(() => {
    dispatch(getChatRoomsAsync());
  }, [dispatch]);

  const handleCreateRoom = async () => {
    if (!roomName || !password) {
      alert('Please provide both a room name and password.');
      return;
    }
    try {
      await axios.post(`${SERVER}createChatRoom/`, { room_name: roomName, password });
      alert('Room created successfully!');
      setRoomName('');
      setPassword('');
      dispatch(getChatRoomsAsync());
    } catch (error: any) {
      // alert(error.response?.data?.error || 'Error creating room.');
    }
  };

  const handleRoomLogin = () => {
    if (!selectedRoom || !inputPassword) {
      alert('Please select a room and enter a password.');
      return;
    }
    axios
      .post(`${SERVER}verifyRoomPassword/`, {
        room_name: selectedRoom,
        password: inputPassword,
      })
      .then((response) => {
        console.log(response.data);
        setIsLoggedIn(true);

        // Navigate to ChatRoomView with room details
        navigate(`/game/${sheetID}/chat/${selectedRoom}/`, {
          state: { roomName: selectedRoom, password: inputPassword },
        });
      })
      .catch((error) => {
        console.error(error);
        setIsLoggedIn(false);
        alert('Invalid password or failed to join the room.');
      });
  };

  return (
    <div>
      {/* Room Creation */}
      <div>
        <h2>Create a Room</h2>
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

      {/* Available Rooms */}
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
      </div>

      {/* Join Selected Room */}
      {selectedRoom && !isLoggedIn && (
        <div>
          <h3>Join Room: {selectedRoom}</h3>
          <input
            type="password"
            placeholder="Enter Password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
          />
          <button onClick={handleRoomLogin}>Join Room</button>
        </div>
      )}
    </div>
  );
};

export default ChatRoomComp;
