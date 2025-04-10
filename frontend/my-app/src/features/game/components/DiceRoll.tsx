import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../../../StyleSheets/diceTray.module.css';
import { rollDiceAsync } from '../gameSlice';
import { useAppDispatch } from "../../../app/hooks";
import { Button } from '@mui/material';

const DiceRoll = () => {
  const dispatch = useAppDispatch();

  // Set up state for diceType, amount, and roll results
  const [diceType, setDiceType] = useState(4); // Default dice type (d4)
  const [amount, setAmount] = useState(1); // Default number of dice
  const [rollResult, setRollResult] = useState<number[] | null>([0]); // Array for roll results
  const [modalOpen, setModalOpen] = useState(false); // State for controlling modal visibility


  useEffect(() => {
    if (rollResult) {
      // console.log('Updated roll results:', rollResult);
    }
  }, [rollResult]);

  // Handle roll dice action
  const handleDiceRoll = async () => {
    try {
      const result = await dispatch(rollDiceAsync({ diceType, amount }));
      // console.log(result.payload)
      // Assuming the response is an array of results in result.payload
      if (result.payload) {
        setRollResult(result.payload); // Set the array of results
        setModalOpen(true); // Open the modal with the results
      } else {
        console.error('No result in response:', result);
      }
    } catch (error) {
      console.error('Error rolling dice:', error);
    }
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

      <div>
        <motion.div>
          <Button
            variant='contained'
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}    
            onClick={handleDiceRoll}
            sx={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%"}}
            >
            Roll!
          </Button>
        </motion.div>
      </div>

      {/* Conditionally render the DiceRollsModal with the roll results */}
      {modalOpen && rollResult && (
       
          <p className='formGroup'>Roll Results: {rollResult.join(', ')}</p>
      
      )}
    </div>
  );
};

export default DiceRoll;
// need to work on css inside the modal => more dice shifts the text in the modal to the left