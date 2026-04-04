import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { canManageAdminPanels } from "../utils/permissionUtils";
import { NavLink } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = canManageAdminPanels(user);

  // Helper function to determine the class for active/inactive nav links
  const getNavLinkClass = ({ isActive }) =>
    `text-sm transition relative ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
    }`;

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
    <nav className="w-full border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* LEFT */}
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold text-gray-900"
        >
          <FontAwesomeIcon icon={faFolderOpen} className="text-blue-600" />
          <span>CloudDocs</span>
        </NavLink>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-500 md:block">
            Welcome, {user?.fullName || "User"}
          </span>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${getNavLinkClass({ isActive })} ${
                isActive
                  ? "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-blue-600"
                  : ""
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `${getNavLinkClass({ isActive })} ${
                isActive
                  ? "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-blue-600"
                  : ""
              }`
            }
          >
            Documents
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${getNavLinkClass({ isActive })} ${
                isActive
                  ? "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-blue-600"
                  : ""
              }`
            }
          >
            Profile
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `${getNavLinkClass({ isActive })} ${
                  isActive
                    ? "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-blue-600"
                    : ""
                }`
              }
            >
              Users
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `${getNavLinkClass({ isActive })} ${
                  isActive
                    ? "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-blue-600"
                    : ""
                }`
              }
            >
              Categories
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/document-types"
              className={({ isActive }) =>
                `${getNavLinkClass({ isActive })} ${
                  isActive
                    ? "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-blue-600"
                    : ""
                }`
              }
            >
              Document Types
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/audit-logs"
              className={({ isActive }) =>
                `${getNavLinkClass({ isActive })} ${
                  isActive
                    ? "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-blue-600"
                    : ""
                }`
              }
            >
              Audit Logs
            </NavLink>
          )}

          <button
            className="ml-2 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 transition"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
