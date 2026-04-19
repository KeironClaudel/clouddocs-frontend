/**
 * Returns true when the current user has the Admin role.
 */
export function isAdmin(user) {
  return user?.role === "Admin";
}

/**
 * Returns true when the user can manage admin panels.
 */
export function canManageAdminPanels(user) {
  return isAdmin(user);
}

/**
 * Returns true when the user can view the clients page.
 * Change this to canManageAdminPanels(user) if Clients becomes admin-only again.
 */
export function canViewClients(user) {
  return Boolean(user);
}

/**
 * Returns true when the user can view the users page.
 */
export function canViewUsers(user) {
  return canManageAdminPanels(user);
}

/**
 * Returns true when the user can view the audit logs page.
 */
export function canViewAuditLogs(user) {
  return canManageAdminPanels(user);
}

/**
 * Returns true when the user can view document access levels.
 */
export function canViewDocumentAccessLevels(user) {
  return canManageAdminPanels(user);
}

/**
 * Returns true when the user can view categories.
 */
export function canViewCategories(user) {
  return canManageAdminPanels(user);
}

/**
 * Returns true when the user can view departments.
 */
export function canViewDepartments(user) {
  return canManageAdminPanels(user);
}

/**
 * Returns true when the user can view document types.
 */
export function canViewDocumentTypes(user) {
  return canManageAdminPanels(user);
}
