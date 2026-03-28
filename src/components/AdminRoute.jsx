import { Navigate } from "react-router-dom";

/**
 * Restricts access to admin-only pages.
 * Redirects non-admin users to the dashboard.
 */
function AdminRoute({ children }) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || !user.accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
