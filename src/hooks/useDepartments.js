import { useEffect, useMemo, useState } from "react";
import {
  createDepartment,
  deactivateDepartment,
  getDepartments,
  reactivateDepartment,
  updateDepartment,
} from "../services/departmentService";
import {
  validateCreateDepartment,
  validateUpdateDepartment,
} from "../validators/departmentValidators";
import { resolveApiErrorMessage } from "../utils/apiErrorHandler";
import {
  buildCreateDepartmentPayload,
  buildUpdateDepartmentPayload,
  getInitialCreateDepartmentForm,
  getInitialEditDepartmentForm,
  mapDepartmentToForm,
} from "../mappers/departmentMappers";
import { t } from "../i18n";

/**
 * Encapsulates all DepartmentsPage state and handlers.
 */
export function useDepartmentsPage() {
  /**
   * Stores the create department form values.
   */
  const [createForm, setCreateForm] = useState(
    getInitialCreateDepartmentForm(),
  );

  /**
   * Stores the edit department form values.
   */
  const [editForm, setEditForm] = useState(getInitialEditDepartmentForm());

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
   * Tracks which department is currently being updated.
   */
  const [updatingDepartmentId, setUpdatingDepartmentId] = useState(null);

  /**
   * Stores filter values for the departments table.
   */
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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
        setError(
          resolveApiErrorMessage(err, t("departments.messages.loadError")),
        );
      } finally {
        setLoading(false);
      }
    }

    loadDepartments();
  }, []);

  /**
   * Returns departments filtered by search term and status.
   */
  const filteredDepartments = useMemo(() => {
    return departments.filter((departmentItem) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        departmentItem.name?.toLowerCase().includes(normalizedSearch) ||
        departmentItem.description?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === ""
          ? true
          : String(departmentItem.isActive) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [departments, searchTerm, statusFilter]);

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
   * Updates the search term filter.
   */
  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
  }

  /**
   * Updates the status filter.
   */
  function handleStatusFilterChange(event) {
    setStatusFilter(event.target.value);
  }

  /**
   * Clears all filters.
   */
  function handleClearFilters() {
    setSearchTerm("");
    setStatusFilter("");
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
    setCreateForm(getInitialCreateDepartmentForm());
    setShowCreateForm(false);
  }

  /**
   * Handles the create department form submission.
   */
  async function handleCreateDepartment(event) {
    event.preventDefault();
    setActionMessage("");

    const validationError = validateCreateDepartment(createForm, t);

    if (validationError) {
      setActionMessage(validationError);
      return;
    }

    setCreatingDepartment(true);

    try {
      const payload = buildCreateDepartmentPayload(createForm);

      const createdDepartment = await createDepartment(payload);

      if (createdDepartment?.id) {
        setDepartments((prev) => [createdDepartment, ...prev]);
      }

      setActionMessage(t("departments.messages.createSuccess"));
      resetCreateForm();
    } catch (err) {
      setActionMessage(
        resolveApiErrorMessage(err, t("departments.messages.createError")),
      );
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
    setEditForm(getInitialEditDepartmentForm());
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
    setEditForm(mapDepartmentToForm(department));
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

    const validationError = validateUpdateDepartment(editForm, t);

    if (validationError) {
      setActionMessage(validationError);
      return;
    }

    setUpdatingDepartment(true);

    try {
      const payload = buildUpdateDepartmentPayload(editForm);

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
      setActionMessage(
        resolveApiErrorMessage(err, t("departments.messages.updateError")),
      );
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
      setActionMessage(
        resolveApiErrorMessage(err, t("departments.messages.deactivateError")),
      );
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
      setActionMessage(
        resolveApiErrorMessage(err, t("departments.messages.reactivateError")),
      );
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
    filteredDepartments,
    handleClearFilters,
    handleCreateDepartment,
    handleCreateFormChange,
    handleDeactivateDepartment,
    handleEditFormChange,
    handleOpenEditForm,
    handleReactivateDepartment,
    handleSearchTermChange,
    handleStatusFilterChange,
    handleUpdateDepartment,
    loading,
    reactivatingDepartmentId: updatingDepartmentId,
    resetCreateForm,
    resetEditForm,
    searchTerm,
    setShowCreateForm,
    showCreateForm,
    showEditForm,
    statusFilter,
    updatingDepartment,
    updatingDepartmentId,
  };
}
