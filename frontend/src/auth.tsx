import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin, signup as apiSignup, AuthTokens, UserProfile } from "./api/client";

interface AuthState {
  token: string | null;
  username: string | null;
}

interface AuthContextProps extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const STORAGE_KEY = "plane-spotter-auth";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthState) : { token: null, username: null };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const login = async (username: string, password: string) => {
    const tokens: AuthTokens = await apiLogin(username, password);
    setAuth({ token: tokens.access_token, username });
  };

  const signup = async (username: string, email: string, password: string) => {
    const user: UserProfile = await apiSignup(username, email, password);
    setAuth({ token: (await apiLogin(user.username, password)).access_token, username: user.username });
  };

  const logout = () => setAuth({ token: null, username: null });

  const value = useMemo(
    () => ({
      token: auth.token,
      username: auth.username,
      login,
      signup,
      logout
    }),
    [auth.token, auth.username]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { AuthProvider, useAuth };
