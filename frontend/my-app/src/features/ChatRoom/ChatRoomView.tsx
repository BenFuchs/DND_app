import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { WIP_Async } from "./chatRoomSlice"; // Assuming WIP_Async is your action
import { useAppDispatch } from "../../app/hooks";

interface User {
  char_name: string;
  username: string;
  user_id: number;
}

const ChatRoomView: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [privateMessage, setPrivateMessage] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // User selected for private message
  const [goldAmount, setGoldAmount] = useState<string>(""); // For storing the amount of gold to send
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!roomName) return;
    const token = localStorage.getItem("SDT");

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${roomName}/?token=${token}`
    );

    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to the chat room");
      setError(null);

      // Send the character name to the server
      ws.send(JSON.stringify({ type: "connect" }));
    };

    ws.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
    
        if (messageData.type === "user_list") {
          setConnectedUsers(messageData.users);
        } else if (messageData.type === "private_message") {
          const sender = messageData.sender;
          const privateMsg = messageData.message;
          setMessages((prev) => [...prev, `Private from ${sender}: ${privateMsg}`]);

        } else if (messageData.type === "gold_transfer") {
          const { sender_char_name, recipient_char_name, amount, balance } = messageData;
          console.log(sender_char_name, recipient_char_name);  // Check values here

          const isRecipient = recipient_char_name === selectedUser?.char_name;
          const msg = !isRecipient
            ? `You sent ${amount} gold to ${recipient_char_name}. Your new balance is ${balance}.`
            : `${sender_char_name} sent you ${amount} gold. Your new balance is ${balance}.`;
    
          setMessages((prev) => [...prev, msg]);  // Show transfer status to users
        } else {
          const charName = messageData.char_name;
          const messageContent = messageData.message || event.data;
    
          setMessages((prev) => [...prev, `${charName}: ${messageContent}`]); // Use char_name
        }
      } catch (error) {
        console.error("Error parsing message data", error);
        setMessages((prev) => [...prev, event.data]);
      }
    };

    ws.onclose = (event) => {
      console.log(
        `WebSocket closed: ${event.code}, Reason: ${
          event.reason || "No reason"
        }`
      );
      setError("Connection closed unexpectedly.");
    };

    ws.onerror = (ev: Event) => {
      const err = ev as ErrorEvent;
      console.error("WebSocket error:", err.message || err);
      setError(
        "Failed to connect to the chat room. Please check the server and try again."
      );
    };

    return () => {
      ws.close(1000, "Component unmounted");
      console.log("WebSocket closed");
    };
  }, [roomName, selectedUser?.char_name]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (
      socket &&
      socket.readyState === WebSocket.OPEN &&
      newMessage.trim() !== ""
    ) {
      const message = { type: "group_message", message: newMessage };
      socket.send(JSON.stringify(message));
      setNewMessage("");
    }
  };

  const sendPrivateMessage = () => {
    if (
      socket &&
      socket.readyState === WebSocket.OPEN &&
      privateMessage.trim() !== "" &&
      selectedUser
    ) {
      const message = {
        type: "private_message",
        recipient_id: selectedUser.user_id,
        message: privateMessage,
      };
      socket.send(JSON.stringify(message));
      setMessages((prev) => [
        ...prev,
        `Private to ${selectedUser.char_name}: ${privateMessage}`,
      ]);
      setPrivateMessage("");
    }
  };

  const sendGold = () => {
    if (
      socket &&
      socket.readyState === WebSocket.OPEN &&
      selectedUser &&
      goldAmount.trim() !== "" &&
      !isNaN(Number(goldAmount)) && Number(goldAmount) > 0
    ) {
      const message = {
        type: "gold_transfer",
        recipient_id: selectedUser.user_id,
        amount: Number(goldAmount),  // Gold amount as a number
      };
      socket.send(JSON.stringify(message));
      // console.log("Socket ready:", socket?.readyState === WebSocket.OPEN);
      // console.log("Selected user:", selectedUser);
      // console.log("Gold amount:", goldAmount);
      // console.log("Message sent:", message);
      setGoldAmount("");  // Clear the input
    }
  };

  return (
    <div>
      <h2>Chat Room: {roomName}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        ref={chatContainerRef}
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
        }}
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
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage}>Send</button>
      <hr />

      <div>
        <h3>Connected Users:</h3>
        <ul>
          {connectedUsers.map((user, idx) => (
            <li key={idx}>
              {user.char_name} - {/* Change from username to char_name */}
              <button onClick={() => setSelectedUser(user)}>Send DM</button> -{" "}
              <button onClick={() => dispatch(WIP_Async())}>Send Item</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedUser && (
        <div style={{ marginTop: "10px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
          <h4>Send Private Message to {selectedUser.char_name}</h4>
          <input
            type="text"
            value={privateMessage}
            onChange={(e) => setPrivateMessage(e.target.value)}
            placeholder={`Message for ${selectedUser.char_name}`}
            style={{ width: "80%" }}
          />
          <button onClick={sendPrivateMessage}>Send</button>
        </div>
      )}

      {selectedUser && (
        <div style={{ marginTop: "10px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
          <h4>Send Gold to {selectedUser.char_name}</h4>
          <input
            type="number"
            min={0}
            value={goldAmount}
            onChange={(e) => setGoldAmount(e.target.value)}
            placeholder={`Amount to send to ${selectedUser.char_name}`}
            style={{ width: "80%" }}
          />
          <button onClick={sendGold}>Send Gold</button>
        </div>
      )}
    </div>
  );
};

export default ChatRoomView;
