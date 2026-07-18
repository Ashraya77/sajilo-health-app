import {
  AxiosHeaders,
  create,
  isAxiosError,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

import { ENDPOINTS } from '@/api/endpoints';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
} from '@/services/tokenStorage';

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const apiClient = create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const refreshClient = create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<string | null> | null = null;

const AUTH_EXEMPT_ENDPOINTS: ReadonlySet<string> = new Set([
  ENDPOINTS.LOGIN,
  ENDPOINTS.REGISTER_PATIENT,
  ENDPOINTS.REFRESH_TOKEN,
]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getStringField(
  source: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }

  return null;
}

function extractAccessToken(data: unknown): string | null {
  if (!isObject(data)) {
    return null;
  }

  const topLevelToken = getStringField(data, [
    'access',
    'access_token',
    'accessToken',
    'token',
  ]);

  if (topLevelToken) {
    return topLevelToken;
  }

  return isObject(data.data)
    ? getStringField(data.data, [
        'access',
        'access_token',
        'accessToken',
        'token',
      ])
    : null;
}

function shouldAttachAuthHeader(url?: string): boolean {
  return !isAuthExemptEndpoint(url);
}

function isAuthExemptEndpoint(url?: string): boolean {
  if (!url) {
    return false;
  }

  try {
    const path = url.startsWith('http') ? new URL(url).pathname : url;
    return AUTH_EXEMPT_ENDPOINTS.has(path);
  } catch {
    return AUTH_EXEMPT_ENDPOINTS.has(url);
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await refreshClient.post(ENDPOINTS.REFRESH_TOKEN, {
      refresh: refreshToken,
      refresh_token: refreshToken,
    });
    const accessToken = extractAccessToken(response.data);

    if (!accessToken) {
      await clearAuthTokens();
      return null;
    }

    await saveAccessToken(accessToken);
    return accessToken;
  } catch {
    await clearAuthTokens();
    return null;
  }
}

apiClient.interceptors.request.use(
  async (config) => {
    if (!shouldAttachAuthHeader(config.url)) {
      return config;
    }

    const token = await getAccessToken();

    if (token) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set('Authorization', `Bearer ${token}`);
      config.headers = headers;
    }

    return config;
  },
  (error: unknown) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const axiosError = error as AxiosError;
    const originalRequest = axiosError.config as
      | RetriableRequestConfig
      | undefined;

    if (
      axiosError.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthExemptEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });

    const accessToken = await refreshPromise;

    if (!accessToken) {
      return Promise.reject(error);
    }

    const headers = AxiosHeaders.from(originalRequest.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);
    originalRequest.headers = headers;

    return apiClient.request(originalRequest);
  },
);
