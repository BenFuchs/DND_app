import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

const ChatRoomView: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const { socketUrl, socketStatus } = useAppSelector((state) => state.chatRoom);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!roomName) return;

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);
    setSocket(ws);

    ws.onopen = () => {
      console.log('Connected to the chat room');
    };
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };
    ws.onclose = () => {
      console.log('Disconnected from the chat room');
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => ws.close();
  }, [roomName]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(newMessage);
      setMessages((prev) => [...prev, `You: ${newMessage}`]);
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2>Chat Room: {roomName}</h2>
      <p>Status: {socketStatus}</p>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: '80%' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoomView;
