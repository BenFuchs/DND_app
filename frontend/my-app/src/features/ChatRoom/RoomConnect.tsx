import React, { useState } from 'react';

interface RoomConnectProps {
  onConnect: (roomName: string) => void;
}

const RoomConnect: React.FC<RoomConnectProps> = ({ onConnect }) => {
  const [roomName, setRoomName] = useState('');

  const handleSubmit = () => {
    if (roomName.trim()) {
      onConnect(roomName.trim());
    }
  };

  return (
    <div>
      <h2>Enter a Room Name</h2>
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room Name"
      />
      <button onClick={handleSubmit}>Join Room</button>
    </div>
  );
};

export default RoomConnect;
