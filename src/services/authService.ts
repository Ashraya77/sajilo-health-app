import { apiClient } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import { saveAuthTokens, type AuthTokens } from '@/services/tokenStorage';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  [key: string]: unknown;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getStringField(source: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }

  return null;
}

function extractAuthTokens(data: LoginResponse): AuthTokens | null {
  const accessToken = getStringField(data, ['access', 'access_token', 'accessToken', 'token']);
  const refreshToken = getStringField(data, ['refresh', 'refresh_token', 'refreshToken']);

  if (accessToken && refreshToken) {
    return {
      accessToken,
      refreshToken,
    };
  }

  if (!isObject(data.data)) {
    return null;
  }

  const nestedAccessToken = getStringField(data.data, [
    'access',
    'access_token',
    'accessToken',
    'token',
  ]);
  const nestedRefreshToken = getStringField(data.data, ['refresh', 'refresh_token', 'refreshToken']);

  if (!nestedAccessToken || !nestedRefreshToken) {
    return null;
  }

  return {
    accessToken: nestedAccessToken,
    refreshToken: nestedRefreshToken,
  };
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const payload: LoginRequest = {
    username,
    password,
  };

  const response = await apiClient.post<LoginResponse>(ENDPOINTS.LOGIN, payload);

  const tokens = extractAuthTokens(response.data);

  if (!tokens) {
    throw new Error('Login succeeded, but authentication tokens were missing from the response.');
  }

  await saveAuthTokens(tokens);

  return response.data;
}
