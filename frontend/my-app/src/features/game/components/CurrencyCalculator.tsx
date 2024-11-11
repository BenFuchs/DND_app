import { useState } from "react";

// CurrencyCalculator.tsx
interface CurrencyCalculatorProps {
    onAdd: (amount: number) => void;
    onSubtract: (amount: number) => void;
  }
  
  const CurrencyCalculator = ({ onAdd, onSubtract }: CurrencyCalculatorProps) => {
    const [currencyAmount, setCurrencyAmount] = useState<number>(0);
  
    return (
      <div id="currencyCalc">
        <label>
          Currency Action:
          <input
            id="currencyAction"
            type="number"
            min={0}
            value={currencyAmount}
            onChange={(e) => setCurrencyAmount(parseInt(e.target.value, 10))}
          />
        </label>
        <button onClick={() => onAdd(currencyAmount)}>+</button>
        <button onClick={() => onSubtract(currencyAmount)}>-</button>
      </div>
    );
  };
  
  export default CurrencyCalculator;
  