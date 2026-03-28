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

/**
 * Sends a request to deactivate a user account.
 */
export async function deactivateUser(userId) {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  await axios.patch(
    `${API_BASE_URL}/users/${userId}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

/**
 * Sends a request to reactivate a user account.
 */
export async function reactivateUser(userId) {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  await axios.patch(
    `${API_BASE_URL}/users/${userId}/reactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

/**
 * Sends a request to create a new user.
 */
export async function createUser(userData) {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await axios.post(`${API_BASE_URL}/users`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

/**
 * Requests a single user's details by ID.
 */
export async function getUserById(userId) {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

/**
 * Sends a request to update an existing user.
 */
export async function updateUser(userId, userData) {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await axios.put(
    `${API_BASE_URL}/users/${userId}`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
}
