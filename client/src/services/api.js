import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const searchPosts = async (query) => {
  const response = await API.get(`/posts/search?q=${query}`);
  return response.data;
};

export default API;
