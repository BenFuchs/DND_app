import React, { useState } from 'react';
import { loginAsync, registerAsync } from './loginregisterSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../StyleSheets/login.module.css'


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

    return (
        <div>
            <ToastContainer />
            <form>
                <div className={styles.formField}>
                    <label className={styles.label}>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={styles.input} />
                </div>
    
                <div className={styles.formField}>
                    <label className={styles.label}>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} />
                </div>
                <div className={styles.formField}>
                <button 
                onClick={login} 
                disabled={loading}
                className={styles.button}
                >
                    {loading ? 'Logging in...' : 'LOGIN'}
                </button>
                <button onClick={register} className={styles.button}>REGISTER</button>
                </div>
            </form>
        </div>
    );
};

export default LoginRegister;
