import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

const ChatRoomView: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);  // Reference to the chat container

  useEffect(() => {
    if (!roomName) return;
    const token = localStorage.getItem('Access');
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/?token=${token}`);
  
    setSocket(ws);
  
    ws.onopen = () => {
      console.log('Connected to the chat room');
      setError(null);  // Reset any previous connection errors
    };
  
    ws.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        const username = messageData.username;
        const messageContent = messageData.message || event.data;

        setMessages((prev) => [...prev, `${username}: ${messageContent}`]);
      } catch (error) {
        console.error('Error parsing message data', error);
        setMessages((prev) => [...prev, event.data]); // Handle non-JSON messages
      }
    };
  
    ws.onclose = (event) => {
      console.log(`WebSocket closed: ${event.code}, Reason: ${event.reason || 'No reason'}`);
      setError('Connection closed unexpectedly.');
    };
  
    ws.onerror = (ev: Event) => {
      const err = ev as ErrorEvent;
      console.error('WebSocket error:', err.message || err);
      setError('Failed to connect to the chat room. Please check the server and try again.');
    };
  
    // Cleanup the WebSocket connection when the component is unmounted
    return () => {
      ws.close(1000, 'Component unmounted');
      console.log('WebSocket closed');
    };
  }, [roomName]);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);  // Triggered whenever messages change

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && newMessage.trim() !== '') {
      const message = { message: newMessage };
      socket.send(JSON.stringify(message)); // Send JSON to backend
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2>Chat Room: {roomName}</h2>
      
      {/* Display any connection errors */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div 
        ref={chatContainerRef}  // Set the ref to the chat container
        style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}
      >
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
