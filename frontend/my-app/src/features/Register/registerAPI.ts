import apiClient from '../../axiosInstance';

// const SERVER = "https://dnd-backend-f57d.onrender.com/";
const SERVER = "http://127.0.0.1:8000/";

export function register(username:string, password:string) {
    return apiClient.post(SERVER + 'register/', { username, password })
  
}