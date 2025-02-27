import apiClient from '../../axiosInstance';

const SERVER = "http://127.0.0.1:8000/"

export function num_of_sheets() {
    const access = localStorage.getItem('Access'); // Get the access from localStorage
    return apiClient.get(SERVER + 'sheetNum/', {
        headers: {
            'Authorization': `Bearer ${access}`  // Send the access in the header
        }
    });
}

export function create_new_sheet(characterName: string, charClass: number, race: number, stats: number[]) {
    const access = localStorage.getItem('Access'); // Get the access token from localStorage
    return apiClient.post(SERVER + 'sheetCreation/', {
        data: { 
            characterName: characterName,  // Send character name
            charClass: charClass,          // Send character class
            race: race,   
            stats: stats                 // Send stats
        },
    }, {
        headers: {
            'Authorization': `Bearer ${access}`,  // Send the access token in the header
        }
    });
}

export function rollStats() {
    const access = localStorage.getItem('Access'); // Get the access token from localStorage
    return apiClient.get(SERVER + 'statRoll/', {
        headers: {
            'Authorization': `Bearer ${access}`,  // Send the access token in the header
        }
    });
}

export function sheet_delete(id: number) {
    const access = localStorage.getItem('Access');
    return apiClient.post(
        SERVER + 'sheet_delete/',
        { Id: id },  // Pass ID in the request body directly
        {
            headers: {
                'Authorization': `Bearer ${access}`,
            },
        }
    );
}

export function getSheetData(sheetID: number) {
    return apiClient.get(SERVER + `getSheetData/${sheetID}/`, {  // Adjust API URL if necessary
        headers: {
            Authorization: `Bearer ${localStorage.getItem('Access')}`, // Assumes JWT is stored in localStorage
        },
    });
}
