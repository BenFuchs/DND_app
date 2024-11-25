import React, { useEffect, useRef, useState } from 'react';

interface ChatRoomProps {
  roomName: string;
}

interface ChatMessage {
  sender: string; // The name of the sender
  content: string; // The message content
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatSocketRef = useRef<WebSocket | null>(null);
  const SERVER = 'ws://127.0.0.1:8000'; // Ensure WebSocket connection points to the correct server

  // Retrieve charName from localStorage
  const charData = localStorage.getItem('SheetData');
  let charName = 'Anonymous'; // Default to Anonymous if not found
  if (charData) {
    const parsedData = JSON.parse(charData);
    charName = parsedData.data.char_name || 'Anonymous';
    console.log(charName)
  }

  useEffect(() => {
    // Initialize WebSocket connection
    const chatSocket = new WebSocket(`${SERVER}/ws/chat/${roomName}/`);
    chatSocketRef.current = chatSocket;

    // Handle incoming messages
    chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data)
      const newMessage: ChatMessage = {
        sender: data.sender, // Use the sender provided in the message payload
        content: data.message,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
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
      // Send message with sender's name
      chatSocketRef.current.send(
        JSON.stringify({
          sender: charName,
          message,
        })
      );
      messageInputRef.current!.value = ''; // Clear input after sending message
    }
  };

  return (
    <div>
      {/* Display messages */}
      <textarea
        value={messages.map((msg) => `${msg.sender}: ${msg.content}`).join('\n')}
        cols={100}
        rows={20}
        readOnly
      />
      <br />
      {/* Input field for new messages */}
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
      {/* Send button */}
      <input type="button" value="Send" onClick={handleSubmit} />
    </div>
  );
};

export default ChatRoom;
