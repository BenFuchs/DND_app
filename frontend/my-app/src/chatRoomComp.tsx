import React, { useEffect, useRef, useState } from 'react';

interface ChatRoomProps {
  roomName: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomName }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatSocketRef = useRef<WebSocket | null>(null);
  const SERVER = 'ws://127.0.0.1:8000';  // Ensure WebSocket connection points to the correct server

  useEffect(() => {
    // Initialize WebSocket connection
    const chatSocket = new WebSocket(`${SERVER}/ws/chat/${roomName}/`);
    chatSocketRef.current = chatSocket;

    // Handle incoming messages
    chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    // Handle WebSocket closure
    chatSocket.onclose = () => {
      console.error('Chat socket closed unexpectedly');
    };

    return () => {
      // Cleanup WebSocket connection when the component unmounts
      if (chatSocketRef.current) {
        chatSocketRef.current.close();
      }
    };
  }, [roomName]);

  const handleSubmit = () => {
    const message = messageInputRef.current?.value || '';
    if (message.trim() && chatSocketRef.current) {
      chatSocketRef.current.send(JSON.stringify({ message }));
      messageInputRef.current!.value = ''; // Clear input after sending message
    }
  };

  return (
    <div>
      <textarea
        value={messages.join('\n')}
        cols={100}
        rows={20}
        readOnly
      />
      <br />
      <input
        ref={messageInputRef}
        type="text"
        size={100}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
      />
      <br />
      <input
        type="button"
        value="Send"
        onClick={handleSubmit}
      />
    </div>
  );
};

export default ChatRoom;
