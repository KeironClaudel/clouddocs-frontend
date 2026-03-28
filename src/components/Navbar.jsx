import { Link, useNavigate } from "react-router-dom";

/**
 * Displays the main navigation bar for authenticated pages.
 * Provides navigation links and a logout action.
 */

/**
 * Retrieves userData from localstorage for further usage.
 */
const userData = JSON.parse(localStorage.getItem("user") || "{}");

function Navbar() {
  const navigate = useNavigate();

  /**
   * Clears the persisted authenticated user and redirects to the login page.
   */
  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <nav
      className="navbar is-dark"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <div className="navbar-item has-text-weight-bold is-size-4">
          CloudDocs
        </div>
      </div>

      <div className="navbar-menu is-active">
        <div className="navbar-end">
          <div className="navbar-item">Welcome, {user?.fullName || "User"}</div>

          <Link to="/dashboard" className="navbar-item">
            Dashboard
          </Link>

          <Link to="/documents" className="navbar-item">
            Documents
          </Link>

          <div className="navbar-item">
            <button className="button is-primary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
