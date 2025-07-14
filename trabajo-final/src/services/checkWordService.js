import axios from 'axios';

const API_BASE_URL = 'https://word-api-hmlg.vercel.app/api';

export const checkWord = async (sessionId, word) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/checkWord`, {
      sessionId,
      word
    });
    return response.data; 
  } catch (error) {
    throw error;
  }
};
