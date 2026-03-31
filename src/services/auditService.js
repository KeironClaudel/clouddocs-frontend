import axiosInstance from "../api/axiosInstance";

/**
 * Requests a paginated and filtered audit log list from the backend API.
 */
export async function getAuditLogs(params = {}) {
  const response = await axiosInstance.get("/audit-logs", {
    params,
  });

  return response.data;
}
