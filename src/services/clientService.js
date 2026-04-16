import axiosInstance from "../api/axiosInstance";

/**
 * Gets all clients.
 */
export async function getClients() {
  const response = await axiosInstance.get("/clients");
  return response.data;
}

/**
 * Gets one client by id.
 */
export async function getClientById(clientId) {
  const response = await axiosInstance.get(`/clients/${clientId}`);
  return response.data;
}

/**
 * Searches clients by term.
 */
export async function searchClients(term) {
  const response = await axiosInstance.get("/clients/search", {
    params: { term },
  });

  return response.data;
}

/**
 * Creates a client.
 */
export async function createClient(payload) {
  const response = await axiosInstance.post("/clients", payload);
  return response.data;
}

/**
 * Updates an existing client.
 */
export async function updateClient(clientId, payload) {
  const response = await axiosInstance.put(`/clients/${clientId}`, payload);
  return response.data;
}

/**
 * Deactivates a client.
 */
export async function deactivateClient(clientId) {
  await axiosInstance.patch(`/clients/${clientId}/deactivate`);
}

/**
 * Reactivates a client.
 */
export async function reactivateClient(clientId) {
  await axiosInstance.patch(`/clients/${clientId}/reactivate`);
}
