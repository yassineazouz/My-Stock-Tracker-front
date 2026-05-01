import { ReactNode, useMemo, useState } from 'react';
import {
  clearStoredUser,
  getStoredUser,
  login as loginRequest,
  signup as signupRequest,
  storeUser,
} from '@/lib/api';
import { AuthUser } from '@/types/Auth';
import { AuthContext, AuthContextValue } from '@/hooks/auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (request) => {
        const authenticatedUser = await loginRequest(request);
        storeUser(authenticatedUser);
        setUser(authenticatedUser);
      },
      signup: async (request) => {
        const authenticatedUser = await signupRequest(request);
        storeUser(authenticatedUser);
        setUser(authenticatedUser);
      },
      logout: () => {
        clearStoredUser();
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
