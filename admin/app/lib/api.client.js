import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;


export const apiClient = axios.create({
    baseURL: `${BACKEND_URL}/api/v1`,
    timeout: 20000,
  
});
