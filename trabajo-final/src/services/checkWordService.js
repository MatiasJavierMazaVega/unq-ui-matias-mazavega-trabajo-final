// services/checkWordService.js
import axios from 'axios';

const API_BASE_URL = 'https://word-api-hmlg.vercel.app/api';

export const checkWord = async (sessionId, word) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/checkWord`, {
      sessionId,
      word
    });
    return response.data; // array con feedback de letras
  } catch (error) {
    throw error;
  }
};
