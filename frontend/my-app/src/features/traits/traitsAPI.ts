import apiClient from '../../axiosInstance';

const SERVER = 'https://dnd-backend-tndp.onrender.com/';

export function getRaceTraits(id: number) {
    const access = localStorage.getItem("Access");

    if (!access) {
        return Promise.reject(new Error("No access token found"));
    }

    return apiClient.post(
        SERVER + 'getRaceFeatures/',
        { id },
        {
            headers: {
                'Authorization': `Bearer ${access}`
            }
        }
    ).catch(error => {
        console.error("Error fetching race traits:", error.message);
        throw error; // Rethrow for error handling in Redux thunk
    });
}
