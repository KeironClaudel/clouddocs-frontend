import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Restricts access to admin-only pages.
 * Redirects non-admin users to the dashboard.
 */
function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
