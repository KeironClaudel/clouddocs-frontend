import axiosInstance from "../api/axiosInstance";

/**
 * Gets all document types.
 */
export async function getDocumentTypes() {
  const response = await axiosInstance.get("/document-types");
  return response.data;
}

/**
 * Gets a document type by id.
 */
export async function getDocumentTypeById(id) {
  const response = await axiosInstance.get(`/document-types/${id}`);
  return response.data;
}

/**
 * Creates a new document type.
 */
export async function createDocumentType(payload) {
  const response = await axiosInstance.post("/document-types", payload);
  return response.data;
}

/**
 * Updates an existing document type.
 */
export async function updateDocumentType(id, payload) {
  const response = await axiosInstance.put(`/document-types/${id}`, payload);
  return response.data;
}

/**
 * Deactivates a document type.
 */
export async function deactivateDocumentType(id) {
  await axiosInstance.patch(`/document-types/${id}/deactivate`);
}

/**
 * Reactivates a document type.
 */
export async function reactivateDocumentType(id) {
  await axiosInstance.patch(`/document-types/${id}/reactivate`);
}
