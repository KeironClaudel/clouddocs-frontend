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
 * Requests all clients from the backend API.
 */
async function fetchClients() {
  const response = await axiosInstance.get("/clients");
  return response.data;
}

/**
 * Builds dashboard statistics from existing backend endpoints.
 * For non-admin users, user and client status statistics are omitted.
 */
export async function getDashboardStats(isAdmin) {
  const [documentsData, clientsData] = await Promise.all([
    fetchDocuments(),
    fetchClients(),
  ]);

  const documents = Array.isArray(documentsData)
    ? documentsData
    : documentsData.documents || documentsData.items || [];

  const clients = Array.isArray(clientsData)
    ? clientsData
    : clientsData.clients || clientsData.items || [];

  const stats = {
    totalDocuments: documents.length,

    totalClients: clients.length,
    activeClients: null,
    inactiveClients: null,

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

    stats.activeClients = clients.filter((client) => client.isActive).length;
    stats.inactiveClients = clients.filter((client) => !client.isActive).length;
  }

  return stats;
}
