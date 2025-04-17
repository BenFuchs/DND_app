import { TextField } from '@mui/material';
import React from 'react';

interface CharacterTempHpProps {
    tempHP: number;
    setTempHP: (value: number) => void;
  }
  
  const CharacterTempHp = ({ tempHP, setTempHP }: CharacterTempHpProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      setTempHP(isNaN(value) ? 0 : value);
    };
  
    return (
      <TextField
        type="number"
        inputProps={{ min: 0 }}
        label="Temp HP"
        variant="filled"
        value={tempHP}
        onChange={handleChange}
        sx={{ width: 100 }}
      />
    );
  };
  
  export default CharacterTempHp;
  