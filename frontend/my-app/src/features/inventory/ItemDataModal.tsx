import React from "react";
import { motion } from "framer-motion";
import Backdrop from "../game/components/Backdrop";
import { Item } from "./inventorySlice"; // Ensure you import Item type
import styles from '../../StyleSheets/itemDataModal.module.css';

interface ItemDataModalProps {
  modal: boolean;
  handleClose: () => void;
  backdropClass: string;
  modalClass: string;
  isDarkMode: boolean;
  itemData: Item | null; // itemData typed as Item or null
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

const ItemDataModal: React.FC<ItemDataModalProps> = ({
  handleClose,
  backdropClass,
  modalClass,
  isDarkMode,
  itemData,
}) => {
  if (!itemData) {
    return <div>Loading...</div>;
  }

  const formatData = (item: any) => {
    if (!item || !item["Item Data"]) return {}; // Return empty object if itemData is invalid
    const itemData = item["Item Data"];
    const { ID, ...rest } = itemData;
    return rest;
  };

  const formattedItemData = formatData(itemData); // Format the item data to exclude unwanted fields

  return (
    <Backdrop onClick={handleClose} className={backdropClass}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={`${modalClass} ${isDarkMode ? "dark-modal" : "light-modal"}`}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className={styles.itemContent}>
          {Object.entries(formattedItemData).map(([key, value]) => (
            <div key={key} className={styles.itemProperty}>
              <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>
              <span
                className={
                  key.toLowerCase() === "description"
                    ? styles.itemDescription
                    : styles.itemValue
                }
              >
                {typeof value === "string" || typeof value === "number"
                  ? value
                  : JSON.stringify(value)}
              </span>
            </div>
          ))}
        </div>

        <button onClick={handleClose} className={styles.modalBtn}>
          Close
        </button>
      </motion.div>
    </Backdrop>
  );
};

export default ItemDataModal;
