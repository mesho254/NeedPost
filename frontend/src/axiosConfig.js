import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'https://blog-sum-rna1.vercel.app/',
  baseURL: 'https://need-post-w4ed.vercel.app/api',
});

axiosInstance.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default axiosInstance;