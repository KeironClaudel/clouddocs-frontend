import axiosInstance from "../api/axiosInstance";

/**
 * Requests the user list from the backend API.
 */
export async function getUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getUserById(userId) {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
}

export async function createUser(userData) {
  const response = await axiosInstance.post("/users", userData);
  return response.data;
}

export async function updateUser(userId, userData) {
  const response = await axiosInstance.put(`/users/${userId}`, userData);
  return response.data;
}

export async function deactivateUser(userId) {
  await axiosInstance.patch(`/users/${userId}/deactivate`);
}

export async function reactivateUser(userId) {
  await axiosInstance.patch(`/users/${userId}/reactivate`);
}
