import { useEffect, useRef, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClipboardList,
  faFolderOpen,
  faRightFromBracket,
  faUser,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  canManageAdminPanels,
  canViewAuditLogs,
  canViewCategories,
  canViewClients,
  canViewDepartments,
  canViewDocumentAccessLevels,
  canViewDocumentTypes,
  canViewUsers,
} from "../utils/permissionUtils";
import { t } from "../i18n";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdmin = canManageAdminPanels(user);
  const canSeeClients = canViewClients(user);
  const canSeeUsers = canViewUsers(user);
  const canSeeAuditLogs = canViewAuditLogs(user);
  const canSeeDocumentAccessLevels = canViewDocumentAccessLevels(user);
  const canSeeCategories = canViewCategories(user);
  const canSeeDepartments = canViewDepartments(user);
  const canSeeDocumentTypes = canViewDocumentTypes(user);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const getNavLinkClass = ({ isActive }) =>
    `relative text-sm transition ${
      isActive
        ? "font-semibold text-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    try {
      if (user?.refreshToken) {
        await logoutUser(user.refreshToken);
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setIsMenuOpen(false);
      logout();
      navigate("/login");
    }
  }

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  const renderNavLink = (to, label) => (
    <NavLink
      to={to}
      onClick={handleCloseMenu}
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

  const renderMenuLink = (to, label, icon) => (
    <NavLink
      to={to}
      onClick={handleCloseMenu}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
          isActive
            ? "bg-blue-50 font-medium text-blue-700"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      <FontAwesomeIcon icon={icon} className="w-4" />
      <span>{label}</span>
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

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-label={t("navbar.buttons.menu")}
                aria-expanded={isMenuOpen}
                className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-gray-700 transition hover:bg-gray-200"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                  <div className="border-b border-gray-100 px-3 py-2">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {user?.fullName || t("navbar.defaultUser")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("navbar.welcome")}
                    </p>
                  </div>

                  <div className="mt-2 space-y-1">
                    {renderMenuLink(
                      "/profile",
                      t("navbar.links.profile"),
                      faUser,
                    )}

                    {canSeeUsers &&
                      renderMenuLink(
                        "/users",
                        t("navbar.links.users"),
                        faUsers,
                      )}

                    {canSeeAuditLogs &&
                      renderMenuLink(
                        "/audit-logs",
                        t("navbar.links.auditLogs"),
                        faClipboardList,
                      )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <FontAwesomeIcon
                        icon={faRightFromBracket}
                        className="w-4"
                      />
                      <span>{t("navbar.buttons.logout")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <p className="truncate text-sm text-gray-500">
              {t("navbar.welcome")}, {user?.fullName || t("navbar.defaultUser")}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {renderNavLink("/dashboard", t("navbar.links.dashboard"))}
            {renderNavLink("/documents", t("navbar.links.documents"))}
            {canSeeClients &&
              renderNavLink("/clients", t("navbar.links.clients"))}
            {canSeeDocumentAccessLevels &&
              renderNavLink(
                "/document-access-levels",
                t("navbar.links.documentAccessLevels"),
              )}
            {canSeeCategories &&
              renderNavLink("/categories", t("navbar.links.categories"))}
            {canSeeDepartments &&
              renderNavLink("/departments", t("navbar.links.departments"))}
            {canSeeDocumentTypes &&
              renderNavLink("/document-types", t("navbar.links.documentTypes"))}
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:grid md:grid-cols-[auto_260px_1fr_auto] md:items-center md:gap-6">
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
            {canSeeClients &&
              renderNavLink("/clients", t("navbar.links.clients"))}
            {canSeeDocumentAccessLevels &&
              renderNavLink(
                "/document-access-levels",
                t("navbar.links.documentAccessLevels"),
              )}
            {canSeeCategories &&
              renderNavLink("/categories", t("navbar.links.categories"))}
            {canSeeDepartments &&
              renderNavLink("/departments", t("navbar.links.departments"))}
            {canSeeDocumentTypes &&
              renderNavLink("/document-types", t("navbar.links.documentTypes"))}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-label={t("navbar.buttons.menu")}
              aria-expanded={isMenuOpen}
              className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-gray-700 transition hover:bg-gray-200"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                <div className="border-b border-gray-100 px-3 py-2">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {user?.fullName || t("navbar.defaultUser")}
                  </p>
                  <p className="text-xs text-gray-500">{t("navbar.welcome")}</p>
                </div>

                <div className="mt-2 space-y-1">
                  {renderMenuLink(
                    "/profile",
                    t("navbar.links.profile"),
                    faUser,
                  )}

                  {canSeeUsers &&
                    renderMenuLink("/users", t("navbar.links.users"), faUsers)}

                  {canSeeAuditLogs &&
                    renderMenuLink(
                      "/audit-logs",
                      t("navbar.links.auditLogs"),
                      faClipboardList,
                    )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="w-4"
                    />
                    <span>{t("navbar.buttons.logout")}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
