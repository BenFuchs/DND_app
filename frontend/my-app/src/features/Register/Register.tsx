import React, { useState } from 'react'
import { useAppDispatch } from '../../app/hooks';
import { toast, ToastContainer } from "react-toastify";
import { Button, TextField } from "@mui/material";
import LoadingIcon from "../hashLoading/loadingIcon";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { registerAsync } from './registerSlice';
import styles from "../../StyleSheets/login.module.css";


const Register = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, ] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const registerUser = () => {
        // console.log("Attempting to register with:", username, password);
    
        dispatch(registerAsync({ username, password }))
          .then(() => {
            toast.success("Registration successful! Logging in now...");
            navigate('/login')
          })
          .catch(() => {
            toast.error("Registration failed. Please try again.");
          });
      };


  return (
    <div>
        <ToastContainer />
        <LoadingIcon loading={loading} />{" "}
        {/* Display the loader when loading */}
        {!loading && (
          <>
            <form>
              <div className={styles.formField}>
                <TextField
                  label="Username"
                  variant="filled"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className={styles.formField}>
                <TextField
                  label="Password"
                  variant="filled"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className={styles.formField}>
                
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault();
                    registerUser();
                  }}
                >
                  {" "}
                  Register
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
  )
}

export default Register