import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REFRESH_ENDPOINT = "/auth/refresh-token";

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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest?.url?.includes(REFRESH_ENDPOINT);

    if (isUnauthorized && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${API_BASE_URL}${REFRESH_ENDPOINT}`,
          {},
          { withCredentials: true },
        );

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    if (isUnauthorized && !window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
