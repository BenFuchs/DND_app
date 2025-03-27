import apiClient from '../../axiosInstance';

const SERVER = "https://dnd-backend-f57d.onrender.com/";

export function register(username:string, password:string) {
    return apiClient.post(SERVER + 'register/', { username, password })
  
}