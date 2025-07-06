import axios from 'axios';

const API_BASE_URL = 'https://word-api-hmlg.vercel.app/api';

export const getDifficulties = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/difficulties`);
    return response.data; 
  } catch (error) {
    console.error('Error getting difficulties:', error);
    throw error;
  }
};