import React, { CSSProperties, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { loginAsync, registerAsync } from "./loginregisterSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../StyleSheets/login.module.css";
import axios from "axios";
import LoadingIcon from "../hashLoading/loadingIcon";


const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const SERVER = "https://dnd-backend-f57d.onrender.com/";

const LoginRegister: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  }

  const login = () => {
    console.log("Attempting to log in with:", username, password);
    setLoading(true);

    dispatch(loginAsync({ username, password }))
      .then((response) => {
        setLoading(false);

        const token = response.payload.access;
        const refresh = response.payload.refresh;

        if (token && refresh) {
          localStorage.setItem("Access", token);
          localStorage.setItem("Refresh", refresh);
          toast.success("Login successful!");
          navigate(`/sheets`);
        } else {
          toast.error("Login failed. No token received.");
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error("Incorrect login credentials.");
      });
  };

  const register = () => {
    console.log("Attempting to register with:", username, password);

    dispatch(registerAsync({ username, password }))
      .then(() => {
        toast.success("Registration successful! Logging in now...");
        login();
      })
      .catch(() => {
        toast.error("Registration failed. Please try again.");
      });
  };

  const handleGoogleLoginSuccess = (credentialResponse: any) => {
    // console.log('Google login successful:', credentialResponse);

    // Send the Google token to the backend for verification
    axios
      .post(SERVER + "api/auth/google/", {
        token: credentialResponse.credential,
      })
      .then((response) => {
        const { access, refresh } = response.data;
        if (access && refresh) {
          localStorage.setItem("Access", access);
          localStorage.setItem("Refresh", refresh);
          toast.success("Google login successful!");
          navigate("/sheets"); // Navigate after successful login
        } else {
          toast.error("Google login failed. No token received.");
        }
      })
      .catch(() => {
        toast.error("Google login verification failed.");
      });
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID!}>
      <div>
        <ToastContainer />
        <LoadingIcon loading={loading} /> {/* Display the loader when loading */}
        {!loading && (
          <>
            <form>
              <div className={styles.formField}>
                <label className={styles.label}>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.input}
                />
              </div>
  
              <div className={styles.formField}>
                <label className={styles.label}>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                />
              </div>
  
              <div className={styles.formField}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    login();
                  }}
                  className={styles.button}
                >
                  Login
                </button>
  
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    register();
                  }}
                  className={styles.button}
                >
                  Register
                </button>
              </div>
            </form>
  
            <div className={styles.googleLogin}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {
                  toast.error("Google login failed. Please try again.");
                }}
              />
            </div>
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginRegister;
