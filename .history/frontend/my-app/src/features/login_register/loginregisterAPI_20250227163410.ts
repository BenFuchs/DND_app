import apiClient from '../../axiosInstance';

const SERVER = "http://127.0.0.1:8000/"


export function login(username:string, password:string) {
    console.log('Attempting to log in with:', username, password);
    return apiClient.post(SERVER + 'login/', { username, password })
}

export function register(username:string, password:string) {
    return apiClient.post(SERVER + 'register/', { username, password })
  
}