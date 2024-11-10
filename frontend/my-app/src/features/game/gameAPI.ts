import axios from 'axios';

const SERVER = 'http://127.0.0.1:8000/';

export function currencyCalc(amount: number, action: 'add' | 'subtract',race:number) {
  const access = localStorage.getItem('Access'); // Get the access token from localStorage
  
  if (!access) {
    return Promise.reject('No access token found');
  }

  return axios.post(
    SERVER + 'currencyCalc/', 
    {
      amount,    // The amount to add or subtract
      action,   // The action (either "add" or "subtract")
      race      // race of the character to know what table to address
    },
    {
      headers: {
        'Authorization': `Bearer ${access}`,  // Send the access token in the header
      },
    }
  );
}
