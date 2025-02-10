import apiClient from '../../axiosInstance';

const SERVER = 'http://127.0.0.1:8000/'

export interface OrderData {
  paypal_id: string;
  total_amount: string;
}

export const sendOrder = async (orderData: OrderData) => {
    const access = localStorage.getItem("Access")
    if (!access) {
        return Promise.reject("No access token found")
    }

  try {
    const response = await apiClient.post(SERVER + 'orders/', orderData, {
        headers: {
            Authorization: `Bearer ${access}`,
        }
    }); // Replace with actual API endpoint
    return response.data;
  } catch (error) {
    console.error('Error sending order:', error);
    throw error;
  }
};
