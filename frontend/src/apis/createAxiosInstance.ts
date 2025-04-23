// lib/createAxiosInstance.ts
import axios from 'axios';

export const createAxiosInstance = (accessToken?: string) => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  });

  // Add token if available
  instance.interceptors.request.use(config => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    function (response) {
      return response;
    }, function (error) {
      console.log('error on axios response', error);
      const status = error?.response?.status;
      if (status >= 400) {
        if (typeof window !== 'undefined') {
          console.log('must be redirected')
          window.location.href = '/auth/signin';
        } else {
          return '/auth/signin';
        }
      }
      return Promise.reject(error);
    }
  );
  return instance;
};
