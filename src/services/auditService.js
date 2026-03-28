import axiosInstance from "../api/axiosInstance";

/**
 * Requests the audit log list from the backend API.
 */
export async function getAuditLogs() {
  const response = await axiosInstance.get("/audit-logs");
  return response.data;
}
