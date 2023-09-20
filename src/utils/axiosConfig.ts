import axios from 'axios';
import { getBaseURLToDev } from '../constants/Generals';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;


export const axiosInstance = axios.create({
  
  timeout: 10000,
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3.raw'
  }
});

axiosInstance.interceptors.request.use(
  async config => {
    config.baseURL = getBaseURLToDev();
    return config;
  },
  (error: any) => {
    Promise.reject(error);
  },
);