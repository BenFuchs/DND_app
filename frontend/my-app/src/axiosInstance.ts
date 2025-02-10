import axios, { AxiosRequestConfig } from 'axios';
const SERVER = "https://dnd-backend-f57d.onrender.com/";


// Create Axios instance
const apiClient = axios.create({
  baseURL: SERVER,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper variables for refreshing tokens
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to handle refreshing subscribers
const onRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Attach interceptor
apiClient.interceptors.response.use(
  (response) => response, // Return response if successful
  async (error) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config;

    // Check if error is due to an expired access token
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Prevent infinite retry loop

      // Refresh token if not already refreshing
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('Refresh'); // Get refresh token
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Call the refresh token endpoint
          const { data } = await axios.post(SERVER+'refresh/', {
            refresh: refreshToken,
          });

          const newAccessToken = data.access;
          localStorage.setItem('Access', newAccessToken);

          // Notify all subscribers with the new token
          onRefreshed(newAccessToken);
          isRefreshing = false;

          // Retry the original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          // Handle refresh token expiration
          localStorage.removeItem('Access');
          localStorage.removeItem('Refresh');
          window.location.href = '/'; // Redirect to login page
          return Promise.reject(refreshError);
        }
      }

      // Queue subsequent requests until the refresh completes
      return new Promise((resolve) => {
        refreshSubscribers.push((newToken: string) => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          }
          resolve(apiClient(originalRequest));
        });
      });
    }

    return Promise.reject(error); // Reject for other errors
  }
);

export default apiClient;
