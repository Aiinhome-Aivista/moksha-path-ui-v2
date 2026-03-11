import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Role, RoleConfig } from "../../config/roles";
import { getRoleConfig } from "../../config/roles";
import ApiServices from "../../services/ApiServices";
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: Role | null;
  roleConfig: RoleConfig | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial auth check - returns student role
  useEffect(() => {
    const initAuth = async () => {
      // Check localStorage for existing session
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // console.error("Failed to parse user from localStorage", error);
          localStorage.removeItem("user");
        }
      } else {
        // Simulate API call delay for first load if needed, or just finish loading
        await new Promise((resolve) => setTimeout(resolve, 500));
        // setUser(null); // Already null by default
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("page_access");
    localStorage.removeItem("active_profile");
    localStorage.removeItem("selected_subjects_payload");
    localStorage.removeItem("user_academic_details");
    localStorage.removeItem("academic_payload");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("subscription_id");
    localStorage.removeItem("subscription_token");
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem("auth_token");

      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        const exp = payload.exp * 1000;

        if (Date.now() >= exp) {
          try {
            // ✅ same as confirmLogout
            await ApiServices.signOut();
          } catch (error) {
            // console.error("Auto signout API failed", error);
          } finally {
            logout();

            window.location.href = "/";
          }
        }
      } catch (error) {
        logout();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const role = user?.role || null;
  const roleConfig = role ? getRoleConfig(role) : null;

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    role,
    roleConfig,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthProvider;
