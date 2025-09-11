import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "@/lib/appwrite";
import type { Models } from "appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isOAuthCallback: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isOAuthCallback, setIsOAuthCallback] = useState(false);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthCallback = async () => {
    try {
      setLoading(true);
      setIsOAuthCallback(true);
      await authService.checkAuth();
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("OAuth callback error:", error);
      await checkAuth();
    } finally {
      setLoading(false);
      setIsOAuthCallback(false);
    }
  };

  const login = async () => {
    try {
      await authService.loginWithGitHub();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hasOAuthParams = urlParams.get("userId") && urlParams.get("secret");

      if (hasOAuthParams) {
        await handleOAuthCallback();
      } else {
        await checkAuth();
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const handleURLChange = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("userId") && urlParams.get("secret")) {
        await handleOAuthCallback();
      }
    };

    window.addEventListener("popstate", handleURLChange);
    return () => window.removeEventListener("popstate", handleURLChange);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isOAuthCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
