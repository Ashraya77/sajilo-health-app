import { useCallback, useState } from 'react';

import {
  login as loginWithCredentials,
  type LoginResponse,
} from '@/services/authService';

type UseLoginResult = {
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<LoginResponse>;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getErrorMessage(error: unknown): string {
  if (isObject(error) && isObject(error.response)) {
    const data = error.response.data;

    if (isObject(data)) {
      const message = data.message ?? data.detail ?? data.error;

      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }

      const nonFieldErrors = data.non_field_errors;

      if (Array.isArray(nonFieldErrors) && typeof nonFieldErrors[0] === 'string') {
        return nonFieldErrors[0];
      }
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Unable to log in. Please try again.';
}

export function useLogin(): UseLoginResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      return await loginWithCredentials(username, password);
    } catch (loginError: unknown) {
      setError(getErrorMessage(loginError));
      throw loginError;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    login,
  };
}
