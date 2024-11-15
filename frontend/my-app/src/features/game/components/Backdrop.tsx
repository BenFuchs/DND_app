import { motion } from "framer-motion";
import React from "react";

interface BackdropProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string; // Allow className to be passed in as an optional property
}

const Backdrop: React.FC<BackdropProps> = ({ children, onClick, className }) => {
  return (
    <motion.div
      className={className} // Use the className prop here
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
