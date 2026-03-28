import { useEffect, useState } from "react";
import axios from "axios";
import {
  createCategory,
  deactivateCategory,
  getCategories,
  updateCategory,
  reactivateCategory,
} from "../services/categoryService";

function CategoriesPage() {
  /**
   * Stores the category list returned by the API.
   */
  const [categories, setCategories] = useState([]);

  /**
   * Indicates whether the category request is currently running.
   */
  const [loading, setLoading] = useState(true);

  /**
   * Stores a page-level error message.
   */
  const [error, setError] = useState("");

  /**
   * Stores a success/info message after category actions.
   */
  const [actionMessage, setActionMessage] = useState("");

  /**
   * Controls whether the create category form is visible.
   */
  const [showCreateForm, setShowCreateForm] = useState(false);

  /**
   * Controls whether the edit category form is visible.
   */
  const [showEditForm, setShowEditForm] = useState(false);

  /**
   * Tracks whether the create request is currently in progress.
   */
  const [creatingCategory, setCreatingCategory] = useState(false);

  /**
   * Tracks whether the update request is currently in progress.
   */
  const [updatingCategory, setUpdatingCategory] = useState(false);

  /**
   * Tracks which category is currently being deactivated.
   */
  const [deactivatingCategoryId, setDeactivatingCategoryId] = useState(null);

  /**
   * Tracks which category is currently being activated.
   */
  const [reactivatingCategoryId, setReactivatingCategoryId] = useState(null);

  /**
   * Stores the ID of the category currently being edited.
   */
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  /**
   * Stores the create form values.
   */
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
  });

  /**
   * Stores the edit form values.
   */
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });

  /**
   * Loads the category list when the page is rendered for the first time.
   */
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();

        const normalizedCategories = Array.isArray(data)
          ? data
          : data.categories || data.items || [];

        setCategories(normalizedCategories);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load categories.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  /**
   * Updates the create form state when an input changes.
   */
  function handleCreateFormChange(event) {
    const { name, value } = event.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /**
   * Updates the edit form state when an input changes.
   */
  function handleEditFormChange(event) {
    const { name, value } = event.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /**
   * Resets the create form to its initial state.
   */
  function resetCreateForm() {
    setCreateForm({
      name: "",
      description: "",
    });
    setShowCreateForm(false);
  }

  /**
   * Resets the edit form to its initial state.
   */
  function resetEditForm() {
    setEditForm({
      name: "",
      description: "",
    });
    setEditingCategoryId(null);
    setShowEditForm(false);
  }

  /**
   * Adds a newly created category to local state.
   */
  function addCategoryToState(category) {
    setCategories((prev) => [category, ...prev]);
  }

  /**
   * Updates an existing category in local state.
   */
  function updateCategoryInState(updatedCategory) {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category,
      ),
    );
  }

  /**
   * Marks a category as inactive in local state.
   */
  function deactivateCategoryInState(categoryId) {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, isActive: false }
          : category,
      ),
    );
  }

  /**
   * Handles the create category form submission.
   */
  async function handleCreateCategory(event) {
    event.preventDefault();

    setActionMessage("");
    setCreatingCategory(true);

    try {
      const payload = {
        name: createForm.name,
        description: createForm.description || null,
      };

      const createdCategory = await createCategory(payload);

      if (createdCategory?.id) {
        addCategoryToState(createdCategory);
      }

      setActionMessage("Category created successfully.");
      resetCreateForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          err.response?.data?.message || "Failed to create category.",
        );
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setCreatingCategory(false);
    }
  }

  /**
   * Opens the edit form with the selected category values.
   */
  function handleOpenEditForm(category) {
    setActionMessage("");
    setEditingCategoryId(category.id);
    setEditForm({
      name: category.name || "",
      description: category.description || "",
    });
    setShowEditForm(true);
  }

  /**
   * Handles the update category form submission.
   */
  async function handleUpdateCategory(event) {
    event.preventDefault();

    if (!editingCategoryId) {
      return;
    }

    setActionMessage("");
    setUpdatingCategory(true);

    try {
      const payload = {
        name: editForm.name,
        description: editForm.description || null,
      };

      const updatedCategory = await updateCategory(editingCategoryId, payload);

      if (updatedCategory?.id) {
        updateCategoryInState(updatedCategory);
      } else {
        updateCategoryInState({
          id: editingCategoryId,
          name: editForm.name,
          description: editForm.description || null,
          isActive: true,
          createdAt: new Date().toISOString(),
        });
      }

      setActionMessage("Category updated successfully.");
      resetEditForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          err.response?.data?.message || "Failed to update category.",
        );
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setUpdatingCategory(false);
    }
  }

  /**
   * Handles category deactivation.
   */
  async function handleDeactivateCategory(categoryId) {
    setActionMessage("");
    setDeactivatingCategoryId(categoryId);

    try {
      await deactivateCategory(categoryId);
      deactivateCategoryInState(categoryId);
      setActionMessage("Category deactivated successfully.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          err.response?.data?.message || "Failed to deactivate category.",
        );
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setDeactivatingCategoryId(null);
    }
  }

  /**
   * Handles category reactivation.
   */
  async function handleReactivateCategory(categoryId) {
    setActionMessage("");
    setReactivatingCategoryId(categoryId);

    try {
      await reactivateCategory(categoryId);

      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? { ...category, isActive: true }
            : category,
        ),
      );

      setActionMessage("Category reactivated successfully.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          err.response?.data?.message || "Failed to reactivate category.",
        );
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setReactivatingCategoryId(null);
    }
  }

  return (
    <section className="section app-section">
      <div className="container">
        <div className="mb-5">
          <h1 className="title is-2">Categories</h1>
          <p className="subtitle is-6">
            Manage document categories for organization and filtering.
          </p>

          <div className="mb-4">
            <button
              className="button is-primary"
              onClick={() => setShowCreateForm((prev) => !prev)}
            >
              {showCreateForm ? "Cancel" : "Create Category"}
            </button>
          </div>
        </div>

        {actionMessage && (
          <article className="message is-info">
            <div className="message-body">{actionMessage}</div>
          </article>
        )}

        {showCreateForm && (
          <div className="box">
            <h2 className="title is-5">Create Category</h2>

            <form onSubmit={handleCreateCategory}>
              <div className="columns is-multiline">
                <div className="column is-6">
                  <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name="name"
                        value={createForm.name}
                        onChange={handleCreateFormChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="column is-6">
                  <div className="field">
                    <label className="label">Description</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name="description"
                        value={createForm.description}
                        onChange={handleCreateFormChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="field is-grouped mt-4">
                <div className="control">
                  <button
                    type="submit"
                    className="button is-primary"
                    disabled={creatingCategory}
                  >
                    {creatingCategory ? "Creating..." : "Create"}
                  </button>
                </div>

                <div className="control">
                  <button
                    type="button"
                    className="button is-light"
                    onClick={resetCreateForm}
                    disabled={creatingCategory}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {showEditForm && (
          <div className="box">
            <h2 className="title is-5">Edit Category</h2>

            <form onSubmit={handleUpdateCategory}>
              <div className="columns is-multiline">
                <div className="column is-6">
                  <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="column is-6">
                  <div className="field">
                    <label className="label">Description</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name="description"
                        value={editForm.description}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="field is-grouped mt-4">
                <div className="control">
                  <button
                    type="submit"
                    className="button is-link"
                    disabled={updatingCategory}
                  >
                    {updatingCategory ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                <div className="control">
                  <button
                    type="button"
                    className="button is-light"
                    onClick={resetEditForm}
                    disabled={updatingCategory}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <article className="message is-info">
            <div className="message-body">Loading categories...</div>
          </article>
        )}

        {!loading && error && (
          <article className="message is-danger">
            <div className="message-body">{error}</div>
          </article>
        )}

        {!loading && !error && (
          <div className="box">
            {categories.length === 0 ? (
              <p>No categories found.</p>
            ) : (
              <div className="table-container">
                <table className="table is-fullwidth is-hoverable is-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.name}</td>
                        <td>{category.description || "N/A"}</td>
                        <td>
                          {category.isActive ? (
                            <span className="tag is-success is-light">
                              Active
                            </span>
                          ) : (
                            <span className="tag is-danger is-light">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td>
                          {new Date(category.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="buttons are-small">
                            <button
                              className="button is-link is-light"
                              onClick={() => handleOpenEditForm(category)}
                              disabled={!category.isActive}
                            >
                              Edit
                            </button>

                            {category.isActive ? (
                              <button
                                className="button is-warning is-light"
                                onClick={() =>
                                  handleDeactivateCategory(category.id)
                                }
                                disabled={
                                  deactivatingCategoryId === category.id
                                }
                              >
                                {deactivatingCategoryId === category.id
                                  ? "Processing..."
                                  : "Deactivate"}
                              </button>
                            ) : (
                              <button
                                className="button is-success is-light"
                                onClick={() =>
                                  handleReactivateCategory(category.id)
                                }
                                disabled={
                                  reactivatingCategoryId === category.id
                                }
                              >
                                {reactivatingCategoryId === category.id
                                  ? "Processing..."
                                  : "Reactivate"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default CategoriesPage;
