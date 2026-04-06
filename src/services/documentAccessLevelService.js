import axiosInstance from "../api/axiosInstance";

/**
 * Gets all document access levels.
 */
export async function getDocumentAccessLevels() {
  const response = await axiosInstance.get("/access-levels");
  return response.data;
}

/**
 * Gets a document access level by id.
 */
export async function getDocumentAccessLevelById(id) {
  const response = await axiosInstance.get(`/access-levels/${id}`);
  return response.data;
}

/**
 * Updates an existing document access level.
 */
export async function updateDocumentAccessLevel(id, payload) {
  const response = await axiosInstance.put(`/access-levels/${id}`, payload);
  return response.data;
}

/**
 * Deactivates a document access level.
 */
export async function deactivateDocumentAccessLevel(id) {
  await axiosInstance.patch(`/access-levels/${id}/deactivate`);
}

/**
 * Reactivates a document access level.
 */
export async function reactivateDocumentAccessLevel(id) {
  await axiosInstance.patch(`/access-levels/${id}/reactivate`);
}
