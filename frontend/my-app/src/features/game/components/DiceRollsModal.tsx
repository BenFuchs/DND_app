import React from "react";
import { motion } from "framer-motion";
import { Modal, Button, Box, useTheme } from "@mui/material";
import styles from "../../../StyleSheets/gamecomponent.module.css";

interface DiceRollsModalProps {
  modal: boolean;
  handleClose: () => void;
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
  modal,
  handleClose,
  children,
}) => {
  const theme = useTheme()
  return (
    <Modal
      open={modal}
      onClose={handleClose}
      closeAfterTransition
      BackdropProps={{
        timeout: 500, // Customize backdrop transition if needed
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300, // Ensure the modal backdrop stays on top
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className={`${styles.modal}`}
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Box
            sx={{
              width: "100%", // Set modal width
              height: "100%", // Set modal height
              padding: "2rem",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "rgb(27, 27, 27)",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            {children}
            <br />
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </motion.div>
      </Box>
    </Modal>
  );
};

export default DiceRollsModal;
