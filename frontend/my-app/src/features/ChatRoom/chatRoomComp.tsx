import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteChatRoomAsync, getChatRoomsAsync } from './chatRoomSlice';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CryptoJS from "crypto-js";

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
  const [deleteRoomDialogOpen, setDeleteRoomDialogOpen] = useState(false); // State for dialog visibility
  const [deleteRoomPassword, setDeleteRoomPassword] = useState(''); // State for the password input in dialog
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null); // State to track the room to delete
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
  const secretKey = process.env.REACT_APP_ROOM_ENCRYPT_KEY;
  const handleRoomLogin = () => {
    if (!selectedRoom || !inputPassword) {
      toast.error("Please select a room and enter a password.");
      return;
    }
    if (!secretKey) {
      console.error("Error: Secret key is not defined.");
      toast.error("Error: Secret key is not available.");
      return;
    }
    // Encrypt the selectedRoom before sending it to the URL
    const encryptedRoom = CryptoJS.AES.encrypt(selectedRoom, secretKey).toString(); // Use a secret key for encryption
  
    axios
      .post(`${SERVER}verifyRoomPassword/`, {
        room_name: selectedRoom,
        password: inputPassword,
      })
      .then((response) => {
        setIsLoggedIn(true);
  
        // Navigate to ChatRoomView with the encrypted room name in the URL
        navigate(`/game/${sheetID}/chat/${encryptedRoom}/`, {
          state: { roomName: selectedRoom, password: inputPassword },
        });
      })
      .catch((error) => {
        setIsLoggedIn(false);
        toast.error("Invalid password or failed to join the room.");
      });
  };

  // New delete room handler using Dialog
  const handleOpenDeleteRoomDialog = (roomName: string) => {
    setRoomToDelete(roomName);
    setDeleteRoomDialogOpen(true);
  };

  const handleDeleteRoom = async () => {
    if (!deleteRoomPassword) {
      toast.error('Password is required to delete the room.');
      return;
    }

    try {
      if (roomToDelete) {
        await dispatch(deleteChatRoomAsync({ roomName: roomToDelete, password: deleteRoomPassword }));
        toast.success(`Room '${roomToDelete}' deleted successfully.`);
        setDeleteRoomDialogOpen(false); // Close the dialog after deletion
        setDeleteRoomPassword(''); // Clear the password
        dispatch(getChatRoomsAsync()); // Refresh room list
      }
    } catch (error) {
      toast.error('Failed to delete the room. Please check the password and try again.');
    }
  };

  return (
    <div>
      <ToastContainer />
      {/* Room Creation */}
      <div>
        <h2>Create a Room</h2>
        <TextField 
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          label='Room Name'
          variant='filled'
        />
        {' '}
        <TextField 
          type='password'
          label='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant='filled'
        />
        <Button variant='contained' onClick={handleCreateRoom}>Create Room</Button>
      </div>

      {/* Available Rooms */}
      <div>
        <h2>Available Rooms</h2>
        <TextField 
          label='Search by room name'
          value={roomSearch}
          onChange={(e) => setRoomSearch(e.target.value)}
          variant='filled'
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
                <Button variant='contained' onClick={() => setSelectedRoom(room)}>{room || 'Unnamed Room'}</Button> {" "}
                <Button variant='contained' onClick={() => handleOpenDeleteRoomDialog(room)}>
                  <DeleteIcon />
                </Button>
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
          <TextField  
            type='password'
            label='Enter Password'
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            variant='filled'
          />
          <Button variant='contained' onClick={handleRoomLogin}>Join Room</Button>
        </div>
      )}

      {/* Dialog for Deleting Room */}
      <Dialog open={deleteRoomDialogOpen} onClose={() => setDeleteRoomDialogOpen(false)}>
        <DialogTitle>Delete Room</DialogTitle>
        <DialogContent>
          <TextField
            type='password'
            label='Enter Room Password'
            value={deleteRoomPassword}
            onChange={(e) => setDeleteRoomPassword(e.target.value)}
            variant='filled'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRoomDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteRoom} color="secondary">
            Delete Room
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChatRoomComp;
