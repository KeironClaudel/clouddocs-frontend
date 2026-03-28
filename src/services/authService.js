import axiosInstance from "../api/axiosInstance";

/**
 * Sends login credentials to the backend API.
 * Returns the response payload if the request succeeds.
 */
export async function loginUser(credentials) {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
}

/**
 * Sends the refresh token to obtain a new access token pair.
 */
export async function refreshToken(refreshTokenValue) {
  const response = await axiosInstance.post("/auth/refresh-token", {
    refreshToken: refreshTokenValue,
  });

  return response.data;
}

/**
 * Sends the refresh token to invalidate the current session on logout.
 */
export async function logoutUser(refreshTokenValue) {
  const response = await axiosInstance.post("/auth/logout", {
    refreshToken: refreshTokenValue,
  });

  return response.data;
}
