import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getMe, login as loginApi } from '../api/auth';
import type { User } from '../types';

const GUEST_FLAG = 'devcollect-guest';

interface AuthContextValue {
  user: User | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  canWrite: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsGuest(localStorage.getItem(GUEST_FLAG) === '1');
      setLoading(false);
      return;
    }

    getMe()
      .then(({ user }) => {
        setUser(user);
        setIsGuest(false);
        localStorage.removeItem(GUEST_FLAG);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await loginApi(email, password);
    localStorage.setItem('token', token);
    localStorage.removeItem(GUEST_FLAG);
    setUser(user);
    setIsGuest(false);
  }, []);

  const loginAsGuest = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.setItem(GUEST_FLAG, '1');
    setUser(null);
    setIsGuest(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem(GUEST_FLAG);
    setUser(null);
    setIsGuest(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isGuest,
      isAuthenticated: !!user || isGuest,
      canWrite: !!user,
      loading,
      login,
      loginAsGuest,
      logout,
    }),
    [user, isGuest, loading, login, loginAsGuest, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
