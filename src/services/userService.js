import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Retrieves the authenticated user's access token from localStorage.
 */
function getAccessToken() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return user?.accessToken || null;
}

/**
 * Requests the user list from the backend API.
 */
export async function getUsers() {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await axios.get(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
