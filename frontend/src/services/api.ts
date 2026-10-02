import axios from 'axios';

const API_BASE_URL = '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For cookie support
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for refresh token or centralized error handling
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Only retry 401 if it was NOT a login or register request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/users/login') &&
      !originalRequest.url?.includes('/users/register')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
            refreshToken,
          });

          if (res.data?.data?.accessToken) {
            localStorage.setItem('accessToken', res.data.data.accessToken);
            if (res.data.data.refreshToken) {
              localStorage.setItem('refreshToken', res.data.data.refreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
            return axios(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }

    let message = error.response?.data?.message || error.message || 'Something went wrong';
    
    // If backend returned Zod validation errors array
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      const fieldErrors = error.response.data.errors.map((e: any) => `${e.field ? e.field + ': ' : ''}${e.message}`).join(', ');
      if (fieldErrors) {
        message = `${message} (${fieldErrors})`;
      }
    }

    const err = new Error(message);
    (err as any).errors = error.response?.data?.errors;
    (err as any).statusCode = error.response?.status;
    return Promise.reject(err);
  }
);
