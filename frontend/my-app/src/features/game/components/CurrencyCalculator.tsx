import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface CurrencyCalculatorProps {
    onAdd: (amount: number) => void;
    onSubtract: (amount: number) => void;
    setCurrencyAmount: React.Dispatch<React.SetStateAction<number>>; // Accept setCurrencyAmount function
}

const CurrencyCalculator = ({ onAdd, onSubtract, setCurrencyAmount}: CurrencyCalculatorProps) => {
  const [localCurrencyAmount, setLocalCurrencyAmount] = useState<number>(0);

  // Sync local state with the parent state
  useEffect(() => {
    setLocalCurrencyAmount(0); // Reset when currencyAmount changes in the parent
  }, [setCurrencyAmount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(e.target.value, 10) || 0; // Handle NaN case
    setLocalCurrencyAmount(newAmount); // Update local state
    setCurrencyAmount(newAmount); // Update the parent state
  };

  return (
    <div id="currencyCalc">
      <label>
        Currency Action:
        <br/>
        <TextField 
        type="number"
        inputProps={{min: 0}}
        value={localCurrencyAmount}
        onChange={handleChange}
        variant="filled"
        />
      </label>
      <br/>
      <Button variant="contained" onClick={() => onAdd(localCurrencyAmount)}><AddIcon/></Button>
      <Button variant="contained" onClick={() => onSubtract(localCurrencyAmount)}><RemoveIcon/></Button>

    </div>
  );
};

export default CurrencyCalculator;
