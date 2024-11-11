import axios from 'axios';  
import { useState, useEffect } from 'react';
import React from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";

// Define interface for the decoded JWT payload if known
interface JwtPayload {
    username: string;
    is_staff: boolean;
    // Add other fields as needed
}

function App() {
    const SERVER = 'http://127.0.0.1:8000/'

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [access, setAccess] = useState<string>('');
    const [decodedUsername, setDecodedUsername] = useState<string>(''); 
    const [staff, setStaff] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false); // Loading state

    const navigate = useNavigate();

    const login = () => {
        console.log('Attempting to log in with:', username, password);
        setLoading(true); // Start loading
        axios.post(SERVER + 'login/', { username, password })
            .then(res => {
                setAccess(res.data.access);
                localStorage.setItem('Access', res.data.access); // Save token after setting it
                setLoading(false); // Stop loading
                navigate(`/sheets`); // Redirect to sheets after token is set
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false); // Stop loading if there's an error
            });
    };


    const register = () => {
        console.log(username, password);
        axios.post(SERVER + 'register/', { username, password })
            .then(res => console.log(res.data))
            .catch(error => console.error('Error fetching data:', error));
    }

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
    useEffect(() => {
      if (access) {
          console.log('Access token:', access);
          localStorage.setItem("Access", access);
  
          // Decode and log the token
          const decodedToken = decodeJwt(access);
  
          // Check if decoding was successful
          if (decodedToken) {
              console.log('Decoded token:', decodedToken);
  
              // Extract and log the username and is_staff status from the token payload
              const { username, is_staff } = decodedToken;
              console.log('Username from token:', username);
  
              // Check if the staff value is true and handle it accordingly
              if (is_staff === true) {
                  console.log('Staff from token: True');
              } else {
                  console.log('Staff from token: False');
              }
  
              // Set the decoded username and staff status in the state
              setDecodedUsername(username);
              setStaff(is_staff ? 'True' : 'False'); // Use is_staff instead of staff
          } else {
              console.error('Failed to decode token.');
          }
      }
  }, [access]); // Dependency array - runs when `access` changes
  

    return (
        <div>
        {loading ? (
            <p>Loading, please wait...</p> // Show loading message or spinner
        ) : (
            <>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                
                <button onClick={login}>LOGIN</button>
                <button onClick={register}>REGISTER</button>
            </>
        )}
    </div>

    );
}

export default App;