import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styleSheets/diceTray.css'; // Adjust the path if necessary
import { rollDiceAsync } from '../gameSlice';
import { useAppDispatch } from "../../../app/hooks";
import DiceRollsModal from './DiceRollsModal'; // Import the modal component

const DiceRoll = () => {
  const dispatch = useAppDispatch();

  // Set up state for diceType, amount, and roll results
  const [diceType, setDiceType] = useState(4); // Default dice type (d4)
  const [amount, setAmount] = useState(1); // Default number of dice
  const [rollResult, setRollResult] = useState<number[] | null>(null); // Array for roll results
  const [modalOpen, setModalOpen] = useState(false); // State for controlling modal visibility

  // Handle roll dice action
  const handleDiceRoll = async () => {
    try {
      const result = await dispatch(rollDiceAsync({ diceType, amount }));

      // Assuming the response is an array of results in result.payload
      if (result.payload && Array.isArray(result.payload)) {
        setRollResult(result.payload); // Set the array of results
        setModalOpen(true); // Open the modal with the results
      } else {
        console.error('No result in response:', result);
      }
    } catch (error) {
      console.error('Error rolling dice:', error);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };

  return (
    <div>
      <div className="form-group">
        <label>Dice Type</label>
        <select
          name="diceType"
          id="diceType"
          value={diceType}
          onChange={(e) => setDiceType(Number(e.target.value))}
        >
          <option value="4">d4</option>
          <option value="6">d6</option>
          <option value="8">d8</option>
          <option value="10">d10</option>
          <option value="12">d12</option>
          <option value="20">d20</option>
        </select>
      </div>

      <div className="form-group">
        <label>How many dice?</label>
        <select
          name="amount"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div className="centerButton">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDiceRoll}
        >
          Roll!
        </motion.button>
      </div>

      {/* Conditionally render the DiceRollsModal with the roll results */}
      {modalOpen && rollResult && (
        <DiceRollsModal
          modal={modalOpen}
          handleClose={handleCloseModal}
          backdropClass="backdrop"
          modalClass="modal"
        >
          {/* Render roll results directly in the modal */}
          <p>Roll Results: {rollResult.join(', ')}</p>
        </DiceRollsModal>
      )}
    </div>
  );
};

export default DiceRoll;
