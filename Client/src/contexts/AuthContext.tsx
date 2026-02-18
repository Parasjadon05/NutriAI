import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "appwrite";
import { ID } from "appwrite";
import { account } from "@/integrations/appwrite/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: { message: string } }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const u = await account.get();
        setUser(u);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const u = await account.get();
      setUser(u);
      return {};
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Sign in failed";
      return { error: { message: msg } };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await account.create(ID.unique(), email, password, name || undefined);
      await account.createEmailPasswordSession(email, password);
      const u = await account.get();
      setUser(u);
      return {};
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Sign up failed";
      return { error: { message: msg } };
    }
  };

  const signOut = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
