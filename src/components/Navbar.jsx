import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /**
   * Invalidates the current session in the backend and clears local storage.
   */
  async function handleLogout() {
    try {
      if (user?.refreshToken) {
        await logoutUser(user.refreshToken);
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      logout();
      navigate("/login");
    }
  }

  return (
    <nav
      className="navbar is-dark"
      role="navigation"
      aria-label="main navigation"
    >
      {/* LEFT SIDE */}
      <div className="navbar-brand">
        <Link to="/dashboard" className="navbar-item has-text-weight-bold">
          <span className="icon mr-2">
            <FontAwesomeIcon icon={faFolderOpen} />
          </span>
          <span>CloudDocs</span>
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-menu is-active">
        <div className="navbar-end">
          <div className="navbar-item has-text-grey-light">
            Welcome, {user?.fullName || "User"}
          </div>

          <Link to="/dashboard" className="navbar-item">
            Dashboard
          </Link>

          <Link to="/documents" className="navbar-item">
            Documents
          </Link>

          <Link to="/profile" className="navbar-item">
            Profile
          </Link>

          {user?.role === "Admin" && (
            <Link to="/users" className="navbar-item">
              Users
            </Link>
          )}

          <div className="navbar-item">
            <button className="button is-light" onClick={handleLogout}>
              <span className="icon">
                <FontAwesomeIcon icon={faRightFromBracket} />
              </span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
