import axiosInstance from "../api/axiosInstance";

/**
 * Sends login credentials to the backend API.
 * Returns the response payload if the request succeeds.
 */
export async function loginUser(credentials) {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
}
