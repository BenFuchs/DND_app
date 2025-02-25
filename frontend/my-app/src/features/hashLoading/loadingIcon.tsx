import React from "react";
import styles from "../../StyleSheets/login.module.css";
import { HashLoader } from "react-spinners";

interface LoadingProps {
  loading: boolean;
}

const LoadingIcon: React.FC<LoadingProps> = ({ loading }) => {
  if (!loading) return null; // Don't render anything if loading is false

  return (
    <div className={styles.loadingContainer}>
      <HashLoader color="#ffffff" size={50} />
    </div>
  );
};

export default LoadingIcon;
