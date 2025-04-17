import { TextField } from '@mui/material';
import React from 'react';

interface CharacterHPProps {
    hitpoints: number;
    currentHP: number;
    setCurrentHP: (value: number) => void;
  }
  
  const CharacterCurrentHp = ({ hitpoints, currentHP, setCurrentHP }: CharacterHPProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      setCurrentHP(isNaN(value) ? 0 : value);
    };
  
    return (
      <TextField
        type="number"
        inputProps={{ min: 0, max: hitpoints }}
        value={currentHP}
        onChange={handleChange}
        label="Current HP"
        variant="filled"
        sx={{ width: 100 }}
      />
    );
  };
  
  export default CharacterCurrentHp;
  