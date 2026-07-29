import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': undefined,
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => config,
  (error) => {
    console.error(`[API] Request Error: ${error.message}`);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const serverMsg = data?.error || data?.message || '';
      console.error(`[API] ${status} ${error.config?.url}: ${serverMsg || error.message}`);
    } else if (error.request) {
      console.error(`[API] Network Error: No response from server for ${error.config?.url}`);
    } else {
      console.error(`[API] Setup Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default api;