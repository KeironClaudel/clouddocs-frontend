import { useEffect, useState } from "react";
import {
  createCategory,
  deactivateCategory,
  getCategories,
  updateCategory,
  reactivateCategory,
} from "../services/categoryService";
import { resolveApiErrorMessage } from "../utils/apiErrorHandler";
import {
  validateCreateCategory,
  validateUpdateCategory,
} from "../validators/categoryValidators";
import {
  buildCategoryPayload,
  getInitialCategoryForm,
  mapCategoryToForm,
} from "../mappers/categoryMappers";
import { t } from "../i18n";

export function useCategoriesPage() {
  const [createForm, setCreateForm] = useState(getInitialCategoryForm());
  const [editForm, setEditForm] = useState(getInitialCategoryForm());
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [creatingCategory, setCreatingCategory] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState(false);

  const [deactivatingCategoryId, setDeactivatingCategoryId] = useState(null);
  const [reactivatingCategoryId, setReactivatingCategoryId] = useState(null);

  const [editingCategoryId, setEditingCategoryId] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();

        const normalized = Array.isArray(data)
          ? data
          : data.categories || data.items || [];

        setCategories(normalized);
      } catch (err) {
        setError(
          resolveApiErrorMessage(err, t("categories.messages.loadError")),
        );
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  function handleCreateFormChange(e) {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetCreateForm() {
    setCreateForm(getInitialCategoryForm());
    setShowCreateForm(false);
  }

  function resetEditForm() {
    setEditForm(getInitialCategoryForm());
    setEditingCategoryId(null);
    setShowEditForm(false);
  }

  function addCategoryToState(category) {
    setCategories((prev) => [category, ...prev]);
  }

  function updateCategoryInState(updated) {
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
  }

  function deactivateCategoryInState(id) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: false } : c)),
    );
  }

  function reactivateCategoryInState(id) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: true } : c)),
    );
  }

  async function handleCreateCategory(e) {
    e.preventDefault();

    setActionMessage("");

    const validationError = validateCreateCategory(createForm, t);

    if (validationError) {
      setActionMessage(validationError);
      return;
    }

    setCreatingCategory(true);

    try {
      const payload = buildCategoryPayload(createForm);
      const created = await createCategory(payload);

      if (created?.id) {
        addCategoryToState(created);
      }

      setActionMessage(t("categories.messages.created"));
      resetCreateForm();
    } catch (err) {
      setActionMessage(
        resolveApiErrorMessage(err, t("categories.messages.createError")),
      );
    } finally {
      setCreatingCategory(false);
    }
  }

  function handleOpenEditForm(category) {
    setActionMessage("");
    setEditingCategoryId(category.id);
    setEditForm(mapCategoryToForm(category));
    setShowEditForm(true);
  }

  async function handleUpdateCategory(e) {
    e.preventDefault();

    if (!editingCategoryId) return;

    setActionMessage("");

    const validationError = validateUpdateCategory(editForm, t);

    if (validationError) {
      setActionMessage(validationError);
      return;
    }

    setUpdatingCategory(true);

    try {
      const payload = buildCategoryPayload(editForm);
      const updated = await updateCategory(editingCategoryId, payload);

      if (updated?.id) {
        updateCategoryInState(updated);
      }

      setActionMessage(t("categories.messages.updated"));
      resetEditForm();
    } catch (err) {
      setActionMessage(
        resolveApiErrorMessage(err, t("categories.messages.updateError")),
      );
    } finally {
      setUpdatingCategory(false);
    }
  }

  async function handleDeactivateCategory(id) {
    setActionMessage("");
    setDeactivatingCategoryId(id);

    try {
      await deactivateCategory(id);
      deactivateCategoryInState(id);
      setActionMessage(t("categories.messages.deactivated"));
    } catch (err) {
      setActionMessage(
        resolveApiErrorMessage(err, t("categories.messages.deactivateError")),
      );
    } finally {
      setDeactivatingCategoryId(null);
    }
  }

  async function handleReactivateCategory(id) {
    setActionMessage("");
    setReactivatingCategoryId(id);

    try {
      await reactivateCategory(id);
      reactivateCategoryInState(id);
      setActionMessage(t("categories.messages.reactivated"));
    } catch (err) {
      setActionMessage(
        resolveApiErrorMessage(err, t("categories.messages.reactivateError")),
      );
    } finally {
      setReactivatingCategoryId(null);
    }
  }

  return {
    actionMessage,
    categories,
    createForm,
    creatingCategory,
    deactivatingCategoryId,
    editForm,
    error,
    handleCreateCategory,
    handleCreateFormChange,
    handleDeactivateCategory,
    handleEditFormChange,
    handleOpenEditForm,
    handleReactivateCategory,
    handleUpdateCategory,
    loading,
    reactivatingCategoryId,
    resetCreateForm,
    resetEditForm,
    setShowCreateForm,
    showCreateForm,
    showEditForm,
    updatingCategory,
  };
}
