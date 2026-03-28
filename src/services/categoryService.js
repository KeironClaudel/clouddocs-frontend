import axiosInstance from "../api/axiosInstance";

/**
 * Requests the category list from the backend API.
 */
export async function getCategories() {
  const response = await axiosInstance.get("/categories");
  return response.data;
}

/**
 * Sends a request to create a new category.
 */
export async function createCategory(categoryData) {
  const response = await axiosInstance.post("/categories", categoryData);
  return response.data;
}

/**
 * Sends a request to update an existing category.
 */
export async function updateCategory(categoryId, categoryData) {
  const response = await axiosInstance.put(
    `/categories/${categoryId}`,
    categoryData,
  );

  return response.data;
}

/**
 * Sends a request to deactivate an existing category.
 */
export async function deactivateCategory(categoryId) {
  await axiosInstance.patch(`/categories/${categoryId}/deactivate`);
}

/**
 * Sends a request to reactivate an existing category.
 */
export async function reactivateCategory(categoryId) {
  await axiosInstance.patch(`/categories/${categoryId}/reactivate`);
}
