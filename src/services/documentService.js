import axiosInstance from "../api/axiosInstance";

/**
 * Requests a document preview (PDF) as a blob.
 */
export async function previewDocument(documentId) {
  const response = await axiosInstance.get(`/documents/${documentId}/preview`, {
    responseType: "blob",
  });

  return response.data;
}

/**
 * Requests a document download as a blob.
 */
export async function downloadDocument(documentId) {
  const response = await axiosInstance.get(
    `/documents/${documentId}/download`,
    {
      responseType: "blob",
    },
  );

  return response.data;
}

/**
 * Requests the available versions for a specific document.
 */
export async function getDocumentVersions(documentId) {
  const response = await axiosInstance.get(`/documents/${documentId}/versions`);

  return response.data;
}

/**
 * Requests the document list from the backend API.
 */
export async function getDocuments() {
  const response = await axiosInstance.get("/documents");
  return response.data;
}
