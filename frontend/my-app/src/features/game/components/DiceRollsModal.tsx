import React from "react";
import { motion } from "framer-motion";
import Backdrop from "./Backdrop";

interface DiceRollsModalProps {
  modal: boolean;
  handleClose: () => void;
  backdropClass: string;
  modalClass: string;
  children: React.ReactNode; // Accept children as props
}

const dropIn = {
  hidden: {
    y: "100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const DiceRollsModal: React.FC<DiceRollsModalProps> = ({
  handleClose,
  backdropClass,
  modalClass,
  children,  // Render children here
}) => {
  return (
    <Backdrop onClick={handleClose} className={backdropClass}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={modalClass}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}  {/* Render children inside the modal */}
        <button onClick={handleClose} className="modal-btn">
          Close
        </button>
      </motion.div>
    </Backdrop>
  );
};

export default DiceRollsModal;