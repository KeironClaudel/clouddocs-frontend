/**
 * Builds query params for audit logs request.
 */
export function buildAuditLogsParams({ page, pageSize, filters }) {
  const dateRange = buildLocalDayUtcRange(filters.date);

  return {
    page,
    pageSize,
    userId: filters.userId || undefined,
    action: filters.action || undefined,
    module: filters.module || undefined,
    from: dateRange?.from,
    to: dateRange?.to,
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

function buildLocalDayUtcRange(dateValue) {
  if (!dateValue) {
    return null;
  }

  const startOfDayLocal = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(startOfDayLocal.getTime())) {
    return null;
  }

  const startOfNextDayLocal = new Date(startOfDayLocal);
  startOfNextDayLocal.setDate(startOfNextDayLocal.getDate() + 1);

  return {
    from: startOfDayLocal.toISOString(),
    to: startOfNextDayLocal.toISOString(),
  };
}
