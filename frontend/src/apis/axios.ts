import axios from 'axios';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

// Utility to check if we’re on the server
const isServer = typeof window === 'undefined';

/**
 * Returns an Axios instance that automatically attaches Bearer token.
 * - On client: uses getSession()
 * - On server: requires passing `req` from context (e.g., from getServerSideProps)
 */
export const createAxiosInstance = async (accessToken: string) => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  });
  // Add Authorization header if token exists
  instance.interceptors.request.use(config => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      console.log('error on axios response', error);
      if (typeof window !== 'undefined') {
        console.log('must be redirected')
        window.location.href = '/auth/signin';
      } else {
        return '/auth/signin';
      }
      return Promise.reject(error);
    }
  );
  return instance;
};