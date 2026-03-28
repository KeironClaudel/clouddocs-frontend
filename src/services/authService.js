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

/**
 * Requests a password reset link for the provided email address.
 */
export async function forgotPassword(email) {
  const response = await axiosInstance.post("/auth/forgot-password", {
    email,
  });

  return response.data;
}

/**
 * Sends a password change request for the authenticated user.
 */
export async function changePassword(passwordData) {
  const response = await axiosInstance.post(
    "/auth/change-password",
    passwordData,
  );
  return response.data;
}
