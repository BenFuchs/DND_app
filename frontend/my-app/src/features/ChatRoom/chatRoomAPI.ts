import axios from "axios";

const SERVER = "http://127.0.0.1:8000/";

export function getChatRooms() {
  const access = localStorage.getItem("Access");
  if (!access) {
    return Promise.reject(new Error("No access token found"));
  }

  return axios.get(`${SERVER}getChatRooms/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
}

export function createChatRoom(roomName: string, password: string) {
  const access = localStorage.getItem("Access");
  if (!access) {
    return Promise.reject(new Error("No access token found"));
  }

  return axios.post(
    `${SERVER}createChatRoom/`,
    { room_name: roomName, password },
    {
      headers: { Authorization: `Bearer ${access}` },
    }
  );
}

export function verifyRoomPassword(roomName: string, password: string) {
  const access = localStorage.getItem("Access");
  if (!access) {
    return Promise.reject(new Error("No access token found"));
  }

  return axios.post(
    `${SERVER}verifyRoomPassword/`,
    { room_name: roomName, password },
    {
      headers: { Authorization: `Bearer ${access}` },
    }
  );
}
