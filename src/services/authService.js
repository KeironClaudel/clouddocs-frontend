import axios from "axios";

/**
 * Read the API Base URL from environment variables.
 * Vite exposes env variables under import.meta.env.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Sends login credentials to the backend API.
 * Returns the response payload if the request succeeds.
 */
export async function loginUser(credentials) {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
