import { TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface CharacterHPProps {
    hitpoints: number;
}

const CharacterCurrentHp = ({ hitpoints }: CharacterHPProps) => {
    const [CurrentHP, setCurrentHP] = useState<number>(hitpoints); // Initialize directly

    useEffect(() => {
        setCurrentHP(hitpoints); // Update when `hitpoints` changes
    }, [hitpoints]); 

    return (
        <div>
            <TextField
             type="number"
             inputProps={{min: 0, max: hitpoints}}
             defaultValue={CurrentHP}
             label="Current HP"
             variant="filled"
             sx={{width: 100}} // This works but width should be precentage based instead of based on set pixel constant
            />
        </div>
    );
}

export default CharacterCurrentHp;
// Essentially finished, requires maybe some new design for the main sheet page 
// Consider adding to SDT 
