import { useEffect, useState } from "react";
import axios from "axios";
import {
  createDepartment,
  deactivateDepartment,
  getDepartments,
  reactivateDepartment,
  updateDepartment,
} from "../services/departmentService";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";

/**
 * Encapsulates all DepartmentsPage state and handlers.
 */
export function useDepartmentsPage() {
  /**
   * Stores the department list returned by the API.
   */
  const [departments, setDepartments] = useState([]);

  /**
   * Indicates whether the department request is currently in progress.
   */
  const [loading, setLoading] = useState(true);

  /**
   * Stores an error message to display when loading fails.
   */
  const [error, setError] = useState("");

  /**
   * Stores a global feedback message after admin actions.
   */
  const [actionMessage, setActionMessage] = useState("");

  /**
   * Controls whether the create department form is visible.
   */
  const [showCreateForm, setShowCreateForm] = useState(false);

  /**
   * Stores whether the create department request is currently in progress.
   */
  const [creatingDepartment, setCreatingDepartment] = useState(false);

  /**
   * Stores the create department form values.
   */
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
  });

  /**
   * Controls whether the edit department form is visible.
   */
  const [showEditForm, setShowEditForm] = useState(false);

  /**
   * Stores whether the update request is currently in progress.
   */
  const [updatingDepartment, setUpdatingDepartment] = useState(false);

  /**
   * Stores the ID of the department currently being edited.
   */
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);

  /**
   * Stores the edit department form values.
   */
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });

  /**
   * Tracks which department is currently being updated.
   */
  const [updatingDepartmentId, setUpdatingDepartmentId] = useState(null);

  /**
   * Loads the department list when the page is rendered for the first time.
   */
  useEffect(() => {
    async function loadDepartments() {
      try {
        const data = await getDepartments();

        const normalizedDepartments = Array.isArray(data)
          ? data
          : data.departments || data.items || [];

        setDepartments(normalizedDepartments);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            getApiErrorMessage(err, t("departments.messages.loadError")),
          );
        } else {
          setError(t("departments.messages.unexpected"));
        }
      } finally {
        setLoading(false);
      }
    }

    loadDepartments();
  }, []);

  /**
   * Updates a department's active status in local state after a successful API request.
   */
  function updateDepartmentStatusInState(departmentId, isActive) {
    setDepartments((prevDepartments) =>
      prevDepartments.map((departmentItem) =>
        departmentItem.id === departmentId
          ? { ...departmentItem, isActive }
          : departmentItem,
      ),
    );
  }

  /**
   * Updates the selected department in local state after a successful edit.
   */
  function updateDepartmentInState(updatedDepartment) {
    setDepartments((prevDepartments) =>
      prevDepartments.map((departmentItem) =>
        departmentItem.id === updatedDepartment.id
          ? updatedDepartment
          : departmentItem,
      ),
    );
  }

  /**
   * Updates the create department form state when an input changes.
   */
  function handleCreateFormChange(event) {
    const { name, value } = event.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /**
   * Resets the create department form to its initial state.
   */
  function resetCreateForm() {
    setCreateForm({
      name: "",
      description: "",
    });
  }

  /**
   * Handles the create department form submission.
   */
  async function handleCreateDepartment(event) {
    event.preventDefault();

    setActionMessage("");
    setCreatingDepartment(true);

    try {
      const payload = {
        name: createForm.name,
        description: createForm.description || null,
      };

      const createdDepartment = await createDepartment(payload);

      if (createdDepartment?.id) {
        setDepartments((prev) => [createdDepartment, ...prev]);
      }

      setActionMessage(t("departments.messages.createSuccess"));
      resetCreateForm();
      setShowCreateForm(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("departments.messages.createError")),
        );
      } else {
        setActionMessage(t("departments.messages.unexpected"));
      }
    } finally {
      setCreatingDepartment(false);
    }
  }

  /**
   * Updates the edit department form state when an input changes.
   */
  function handleEditFormChange(event) {
    const { name, value } = event.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /**
   * Resets the edit department form to its initial state.
   */
  function resetEditForm() {
    setEditForm({
      name: "",
      description: "",
    });

    setEditingDepartmentId(null);
    setShowEditForm(false);
  }

  /**
   * Opens the edit form and loads the selected department's details.
   */
  function handleOpenEditForm(department) {
    setActionMessage("");
    setShowEditForm(true);
    setEditingDepartmentId(department.id);

    setEditForm({
      name: department.name || "",
      description: department.description || "",
    });
  }

  /**
   * Handles the edit department form submission.
   */
  async function handleUpdateDepartment(event) {
    event.preventDefault();

    if (!editingDepartmentId) {
      return;
    }

    setActionMessage("");
    setUpdatingDepartment(true);

    try {
      const payload = {
        name: editForm.name,
        description: editForm.description || null,
      };

      const updatedDepartment = await updateDepartment(
        editingDepartmentId,
        payload,
      );

      if (updatedDepartment?.id) {
        updateDepartmentInState(updatedDepartment);
      }

      setActionMessage(t("departments.messages.updateSuccess"));
      resetEditForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("departments.messages.updateError")),
        );
      } else {
        setActionMessage(t("departments.messages.unexpected"));
      }
    } finally {
      setUpdatingDepartment(false);
    }
  }

  /**
   * Handles department deactivation.
   */
  async function handleDeactivateDepartment(departmentId) {
    setActionMessage("");
    setUpdatingDepartmentId(departmentId);

    try {
      await deactivateDepartment(departmentId);
      updateDepartmentStatusInState(departmentId, false);
      setActionMessage(t("departments.messages.deactivateSuccess"));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("departments.messages.deactivateError")),
        );
      } else {
        setActionMessage(t("departments.messages.unexpected"));
      }
    } finally {
      setUpdatingDepartmentId(null);
    }
  }

  /**
   * Handles department reactivation.
   */
  async function handleReactivateDepartment(departmentId) {
    setActionMessage("");
    setUpdatingDepartmentId(departmentId);

    try {
      await reactivateDepartment(departmentId);
      updateDepartmentStatusInState(departmentId, true);
      setActionMessage(t("departments.messages.reactivateSuccess"));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("departments.messages.reactivateError")),
        );
      } else {
        setActionMessage(t("departments.messages.unexpected"));
      }
    } finally {
      setUpdatingDepartmentId(null);
    }
  }

  return {
    actionMessage,
    createForm,
    creatingDepartment,
    departments,
    editForm,
    error,
    handleCreateDepartment,
    handleCreateFormChange,
    handleDeactivateDepartment,
    handleEditFormChange,
    handleOpenEditForm,
    handleReactivateDepartment,
    handleUpdateDepartment,
    loading,
    resetCreateForm,
    resetEditForm,
    setShowCreateForm,
    showCreateForm,
    showEditForm,
    updatingDepartment,
    updatingDepartmentId,
  };
}
