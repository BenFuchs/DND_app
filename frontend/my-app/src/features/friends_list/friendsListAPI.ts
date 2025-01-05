import apiClient from '../../axiosInstance';

const SERVER = 'http://127.0.0.1:8000/';

export function getAllFriends() {
    const access = localStorage.getItem("Access");
    if (!access) {
        return Promise.reject("No access token found");
    }

    // Make sure to return the promise from the API call
    return apiClient.get(SERVER + 'getAllFriends/', {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
}

export function sendFriendInvite(friend_id:number) {
    const access = localStorage.getItem("Access");
    if (!access) {
        return Promise.reject("No access token found");
      } 
    console.log(access)

    return apiClient.post(SERVER + 'sendFriendRequest/', 
        {   friend_id   },
        {   
            headers: {
                Authorization: `Bearer ${access}`
            }
    })
}

export function respondToFriendRequest(friendship_id:number , action: string) {
    const access = localStorage.getItem("Access");
    if (!access) {
        return Promise.reject("No access token found");
      } 
    console.log(friendship_id, action)
    return apiClient.post(SERVER + 'respondToFriendRequest/', 
        {friendship_id, action},
        {headers: {
            Authorization: `Bearer ${access}`
        }
    })
}

export function removeFriend(friendship_id: number) {
    const access = localStorage.getItem("Access");
    if (!access) {
        return Promise.reject("No access token found");
    }
    return apiClient.post(
        SERVER + 'removeFriend/',
        { friendship_id }, // Request body
        {
            headers: {
                Authorization: `Bearer ${access}`, // Request headers
            },
        }
    );
}

export function getPendingRequests(){
    const access = localStorage.getItem("Access");
    if (!access) {
        return Promise.reject("No access token found");
      } 
    return apiClient.get(SERVER + 'getPendingRequests/', {
        headers: {
            Authorization: `Bearer ${access}`
        }
    })
}

export function searchUsers(username: string) {
    const access = localStorage.getItem("Access");
    if (!access) {
      return Promise.reject("No access token found");
    }
  
    return apiClient.post(SERVER + 'searchUsers/', { username }, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
  }