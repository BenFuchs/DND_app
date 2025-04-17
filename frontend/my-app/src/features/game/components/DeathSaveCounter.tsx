import React, { useState } from 'react';
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  Box,
  Button,
} from '@mui/material';

const DeathSaveCounter = () => {
  const [successes, setSuccesses] = useState([false, false, false]);
  const [failures, setFailures] = useState([false, false, false]);

  const toggleCheckbox = (
    index: number,
    type: 'success' | 'failure'
  ) => {
    const state = type === 'success' ? [...successes] : [...failures];
    state[index] = !state[index];

    if (type === 'success') setSuccesses(state);
    else setFailures(state);
  };

  const resetSaves = () => {
    setSuccesses([false, false, false]);
    setFailures([false, false, false]);
  };

  return (
    <Box sx={{ mt: 2 }}>
      
      <Typography variant="h6">Death Saves</Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
        <Typography>Successes:</Typography>
        <FormGroup row>
          {successes.map((checked, i) => (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  checked={checked}
                  onChange={() => toggleCheckbox(i, 'success')}
                  color="success"
                />
              }
              label=""
            />
          ))}
        </FormGroup>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
        <Typography>Failures:</Typography>
        <FormGroup row>
          {failures.map((checked, i) => (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  checked={checked}
                  onChange={() => toggleCheckbox(i, 'failure')}
                  color="error"
                />
              }
              label=""
            />
          ))}
        </FormGroup>
      </Box>
      <Button
        variant="outlined"
        color="secondary"
        onClick={resetSaves}
        sx={{ mt: 2 }}
      >
        Reset
      </Button>
     
    </Box>
  );
};

export default DeathSaveCounter;
