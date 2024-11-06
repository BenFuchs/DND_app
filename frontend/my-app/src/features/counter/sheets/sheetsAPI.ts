import axios from 'axios'

const SERVER = 'http://127.0.0.1:8000/'

export function num_of_sheets() {
    const access = localStorage.getItem('Access'); // Get the access from localStorage
    console.log('token: ', access)
    return axios.get(SERVER + '/sheetNum', {
        headers: {
            'Authorization': `Bearer ${access}`  // Send the access in the header
        }
    });
}

export function createNewSheet() {
    const access = localStorage.getItem('Access');
    console.log('token: ', access)
    if (access)
        return axios.post(SERVER + '/sheetCreation', {
            headers: {
                'Authorization': `Bearer ${access}`
            }
        });
}
