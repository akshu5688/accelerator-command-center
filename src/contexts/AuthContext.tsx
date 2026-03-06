import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "eera_accelerator_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const initAuth = async () => {
      if (isSupabaseConfigured() && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setUser({ email: session.user.email, name: session.user.email.split("@")[0] });
        } else {
          setUser(null);
        }
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user?.email) {
            setUser({ email: session.user.email, name: session.user.email.split("@")[0] });
          } else {
            setUser(null);
          }
        });
        unsubscribe = () => subscription.unsubscribe();
      } else {
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            localStorage.removeItem(AUTH_KEY);
          }
        }
      }
      setIsLoading(false);
    };
    initAuth();
    return () => unsubscribe?.();
  }, []);

  const login = async (email: string, password: string) => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user?.email) {
        setUser({ email: data.user.email, name: data.user.email.split("@")[0] });
      }
    } else {
      const userData: User = { email, name: email.split("@")[0] };
      setUser(userData);
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    }
  };

  const signup = async (email: string, password: string): Promise<{ needsEmailConfirmation: boolean }> => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    }
    // NEVER set user on signup - always send to check-email page.
    // User must confirm (Supabase) or come back and log in (demo mode).
    return { needsEmailConfirmation: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
