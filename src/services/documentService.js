import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Retrieves the authenticated user's access token from localStorage.
 * Returns null if no authenticated user is found.
 */
function getAccessToken() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return user?.accessToken || null;
}

/**
 * Requests a document preview (PDF) as a blob.
 */
export async function previewDocument(documentId) {
  const token = getAccessToken();

  const response = await axios.get(
    `${API_BASE_URL}/documents/${documentId}/preview`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

/**
 * Requests a document download as a blob.
 */
export async function downloadDocument(documentId) {
  const token = getAccessToken();

  const response = await axios.get(
    `${API_BASE_URL}/documents/${documentId}/download`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

/**
 * Requests the document list from the backend API using the stored access token.
 * Returns the response payload from the API.
 */
export async function getDocuments() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Authentication token not found.");
  }

  const response = await axios.get(`${API_BASE_URL}/documents`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}
