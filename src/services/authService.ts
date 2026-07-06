import { apiClient } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  [key: string]: unknown;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const payload: LoginRequest = {
    username,
    password,
  };

  const response = await apiClient.post<LoginResponse>(ENDPOINTS.LOGIN, payload);

  return response.data;
}
