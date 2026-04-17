// client/src/api/aiAPI.js
import axiosInstance from './axiosInstance';

const aiAPI = {
  generateQuestions: async (params) => {
    return await axiosInstance.post('/ai/generate-questions', params, {
      timeout: 90000,
    });
  },

  generateExam: async (params) => {
    return await axiosInstance.post('/ai/generate-exam', params, {
      timeout: 90000,
    });
  },
};

export default aiAPI;