import http from './http';
import router from '../app/router';

http.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) router.push('/login');
    return Promise.reject(error);
  }
);