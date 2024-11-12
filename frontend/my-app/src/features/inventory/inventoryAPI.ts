// actions/inventoryActions.ts
import axios from 'axios';
const SERVER = 'http://127.0.0.1:8000/';


export function getInventory(id:number){
    const access = localStorage.getItem("Access");
    if (!access) {
        return Promise.reject("No access token found");
      } // Get the access token from localStorage

    return axios.get(SERVER + 'getInventory/', {
        params: {id},
        headers: {
            Authorization: `Bearer ${access}`, // Send the access token in the header
        }
    })
}

export function searchItems(query:string) {
    const access = localStorage.getItem("Access");
    if (!access) {
        return Promise.reject("No access token found");
      } // Get the access token from localStorage

    return axios(SERVER + 'searchItems/',{
        params: {query},
        headers: {
            Authorization: `Bearer ${access}`, // Send the access token in the header
        }
    })
}

export function addItemToInventory(
    itemID: number,
    id :number
) {
    const access = localStorage.getItem("Access")
    if (!access) {
        return Promise.reject("No access token found")
    }

    return axios.post(SERVER + 'addToInventory/', {
        itemID,
        id
    }, {
        headers: {
            Authorization: `Bearer ${access}`,
        }
    });
}    
