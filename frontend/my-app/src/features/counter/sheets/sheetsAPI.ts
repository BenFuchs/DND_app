import axios from 'axios'

const SERVER = 'http://127.0.0.1:8000/'

export function num_of_sheets() {
    const access = localStorage.getItem('Access'); // Get the access from localStorage
    // console.log('token: ', access) #debug
    return axios.get(SERVER + 'sheetNum/', {
        headers: {
            'Authorization': `Bearer ${access}`  // Send the access in the header
        }
    });
}

export function create_new_sheet(characterName: string, charClass: number, race: number) {
    const access = localStorage.getItem('Access'); // Get the access token from localStorage
    return axios.post(SERVER + 'sheetCreation/', {
        data: { 
            characterName: characterName,  // Send character name
            charClass: charClass,          // Send character class
            race: race,                    // Send race
        },
    }, {
        headers: {
            'Authorization': `Bearer ${access}`,  // Send the access token in the header
        }
    })
}
