import { router, useSegments } from 'expo-router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  clearAuthTokens,
  getStoredTokens,
  subscribeToAuthTokenChanges,
} from '@/services/tokenStorage';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthSessionContextValue = {
  status: AuthStatus;
  isAuthenticated: boolean;
  markAuthenticated: () => void;
  logout: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: PropsWithChildren) {
  const segments = useSegments();
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const tokens = await getStoredTokens();

      if (!isMounted) {
        return;
      }

      setStatus(tokens.accessToken || tokens.refreshToken ? 'authenticated' : 'unauthenticated');
    }

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(
    () =>
      subscribeToAuthTokenChanges((change) => {
        setStatus(change);
      }),
    [],
  );

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    const currentRoute = segments[0];
    const isLoginRoute = currentRoute === 'login';

    if (status === 'unauthenticated' && !isLoginRoute) {
      router.replace('/login');
      return;
    }

    if (status === 'authenticated' && isLoginRoute) {
      router.replace('/');
    }
  }, [segments, status]);

  const markAuthenticated = useCallback(() => {
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    await clearAuthTokens();
    setStatus('unauthenticated');
    router.replace('/login');
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      status,
      isAuthenticated: status === 'authenticated',
      markAuthenticated,
      logout,
    }),
    [logout, markAuthenticated, status],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession(): AuthSessionContextValue {
  const value = useContext(AuthSessionContext);

  if (!value) {
    throw new Error('useAuthSession must be used within AuthSessionProvider.');
  }

  return value;
}
