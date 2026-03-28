import { createContext, useContext, useEffect, useState } from "react";

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
   * Indicates whether the authentication state has been loaded from localStorage.
   */
  const [isAuthReady, setIsAuthReady] = useState(false);

  /**
   * Loads the user from localStorage when the app starts.
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    setUser(parsedUser);
    setIsAuthReady(true);
  }, []);

  /**
   * Saves user data in both state and localStorage.
   */
  function login(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }

  /**
   * Clears user session from state and localStorage.
   */
  function logout() {
    localStorage.removeItem("user");
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
