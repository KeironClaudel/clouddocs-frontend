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
