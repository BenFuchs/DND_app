import apiClient from '../../axiosInstance';

const SERVER = "https://dnd-backend-f57d.onrender.com/";


export function login(username:string, password:string) {
    console.log('Attempting to log in with:', username, password);
    return apiClient.post(SERVER + 'login/', { username, password })
}

export function register(username:string, password:string) {
    return apiClient.post(SERVER + 'register/', { username, password })
  
}