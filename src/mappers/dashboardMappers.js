/**
 * Returns the initial dashboard stats structure.
 */
export function getInitialDashboardStats() {
  return {
    totalDocuments: 0,

    totalClients: 0,
    activeClients: null,
    inactiveClients: null,

    totalUsers: null,
    activeUsers: null,
    inactiveUsers: null,
  };
}
