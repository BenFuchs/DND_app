import apiClient from '../../axiosInstance';
const SERVER = 'https://dnd-backend-tndp.onrender.com/';

export function getClassFeatures(char_name: string) {
    const access = localStorage.getItem("Access");
    if (!access) {
        return Promise.reject(new Error("No access token found"));
    }

    return apiClient.post(
        SERVER + 'getClassFeatures/',
        {char_name},
        {
            headers: {
                'Authorization': `Bearer ${access}`
            }
        }
    ).catch(error => {
        console.error("Error fetching class features:", error.message);
        throw error; // Rethrow for error handling in Redux thunk
    });
}