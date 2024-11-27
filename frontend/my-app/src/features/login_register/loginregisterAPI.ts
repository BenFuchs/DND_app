import axios from 'axios';  
const SERVER = 'http://127.0.0.1:8000/'

export function login(username:string, password:string) {
    console.log('Attempting to log in with:', username, password);
    return axios.post(SERVER + 'login/', { username, password })
}

export function register(username:string, password:string) {
    return axios.post(SERVER + 'register/', { username, password })
  
}