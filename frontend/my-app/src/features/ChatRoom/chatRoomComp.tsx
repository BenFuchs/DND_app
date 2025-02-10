import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteChatRoomAsync, getChatRoomsAsync } from './chatRoomSlice';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const SERVER = "https://dnd-backend-f57d.onrender.com/";


interface ChatRoomCompProps {
  room_names: string[];
  onRoomAction: (room: string, password: string, action: 'connect' | 'create') => void;
}

const ChatRoomComp: React.FC<ChatRoomCompProps> = ({ room_names, onRoomAction }) => {
  const dispatch = useAppDispatch();
  const roomNames = useAppSelector((state) => state.chatRoom.room_names);
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [inputPassword, setInputPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roomSearch, setRoomSearch] = useState<string>('');
  const [filteredRooms, setFilteredRooms] = useState<string[]>([]);
  const { sheetID } = useParams();

  // Fetch available chat rooms on mount
  useEffect(() => {
    dispatch(getChatRoomsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (roomSearch) {
      setFilteredRooms(
        roomNames.filter((room) =>
          room.toLowerCase().includes(roomSearch.toLowerCase())
        )
      );
    } else {
      setFilteredRooms([]);
    }
  }, [roomSearch, roomNames]);

  const handleCreateRoom = async () => {
    if (!roomName || !password) {
      toast.error('Please provide both a room name and password.');
      return;
    }
    if (roomName.includes(' ')) {
      toast.error('Room Names may not include spaces in them');
      setRoomName('');
      setPassword('');
      return;
    }

    try {
      await axios.post(`${SERVER}createChatRoom/`, { room_name: roomName, password });
      toast.success('Room created successfully!');
      setRoomName('');
      setPassword('');
      dispatch(getChatRoomsAsync());
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error creating room.');
    }
  };

  const handleRoomLogin = () => {
    if (!selectedRoom || !inputPassword) {
      toast.error('Please select a room and enter a password.');
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
        toast.error('Invalid password or failed to join the room.');
      });
  };

  const handleDeleteRoom = async (roomName: string) => {
    const selectedRoomPassword = prompt('Please enter the room password to delete:');
    if (!selectedRoomPassword) {
      toast.error('Password is required to delete the room.');
      return;
    }

    try {
      await dispatch(deleteChatRoomAsync({ roomName, password: selectedRoomPassword }));
      toast.success(`Room '${roomName}' deleted successfully.`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete the room. Please check the password and try again.');
    }
  };

  return (
    <div>
      <ToastContainer />
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
        <input
          placeholder="Search by room name"
          value={roomSearch}
          onChange={(e) => setRoomSearch(e.target.value)}
        />
        {filteredRooms.length > 0 && (
          <ul style={{ border: '1px solid #ccc', listStyle: 'none', padding: '5px' }}>
            {filteredRooms.map((room, index) => (
              <li key={index} style={{ cursor: 'pointer', padding: '5px' }} onClick={() => {
                setSelectedRoom(room);
                setRoomSearch(''); // Clear search input after selection
              }}>
                {room}
              </li>
            ))}
          </ul>
        )}
        <hr />
        {roomNames.length > 0 ? (
          roomNames.map((room, index) => (
            <ul key={index}>
              <li>
                <button onClick={() => setSelectedRoom(room)}>{room || 'Unnamed Room'}</button> -{' '}
                <button onClick={() => handleDeleteRoom(room)}>Delete Room</button>
              </li>
            </ul>
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
