import axios from 'axios';

const API_BASE_URL = 'https://word-api-hmlg.vercel.app/api';

export const getDifficultyById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/difficulties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting difficulty with ID ${id}:`, error);
    throw error;
  }
};
