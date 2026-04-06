import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Creates a reusable Axios instance with base configuration.
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Note: Access token is now handled via httpOnly cookies.
 * No need to manually attach it to requests.
 */
// Token interceptor removed - httpOnly cookies are sent automatically

/**
 * Handles unauthorized responses.
 * With httpOnly cookies, token refresh is handled server-side.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    /**
     * If we get a 401, it means the session has expired.
     * Only redirect if not already on the login page to avoid infinite loops.
     */
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
