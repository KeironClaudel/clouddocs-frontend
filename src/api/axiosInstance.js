import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Creates a reusable Axios instance with base configuration.
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Attaches the current access token to every outgoing request when available.
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
 * Handles unauthorized responses by attempting a token refresh once.
 * If refresh succeeds, retries the original request with the new token.
 * If refresh fails, clears the session and redirects to login.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    /**
     * Ignore refresh handling if there is no response or no request config.
     */
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    /**
     * Prevent infinite retry loops by skipping requests already retried.
     */
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user?.refreshToken) {
          throw new Error("Refresh token not found.");
        }

        /**
         * Uses the base axios client instead of axiosInstance
         * to avoid interceptor recursion during token refresh.
         */
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {
            refreshToken: user.refreshToken,
          },
        );

        const refreshData = refreshResponse.data;

        /**
         * Updates the stored session with the new token pair
         * while preserving the user profile data already available.
         */
        const updatedUser = {
          ...user,
          accessToken: refreshData.accessToken,
          refreshToken: refreshData.refreshToken,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        /**
         * Updates the failed request with the new access token
         * and retries it once.
         */
        originalRequest.headers.Authorization = `Bearer ${refreshData.accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
