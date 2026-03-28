import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Creates a reusable Axios instance with base configuration.
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Request interceptor:
 * Automatically attaches the JWT token to every request.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor:
 * Handles global errors (e.g., 401 Unauthorized).
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
