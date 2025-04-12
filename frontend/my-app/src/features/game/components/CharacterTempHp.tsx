import { TextField } from '@mui/material';
import React, { useState } from 'react';

const CharacterTempHp = () => {
    const [TempHP, setTempHP] = useState<number>(0)

    const HandleTempHp = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tempHP = parseInt(e.target.value, 10) || 0; // Handle NaN case
        setTempHP(tempHP)
        console.log(TempHP) // debugging
    }

    return (

            <TextField
             type="number"
             inputProps={{min: 0}}
             label="Temp HP"
             variant="filled"
             onChange={HandleTempHp}
             sx={{width: 100}} // This works but width should be precentage based instead of based on set pixel constant
            />
    );
}

export default CharacterTempHp;
// works but isnt saved anywhere, consider adding to SDT