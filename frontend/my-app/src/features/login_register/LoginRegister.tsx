// LoginRegister.tsx
import React, { useState } from 'react';
import { loginAsync, registerAsync } from './loginregisterSlice'; // Import the login and register async functions
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

interface JwtPayload {
    username: string;
    is_staff: boolean;
    // Add other fields as needed
}

const LoginRegister: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false); // Loading state

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // const { loading: authLoading } = useAppSelector((state: any) => state.auth); // Access Redux state

    const login = () => {
        console.log('Attempting to log in with:', username, password);
        setLoading(true); // Start loading
        dispatch(loginAsync({ username, password }))
            .then((response) => {
                setLoading(false); // Stop loading
    
                // Assuming the response contains the access token in `response.payload.access`
                const token = response.payload.access;
                const refresh = response.payload.refresh
                if (token && refresh) {
                    localStorage.setItem('Access', token); // Save token to localStorage
                    localStorage.setItem('Refresh', refresh)
                    console.log('Login successful, token saved to localStorage');
                    navigate(`/sheets`); // Redirect to sheets after login
                } else {
                    console.error('No access token in response');
                    alert('Login failed, no token received');
                }
            })
            .catch(() => {
                setLoading(false); // Stop loading if there's an error
                alert('Incorrect login credentials');
            });
    };

    const register = () => {
        console.log('Attempting to register with:', username, password);
        dispatch(registerAsync({ username, password })) // Dispatch registerAsync
            .then(() => {
                alert('Registration successful! Please log in.');
            })
            .catch(() => {
                alert('Registration failed. Please try again.');
            });
    };

    const decodeJwt = (token: string): JwtPayload | null => {
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));

            return JSON.parse(jsonPayload) as JwtPayload;  // Type assertion for the payload structure
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    return (
        <div>
            {/* {authLoading || loading ? ( */}
                {/* // <p>Loading, please wait...</p> // Show loading message or spinner */}
            {/* ) : ( */}
                <>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button onClick={login}>LOGIN</button>
                    <button onClick={register}>REGISTER</button>
                </>
            
            {/* {error && <p>Error: {error}</p>} Show error message if any */}
        </div>
    );
};

export default LoginRegister;
