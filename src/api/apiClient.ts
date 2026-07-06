import { create } from 'axios';

export const apiClient = create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // TODO: Attach auth headers when token storage is added.
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // TODO: Normalize API errors after the backend error contract is finalized.
    return Promise.reject(error);
  },
);
