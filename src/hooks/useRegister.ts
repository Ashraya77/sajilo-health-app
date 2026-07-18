import { useCallback, useState } from 'react';

import {
  registerPatient,
  type RegisterPatientRequest,
  type RegisterPatientResponse,
} from '@/services/authService';

type UseRegisterResult = {
  error: string | null;
  loading: boolean;
  register: (input: RegisterPatientRequest) => Promise<RegisterPatientResponse>;
};

export function useRegister(): UseRegisterResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (input: RegisterPatientRequest) => {
    const validationMessage = validateRegistration(input);

    if (validationMessage) {
      setError(validationMessage);
      throw new Error(validationMessage);
    }

    setLoading(true);
    setError(null);

    try {
      return await registerPatient({
        username: input.username.trim(),
        email: input.email.trim().toLocaleLowerCase(),
        phone: input.phone.trim(),
        password: input.password,
        full_name: input.full_name.trim(),
      });
    } catch (registrationError: unknown) {
      setError(getRegistrationErrorMessage(registrationError));
      throw registrationError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { error, loading, register };
}

export function validateRegistration(input: RegisterPatientRequest): string | null {
  if (!input.full_name.trim()) return 'Enter your full name.';
  if (!input.username.trim()) return 'Enter a username.';
  if (!input.email.trim()) return 'Enter your email address.';
  if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) return 'Enter a valid email address.';
  if (!input.phone.trim()) return 'Enter your phone number.';
  if (!input.password) return 'Enter a password.';
  if (input.password.length < 6) return 'Password must be at least 6 characters.';
  return null;
}

function getRegistrationErrorMessage(error: unknown): string {
  if (isRecord(error) && isRecord(error.response)) {
    const responseMessage = findFirstErrorMessage(error.response.data);
    if (responseMessage) return responseMessage;
  }

  if (error instanceof Error && error.message.trim()) return error.message;
  return 'Unable to create your account. Please try again.';
}

function findFirstErrorMessage(value: unknown, depth = 0): string | null {
  if (depth > 3) return null;
  if (typeof value === 'string' && value.trim()) return value;

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = findFirstErrorMessage(item, depth + 1);
      if (message) return message;
    }
    return null;
  }

  if (!isRecord(value)) return null;

  for (const [key, item] of Object.entries(value)) {
    if (key === 'success' || key === 'meta') continue;
    const message = findFirstErrorMessage(item, depth + 1);
    if (message) return message;
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
