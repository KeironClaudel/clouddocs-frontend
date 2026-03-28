/**
 * Returns true when the current user has the Admin role.
 */
export function isAdmin(user) {
  return user?.role === "Admin";
}

/**
 * Returns true when the user can manage documents.
 * Adjust this rule if more roles gain access in the future.
 */
export function canManageDocuments(user) {
  return isAdmin(user);
}

/**
 * Returns true when the user can manage users.
 */
export function canManageUsers(user) {
  return isAdmin(user);
}

/**
 * Returns true when the user can manage categories.
 */
export function canManageCategories(user) {
  return isAdmin(user);
}

/**
 * Returns true when the user can view audit logs.
 */
export function canViewAuditLogs(user) {
  return isAdmin(user);
}
