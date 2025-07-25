
type AuthStorage = {
  token: string;
};

const storageKey = 'auth-storage';

export function getAuthStorage(): AuthStorage | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(storageKey);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return parsed?.state || null;
  } catch (error) {
    return null;
  }
}
