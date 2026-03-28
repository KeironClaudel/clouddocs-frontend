import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Prevents access to protected pages when no authenticated user exists.
 * If no user is found in localStorage, redirects to the login page.
 */

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  /**
   * If there is no authenticated user, redirect to /login
   */
  if (!user?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  /**
   * If authentication exists, render the protected content.
   */
  return children;
}

export default ProtectedRoute;
