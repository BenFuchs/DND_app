import React, { useState } from 'react';
import { loginAsync, registerAsync } from './loginregisterSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface JwtPayload {
    username: string;
    is_staff: boolean;
    // Add other fields as needed
}

const LoginRegister: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const login = () => {
        console.log('Attempting to log in with:', username, password);
        setLoading(true);

        dispatch(loginAsync({ username, password }))
            .then((response) => {
                setLoading(false);

                const token = response.payload.access;
                const refresh = response.payload.refresh;

                if (token && refresh) {
                    localStorage.setItem('Access', token);
                    localStorage.setItem('Refresh', refresh);
                    toast.success('Login successful!');
                    navigate(`/sheets`);
                } else {
                    toast.error('Login failed. No token received.');
                }
            })
            .catch(() => {
                setLoading(false);
                toast.error('Incorrect login credentials.');
            });
    };

    const register = () => {
        console.log('Attempting to register with:', username, password);

        dispatch(registerAsync({ username, password }))
            .then(() => {
                toast.success('Registration successful! Please log in.');
            })
            .catch(() => {
                toast.error('Registration failed. Please try again.');
            });
    };

    // const decodeJwt = (token: string): JwtPayload | null => {
    //     if (!token) return null;

    //     try {
    //         const base64Url = token.split('.')[1];
    //         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    //         const jsonPayload = decodeURIComponent(
    //             atob(base64)
    //                 .split('')
    //                 .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    //                 .join('')
    //         );

    //         return JSON.parse(jsonPayload) as JwtPayload;
    //     } catch (error) {
    //         console.error('Error decoding token:', error);
    //         return null;
    //     }
    // };

    return (
        <div>
            <ToastContainer />
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button onClick={login} disabled={loading}>
                {loading ? 'Logging in...' : 'LOGIN'}
            </button>
            <button onClick={register}>REGISTER</button>
        </div>
    );
};

export default LoginRegister;
