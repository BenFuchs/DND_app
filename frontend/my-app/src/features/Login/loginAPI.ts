import apiClient from '../../axiosInstance';

const SERVER = "https://dnd-backend-f57d.onrender.com/";


export function login(username:string, password:string) {
    return apiClient.post(SERVER + 'login/', { username, password })
}

