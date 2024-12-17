import { useEffect, useState } from "react";

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
        <input
          id="currencyAction"
          type="number"
          min={0}
          value={localCurrencyAmount}
          onChange={handleChange}
        />
      </label>
      <button onClick={() => onAdd(localCurrencyAmount)}>+</button>
      <button onClick={() => onSubtract(localCurrencyAmount)}>-</button>
    </div>
  );
};

export default CurrencyCalculator;
