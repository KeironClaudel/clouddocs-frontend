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
 * Requests a new access token pair using the httpOnly refresh cookie.
 */
export async function refreshToken() {
  const response = await axiosInstance.post("/auth/refresh-token", {});

  return response.data;
}

/**
 * Invalidates the current session using the httpOnly refresh cookie.
 */
export async function logoutUser() {
  const response = await axiosInstance.post("/auth/logout", {});

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

/**
 * Sends a password reset request using the token provided in the reset link.
 */
export async function resetPassword(resetData) {
  const response = await axiosInstance.post("/auth/reset-password", resetData);
  return response.data;
}
