import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Prevents access to protected pages when no authenticated user exists.
 * If no user is found in localStorage, redirects to the login page.
 */

function ProtectedRoute({ children }) {
  const { user, isAuthReady } = useAuth();

  /**
   * Waits until authentication state is loaded from localStorage.
   */
  if (!isAuthReady) {
    return (
      <section className="section">
        <div className="container">
          <p>Loading session...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
