import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Restricts access to admin-only pages.
 * Redirects non-admin users to the dashboard.
 */
function AdminRoute({ children }) {
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

  if (!user?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
