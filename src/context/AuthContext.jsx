import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

/**
 * Creates a context to store authentication state globally.
 */
const AuthContext = createContext();

/**
 * Provides authentication state and helpers to the entire app.
 */
export function AuthProvider({ children }) {
  /**
   * Stores the authenticated user.
   */
  const [user, setUser] = useState(null);

  /**
   * Indicates whether the authentication state has been loaded from the server.
   */
  const [isAuthReady, setIsAuthReady] = useState(false);

  /**
   * Loads the user from the server when the app starts.
   * With httpOnly cookies, the server validates the session automatically.
   */
  useEffect(() => {
    async function loadUser() {
      try {
        const response = await axiosInstance.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        // User is not authenticated, session expired, or endpoint doesn't exist yet
        console.log("Auth check failed:", error.message);
        setUser(null);
      } finally {
        setIsAuthReady(true);
      }
    }

    loadUser();
  }, []);

  /**
   * Saves user data in state after successful login.
   * Tokens are managed via httpOnly cookies by the server.
   */
  function login(userData) {
    setUser(userData);
  }

  /**
   * Clears user session from state.
   * Server clears the httpOnly cookie on logout.
   */
  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context easily.
 */
export function useAuth() {
  return useContext(AuthContext);
}
