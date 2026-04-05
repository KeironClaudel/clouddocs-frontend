import axiosInstance from "../api/axiosInstance";

/**
 * Gets all departments.
 */
export async function getDepartments() {
  const response = await axiosInstance.get("/departments");
  return response.data;
}

/**
 * Gets one department by id.
 */
export async function getDepartmentById(id) {
  const response = await axiosInstance.get(`/departments/${id}`);
  return response.data;
}

/**
 * Creates a department.
 */
export async function createDepartment(payload) {
  const response = await axiosInstance.post("/departments", payload);
  return response.data;
}

/**
 * Updates a department.
 */
export async function updateDepartment(id, payload) {
  const response = await axiosInstance.put(`/departments/${id}`, payload);
  return response.data;
}

/**
 * Deactivates a department.
 */
export async function deactivateDepartment(id) {
  await axiosInstance.patch(`/departments/${id}/deactivate`);
}

/**
 * Reactivates a department.
 */
export async function reactivateDepartment(id) {
  await axiosInstance.patch(`/departments/${id}/reactivate`);
}
