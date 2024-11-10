import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { updateGold } from '../game/gameSlice';  // Import the updateGold action
import { RootState } from '../../app/store';  // Import RootState for type safety

interface SheetData {
  char_name: string;
  char_class: number;
  char_gold: number;
  stat_Strength: number;
  stat_Dexterity: number;
  stat_Constitution: number;
  stat_Intelligence: number;
  stat_Wisdom: number;
  stat_Charisma: number;
  race: number;
}

const GameComponent = () => {
  const { sheetID } = useParams<{ sheetID: string }>();
  const dispatch = useAppDispatch();
  
  // Use Redux state to manage gold and loading state
  const { gold, loading, error } = useAppSelector((state: RootState) => state.game);

  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [currencyAmount, setCurrencyAmount] = useState<number>(0);  // Local state for currency input

  useEffect(() => {
    const storedSheetData = localStorage.getItem("SheetData");
    if (storedSheetData) {
      const parsedData = JSON.parse(storedSheetData);
      console.log(parsedData);
      // Access the nested data property directly
      setSheetData(parsedData.data);
    }
  }, []);

  // Handles adding gold
  const handleAddGold = async () => {
    if (sheetData && !isNaN(currencyAmount) && currencyAmount > 0) {
      try {
        // Dispatch the updateGold async action with the race value for 'add' action
        await dispatch(updateGold({ amount: currencyAmount, action: 'add', race: sheetData.race }));
        setCurrencyAmount(0); // Clear the input field after action
      } catch (err) {
        console.error("Error adding gold:", err);
      }
    }
  };

  // Handles subtracting gold
  const handleSubtractGold = async () => {
    if (sheetData && !isNaN(currencyAmount) && currencyAmount > 0) {
      try {
        // Dispatch the updateGold async action with the race value for 'subtract' action
        await dispatch(updateGold({ amount: currencyAmount, action: 'subtract', race: sheetData.race }));
        setCurrencyAmount(0); // Clear the input field after action
      } catch (err: any) {
        console.error("Error subtracting gold:", err);
  
        // Check if the error is related to insufficient gold
        if (err.response && err.response.data && err.response.data.msg) {
          alert(`Not enough gold for this action: ${err.response.data.msg}`);
        } else {
          alert("An unexpected error occurred.");
        }
      }
    }
  };

  return (
    <div>
      <h1>Game Component</h1>
      <p>Currently viewing sheet ID: {sheetID}</p>

      {sheetData ? (
        <div>
          <p><strong>Character Name:</strong> {sheetData.char_name}</p>
          <p><strong>Character Class:</strong> {sheetData.char_class}</p>
          <p><strong>Character Race:</strong> {sheetData.race}</p>
          <p><strong>Gold:</strong> {gold}</p> {/* Display the gold from Redux state */}

          <h3>Stats</h3>
          <ul>
            <li>Strength: {sheetData.stat_Strength}</li>
            <li>Dexterity: {sheetData.stat_Dexterity}</li>
            <li>Constitution: {sheetData.stat_Constitution}</li>
            <li>Intelligence: {sheetData.stat_Intelligence}</li>
            <li>Wisdom: {sheetData.stat_Wisdom}</li>
            <li>Charisma: {sheetData.stat_Charisma}</li>
          </ul>
        </div>
      ) : (
        <p>Loading sheet data...</p>
      )}

      {/* Currency Calculator */}
      <div id='currencyCalc'>
        <label>
          Currency Action:
          <input 
            id='currencyAction' 
            type="number" 
            value={currencyAmount} 
            onChange={(e) => setCurrencyAmount(parseInt(e.target.value, 10))}
          />
        </label>
        <button onClick={handleAddGold}>+</button>
        <button onClick={handleSubtractGold}>-</button>
      </div>

      {loading && <p>Loading...</p>} {/* Display loading state if action is in progress */}
      {error && <p>Error: {error}</p>} {/* Display error message if there's an issue */}
    </div>
  );
};

export default GameComponent;
