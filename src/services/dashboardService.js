import axiosInstance from "../api/axiosInstance";

/**
 * Requests all documents from the backend API.
 */
async function fetchDocuments() {
  const response = await axiosInstance.get("/documents");
  return response.data;
}

/**
 * Requests all users from the backend API.
 */
async function fetchUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

/**
 * Builds dashboard statistics from existing backend endpoints.
 * For non-admin users, user statistics are omitted.
 */
export async function getDashboardStats(isAdmin) {
  const documentsData = await fetchDocuments();

  const documents = Array.isArray(documentsData)
    ? documentsData
    : documentsData.documents || documentsData.items || [];

  const stats = {
    totalDocuments: documents.length,
    totalUsers: null,
    activeUsers: null,
    inactiveUsers: null,
  };

  if (isAdmin) {
    const usersData = await fetchUsers();

    const users = Array.isArray(usersData)
      ? usersData
      : usersData.users || usersData.items || [];

    stats.totalUsers = users.length;
    stats.activeUsers = users.filter((user) => user.isActive).length;
    stats.inactiveUsers = users.filter((user) => !user.isActive).length;
  }

  return stats;
}
