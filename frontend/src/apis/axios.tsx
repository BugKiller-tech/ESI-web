import axios from 'axios';

axios.interceptors.request.use((config) => {
    config.baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

    const token = '';

    config.headers.Authorization = `Bearer ${token}`
    return config;
});

export default axios;
