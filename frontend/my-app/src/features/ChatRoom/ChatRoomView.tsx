import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import LoadingIcon from "../hashLoading/loadingIcon";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";

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
  const [loggedCharName, setloggedCharName] = useState<string>("");
  const [decryptedRoomName, setDecryptedRoomName] = useState<string>(""); // State for decrypted room name
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const SERVER = "dnd-backend-f57d.onrender.com";

  // get the logged username for the connected list later
  useEffect(() => {
    const SheetData = localStorage.getItem("SheetData");
    if (SheetData) {
      const parsedData = JSON.parse(SheetData);
      setloggedCharName(parsedData.data.char_name);
    }
  }, [loggedCharName]);

  const decryptRoomName = (encryptedRoom: string) => {
    const secretKey = process.env.REACT_APP_ROOM_ENCRYPT_KEY;
  
    if (!secretKey) {
      throw new Error("Secret key is not defined in the environment variables.");
    }
  
    const bytes = CryptoJS.AES.decrypt(encryptedRoom, secretKey);
    const decryptedRoom = bytes.toString(CryptoJS.enc.Utf8);
    // console.log(decryptedRoom) //debuggging 
    return decryptedRoom;
  };

  useEffect(() => {
    if (!roomName) return;

    const decrypt = decryptRoomName(roomName);
    setDecryptedRoomName(decrypt);

    const token = localStorage.getItem("SDT");

    const ws = new WebSocket(
      `wss://${SERVER}/ws/chat/${decryptedRoomName}/?token=${token}`
    );

    setSocket(ws);

    ws.onopen = () => {
      setError(null);
      ws.send(JSON.stringify({ type: "connect" }));
    };

    ws.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        const sender = messageData.sender;

        switch (messageData.type) {
          case "user_list":
            setConnectedUsers(messageData.users);
            break;

          case "private_message":
            const privateMsg = messageData.message;
            setMessages((prev) => [
              ...prev,
              `Private from ${sender}: ${privateMsg}`,
            ]);
            break;

          case "gold_transfer":
            const { amount, balance } = messageData;
            const isSender = sender === loggedCharName;
            const msg = isSender
              ? `You sent ${amount} gold to ${selectedUser?.char_name}. Your new balance is ${balance}.`
              : `${sender} sent you ${amount} gold. Your new balance is ${balance}.`;
            setMessages((prev) => [...prev, msg]);
            break;

          case "handle_gold_transfer_error":
            const { error_message } = messageData;
            const errorText =
              typeof error_message === "string"
                ? error_message
                : error_message?.message || "An unknown error occurred.";

            setMessages((prev) => [...prev, `Error: ${errorText}`]);
            break;
          
          case "chat_message":
            const charName = messageData.char_name;
            const messageContent = messageData.message || event.data;
            setMessages((prev) => [...prev, `${charName}: ${messageContent}`]); 
            break;
        }
      } catch (error) {
        setMessages((prev) => [...prev, event.data]);
      }
    };

    ws.onclose = (event) => {
      setError("Connection closed unexpectedly.");
    };

    ws.onerror = (ev: Event) => {
      const err = ev as ErrorEvent;
      toast.error(err.message);
      setError(
        "Failed to connect to the chat room. Please check the server and try again."
      );
    };

    return () => {
      ws.close(1000, "Component unmounted");
    };
  }, [roomName, selectedUser?.char_name, loggedCharName, decryptedRoomName]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (
      socket &&
      socket.readyState === WebSocket.OPEN &&
      newMessage.trim() !== ""
    ) {
      const message = { type: "group_message", message: newMessage };
      socket.send(JSON.stringify(message));
      setNewMessage(""); // Clear input after sending
    }
  }, [socket, newMessage]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [sendMessage]);

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
      !isNaN(Number(goldAmount)) &&
      Number(goldAmount) > 0
    ) {
      const message = {
        type: "gold_transfer",
        recipient_id: selectedUser.user_id,
        amount: Number(goldAmount), // Gold amount as a number
      };
      socket.send(JSON.stringify(message));
      setGoldAmount(""); // Clear the input
    }
  };

  if (error) return <LoadingIcon loading={true} />;

  return (
    <div>
      <h2>Chat Room: {decryptedRoomName}</h2>
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
      <br />
      <TextField
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        sx={{ width: "80%" }}
        placeholder="Type a message..."
      />
      <Button variant="contained" onClick={sendMessage}>
        Send
      </Button>
      <hr />

      <div>
        <h3>Connected Users:</h3>
        <ul>
          {connectedUsers
            .filter((user) => user.char_name !== loggedCharName)
            .map((user, idx) => (
              <li key={idx}>
                {user.char_name} -
                <Button variant="contained" onClick={() => setSelectedUser(user)}>
                  Send DM/Gold
                </Button>
              </li>
            ))}
        </ul>
      </div>

      {selectedUser && (
        <div
          style={{
            marginTop: "10px",
            borderTop: "1px solid #ccc",
            paddingTop: "10px",
          }}
        >
          <h4>Send Private Message to {selectedUser.char_name}</h4>
          <TextField
            value={privateMessage}
            onChange={(e) => setPrivateMessage(e.target.value)}
            label={`Message for ${selectedUser.char_name}`}
            sx={{ width: "80%" }}
          />
          <Button variant="contained" onClick={sendPrivateMessage}>
            Send
          </Button>
        </div>
      )}

      {selectedUser && (
        <div
          style={{
            marginTop: "10px",
            borderTop: "1px solid #ccc",
            paddingTop: "10px",
          }}
        >
          <h4>Send Gold to {selectedUser.char_name}</h4>

          <TextField
            type="number"
            inputProps={{ min: 0 }}
            value={goldAmount}
            onChange={(e) => setGoldAmount(e.target.value)}
            placeholder={`Amount to send to ${selectedUser.char_name}`}
            sx={{ width: "80%" }}
          />
          <Button variant="contained" onClick={sendGold}>
            Send Gold
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatRoomView;
