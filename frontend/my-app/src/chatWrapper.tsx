import React, { useState } from 'react';
import RoomConnect from '../src/features/ChatRoom/RoomConnect'; // Room name input component
import ChatRoom from '../src/features/ChatRoom/chatRoomComp'; // Actual chat component

const ChatWrapper: React.FC = () => {
  const [roomName, setRoomName] = useState<string | null>(null);

  const handleRoomConnect = (room: string) => {
    setRoomName(room);
  };

  return (
    <div>
      {roomName ? (
        <ChatRoom roomName={roomName} />
      ) : (
        <RoomConnect onConnect={handleRoomConnect} />
      )}
    </div>
  );
};

export default ChatWrapper;
