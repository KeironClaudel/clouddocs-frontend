import { useEffect, useState } from "react";
import axios from "axios";
import {
  createCategory,
  deactivateCategory,
  getCategories,
  updateCategory,
  reactivateCategory,
} from "../services/categoryService";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";

/**
 * Encapsulates all CategoriesPage state and handlers.
 */
export function useCategoriesPage() {
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

  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();

        const normalized = Array.isArray(data)
          ? data
          : data.categories || data.items || [];

        setCategories(normalized);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(getApiErrorMessage(err, t("categories.messages.loadError")));
        } else {
          setError(t("categories.messages.unexpected"));
        }
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
    setCreateForm({ name: "", description: "" });
    setShowCreateForm(false);
  }

  function resetEditForm() {
    setEditForm({ name: "", description: "" });
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
    setCreatingCategory(true);

    try {
      const payload = {
        name: createForm.name,
        description: createForm.description || null,
      };

      const created = await createCategory(payload);

      if (created?.id) addCategoryToState(created);

      setActionMessage(t("categories.messages.created"));
      resetCreateForm();
    } catch (err) {
      setActionMessage(
        axios.isAxiosError(err)
          ? getApiErrorMessage(err, t("categories.messages.createError"))
          : t("categories.messages.unexpected"),
      );
    } finally {
      setCreatingCategory(false);
    }
  }

  function handleOpenEditForm(category) {
    setActionMessage("");
    setEditingCategoryId(category.id);
    setEditForm({
      name: category.name || "",
      description: category.description || "",
    });
    setShowEditForm(true);
  }

  async function handleUpdateCategory(e) {
    e.preventDefault();
    if (!editingCategoryId) return;

    setActionMessage("");
    setUpdatingCategory(true);

    try {
      const payload = {
        name: editForm.name,
        description: editForm.description || null,
      };

      const updated = await updateCategory(editingCategoryId, payload);

      if (updated?.id) updateCategoryInState(updated);

      setActionMessage(t("categories.messages.updated"));
      resetEditForm();
    } catch (err) {
      setActionMessage(
        axios.isAxiosError(err)
          ? getApiErrorMessage(err, t("categories.messages.updateError"))
          : t("categories.messages.unexpected"),
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
        axios.isAxiosError(err)
          ? getApiErrorMessage(err, t("categories.messages.deactivateError"))
          : t("categories.messages.unexpected"),
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
        axios.isAxiosError(err)
          ? getApiErrorMessage(err, t("categories.messages.reactivateError"))
          : t("categories.messages.unexpected"),
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
