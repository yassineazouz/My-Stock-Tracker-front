import { createContext, useContext } from 'react';
import { AuthUser, LoginRequest, SignupRequest } from '@/types/Auth';

export type AuthContextValue = {
  user: AuthUser | null;
  login: (request: LoginRequest) => Promise<void>;
  signup: (request: SignupRequest) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
