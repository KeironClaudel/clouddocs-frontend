import axiosInstance from "../api/axiosInstance";

/**
 * Requests a document preview (PDF) as a blob.
 */
export async function previewDocument(documentId, versionId = null) {
  const response = await axiosInstance.get(`/documents/${documentId}/preview`, {
    responseType: "blob",
    params: versionId ? { versionId } : {},
  });

  return response.data;
}

/**
 * Requests a document download as a blob.
 */
export async function downloadDocument(documentId, versionId = null) {
  const response = await axiosInstance.get(
    `/documents/${documentId}/download`,
    {
      responseType: "blob",
      params: versionId ? { versionId } : {},
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

/**
 * Sends a multipart/form-data request to upload a document and its metadata.
 */
export async function uploadDocument(documentData) {
  const formData = new FormData();

  formData.append("file", documentData.file);
  formData.append("originalFileName", documentData.originalFileName);
  formData.append("contentType", documentData.contentType);
  formData.append("fileSize", String(documentData.fileSize));
  formData.append("categoryId", documentData.categoryId);
  formData.append("documentTypeId", String(documentData.documentTypeId));
  formData.append(
    "expirationDatePendingDefinition",
    String(documentData.expirationDatePendingDefinition),
  );
  formData.append("accessLevelId", String(documentData.accessLevelId));

  if (documentData.expirationDate) {
    formData.append("expirationDate", documentData.expirationDate);
  }

  if (documentData.department) {
    formData.append("department", documentData.department);
  }

  const response = await axiosInstance.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

/**
 * Sends a request to rename an existing document.
 */
export async function renameDocument(documentId, newName) {
  const response = await axiosInstance.put(`/documents/${documentId}/rename`, {
    newName,
  });

  return response.data;
}

/**
 * Sends a request to deactivate an existing document.
 */
export async function deactivateDocument(documentId) {
  await axiosInstance.patch(`/documents/${documentId}/deactivate`);
}

/**
 * Sends a request to reactivate an existing document.
 */
export async function reactivateDocument(documentId) {
  await axiosInstance.patch(`/documents/${documentId}/reactivate`);
}

/**
 * Requests a paginated and filtered document list from the backend API.
 */
export async function searchDocuments(params) {
  const response = await axiosInstance.get("/documents", {
    params,
  });

  return response.data;
}

/**
 * Uploads a new version for an existing document.
 */
export async function uploadDocumentVersion(documentId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    `/documents/${documentId}/versions`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}
