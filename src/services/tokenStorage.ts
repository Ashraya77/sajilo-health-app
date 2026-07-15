import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'sajilohealth.accessToken';
const REFRESH_TOKEN_KEY = 'sajilohealth.refreshToken';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthTokenChange = 'authenticated' | 'unauthenticated';

type StoredTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

const listeners = new Set<(change: AuthTokenChange) => void>();

let memoryTokens: StoredTokens = {
  accessToken: null,
  refreshToken: null,
};

function notifyTokenChange(change: AuthTokenChange): void {
  listeners.forEach((listener) => {
    listener(change);
  });
}

export function subscribeToAuthTokenChanges(
  listener: (change: AuthTokenChange) => void,
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

async function canUseSecureStore(): Promise<boolean> {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function getAccessToken(): Promise<string | null> {
  if (memoryTokens.accessToken) {
    return memoryTokens.accessToken;
  }

  if (!(await canUseSecureStore())) {
    return null;
  }

  memoryTokens.accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  return memoryTokens.accessToken;
}

export async function getRefreshToken(): Promise<string | null> {
  if (memoryTokens.refreshToken) {
    return memoryTokens.refreshToken;
  }

  if (!(await canUseSecureStore())) {
    return null;
  }

  memoryTokens.refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  return memoryTokens.refreshToken;
}

export async function getStoredTokens(): Promise<StoredTokens> {
  const [accessToken, refreshToken] = await Promise.all([getAccessToken(), getRefreshToken()]);

  return {
    accessToken,
    refreshToken,
  };
}

export async function saveAuthTokens(tokens: AuthTokens): Promise<void> {
  memoryTokens = tokens;

  if (!(await canUseSecureStore())) {
    notifyTokenChange('authenticated');
    return;
  }

  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ]);
  notifyTokenChange('authenticated');
}

export async function saveAccessToken(accessToken: string): Promise<void> {
  memoryTokens = {
    ...memoryTokens,
    accessToken,
  };

  if (!(await canUseSecureStore())) {
    return;
  }

  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
}

export async function clearAuthTokens(): Promise<void> {
  memoryTokens = {
    accessToken: null,
    refreshToken: null,
  };

  if (!(await canUseSecureStore())) {
    notifyTokenChange('unauthenticated');
    return;
  }

  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
  notifyTokenChange('unauthenticated');
}
