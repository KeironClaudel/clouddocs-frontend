import { useNavigate, NavLink } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { canManageAdminPanels } from "../utils/permissionUtils";
import { t } from "../i18n";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = canManageAdminPanels(user);

  const getNavLinkClass = ({ isActive }) =>
    `relative text-sm transition ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
    }`;

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

  const renderNavLink = (to, label) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${getNavLinkClass({ isActive })} ${
          isActive
            ? "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-blue-600"
            : ""
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <nav className="w-full border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto max-w-9xl">
        {/* MOBILE */}
        <div className="md:hidden">
          <div className="flex items-center justify-between gap-3">
            <NavLink
              to="/dashboard"
              className="flex min-w-0 items-center gap-2 text-lg font-semibold text-gray-900"
            >
              <FontAwesomeIcon
                icon={faFolderOpen}
                className="shrink-0 text-blue-600"
              />
              <span className="truncate">CloudDocs</span>
            </NavLink>

            <button
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-200"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>{t("navbar.buttons.logout")}</span>
            </button>
          </div>

          <div className="mt-3">
            <p className="truncate text-sm text-gray-500">
              {t("navbar.welcome")}, {user?.fullName || t("navbar.defaultUser")}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {renderNavLink("/dashboard", t("navbar.links.dashboard"))}
            {renderNavLink("/documents", t("navbar.links.documents"))}
            {renderNavLink("/profile", t("navbar.links.profile"))}

            {isAdmin && renderNavLink("/users", t("navbar.links.users"))}
            {isAdmin &&
              renderNavLink(
                "/document-access-levels",
                t("navbar.links.documentAccessLevels"),
              )}
            {isAdmin &&
              renderNavLink("/categories", t("navbar.links.categories"))}
            {isAdmin &&
              renderNavLink("/departments", t("navbar.links.departments"))}
            {isAdmin &&
              renderNavLink("/document-types", t("navbar.links.documentTypes"))}
            {isAdmin &&
              renderNavLink("/audit-logs", t("navbar.links.auditLogs"))}
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:grid md:grid-cols-[auto_260px_1fr] md:items-center md:gap-6">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold text-gray-900"
          >
            <FontAwesomeIcon icon={faFolderOpen} className="text-blue-600" />
            <span>CloudDocs</span>
          </NavLink>

          <div className="flex justify-center">
            <span className="truncate whitespace-nowrap text-sm text-gray-500">
              {t("navbar.welcome")}, {user?.fullName || t("navbar.defaultUser")}
            </span>
          </div>

          <div className="flex items-center justify-end gap-4">
            {renderNavLink("/dashboard", t("navbar.links.dashboard"))}
            {renderNavLink("/documents", t("navbar.links.documents"))}
            {renderNavLink("/profile", t("navbar.links.profile"))}

            {isAdmin && renderNavLink("/users", t("navbar.links.users"))}
            {isAdmin &&
              renderNavLink(
                "/document-access-levels",
                t("navbar.links.documentAccessLevels"),
              )}
            {isAdmin &&
              renderNavLink("/categories", t("navbar.links.categories"))}
            {isAdmin &&
              renderNavLink("/departments", t("navbar.links.departments"))}
            {isAdmin &&
              renderNavLink("/document-types", t("navbar.links.documentTypes"))}
            {isAdmin &&
              renderNavLink("/audit-logs", t("navbar.links.auditLogs"))}

            <button
              className="ml-2 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-200"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>{t("navbar.buttons.logout")}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
