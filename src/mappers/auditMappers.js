/**
 * Builds query params for audit logs request.
 */
export function buildAuditLogsParams({ page, pageSize, filters }) {
  return {
    page,
    pageSize,
    userId: filters.userId || undefined,
    action: filters.action || undefined,
    module: filters.module || undefined,
    date: filters.date || undefined,
  };
}

/**
 * Returns the initial state for audit filters.
 */
export function getInitialAuditFilters() {
  return {
    userId: "",
    action: "",
    module: "",
    date: "",
  };
}
