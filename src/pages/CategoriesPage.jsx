import { useEffect, useState } from "react";
import axios from "axios";
import {
  createCategory,
  deactivateCategory,
  getCategories,
  updateCategory,
  reactivateCategory,
} from "../services/categoryService";
import { formatLocalDateForDisplay } from "../utils/dateUtils";
import { getApiErrorMessage } from "../utils/errorUtils";
import DataTable from "../components/DataTable";
import { t } from "../i18n";

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
   * Defines the columns to display in the category table, along with their labels.
   * The "actions" column is used to render buttons for editing, deactivating, or reactivating categories.
   */
  const categoryTableColumns = [
    { key: "name", label: t("categories.table.name") },
    { key: "description", label: t("categories.table.description") },
    { key: "status", label: t("categories.table.status") },
    { key: "createdAt", label: t("categories.table.created") },
    { key: "actions", label: t("categories.table.actions") },
  ];

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
          setError(
            setError(
              getApiErrorMessage(err, t("categories.messages.loadError")),
            ),
          );
        } else {
          setError(t("categories.messages.unexpected"));
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

      setActionMessage(t("categories.messages.created"));
      resetCreateForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("categories.messages.createError")),
        );
      } else {
        setActionMessage(t("categories.messages.unexpected"));
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
          createdAt: formatLocalDateForDisplay(category.createdAt),
        });
      }

      setActionMessage(t("categories.messages.updated"));
      resetEditForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("categories.messages.updateError")),
        );
      } else {
        setActionMessage(t("categories.messages.unexpected"));
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
      setActionMessage(t("categories.messages.deactivated"));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("categories.messages.deactivateError")),
        );
      } else {
        setActionMessage(t("categories.messages.unexpected"));
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

      setActionMessage(t("categories.messages.reactivated"));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("categories.messages.reactivateError")),
        );
      } else {
        setActionMessage(t("categories.messages.unexpected"));
      }
    } finally {
      setReactivatingCategoryId(null);
    }
  }

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("categories.title")}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {t("categories.subtitle")}
          </p>

          <div className="mt-4">
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              onClick={() => setShowCreateForm((prev) => !prev)}
            >
              {showCreateForm
                ? t("categories.buttons.cancel")
                : t("categories.buttons.create")}
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {actionMessage}
          </div>
        )}

        {/* CREATE FORM */}
        {showCreateForm && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t("categories.form.createTitle")}
            </h2>

            <form onSubmit={handleCreateCategory} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("categories.form.name")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="name"
                    value={createForm.name}
                    onChange={handleCreateFormChange}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("categories.form.description")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="description"
                    value={createForm.description}
                    onChange={handleCreateFormChange}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition disabled:opacity-70"
                  disabled={creatingCategory}
                >
                  {creatingCategory
                    ? t("categories.buttons.creating")
                    : t("categories.buttons.create")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 transition"
                  onClick={resetCreateForm}
                  disabled={creatingCategory}
                >
                  {t("categories.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* EDIT FORM */}
        {showEditForm && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t("categories.form.editTitle")}
            </h2>

            <form onSubmit={handleUpdateCategory} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("categories.form.name")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("categories.form.description")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditFormChange}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 transition"
                  disabled={updatingCategory}
                >
                  {updatingCategory
                    ? t("categories.buttons.saving")
                    : t("categories.buttons.save")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 transition"
                  onClick={resetEditForm}
                  disabled={updatingCategory}
                >
                  {t("categories.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {t("categories.messages.loading")}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* TABLE */}
        {!loading && !error && (
          <DataTable
            columns={categoryTableColumns}
            hasData={categories.length > 0}
            emptyMessage={t("categories.messages.empty")}
          >
            {categories.map((category) => (
              <tr key={category.id} className="transition hover:bg-gray-50/80">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {category.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {category.description || t("categories.table.noDescription")}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      category.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {category.isActive
                      ? t("categories.table.active")
                      : t("categories.table.inactive")}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatLocalDateForDisplay(category.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      onClick={() => handleOpenEditForm(category)}
                      disabled={!category.isActive}
                    >
                      {t("categories.buttons.edit")}
                    </button>

                    {category.isActive ? (
                      <button
                        className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                        onClick={() => handleDeactivateCategory(category.id)}
                        disabled={deactivatingCategoryId === category.id}
                      >
                        {deactivatingCategoryId === category.id
                          ? t("categories.buttons.processing")
                          : t("categories.buttons.deactivate")}
                      </button>
                    ) : (
                      <button
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                        onClick={() => handleReactivateCategory(category.id)}
                        disabled={reactivatingCategoryId === category.id}
                      >
                        {reactivatingCategoryId === category.id
                          ? t("categories.buttons.processing")
                          : t("categories.buttons.reactivate")}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </div>
    </section>
  );
}
export default CategoriesPage;
