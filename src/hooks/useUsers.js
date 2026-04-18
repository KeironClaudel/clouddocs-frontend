import { useEffect, useState } from "react";
import axios from "axios";
import {
  createUser,
  deactivateUser,
  getUserById,
  getUsers,
  reactivateUser,
  updateUser,
} from "../services/userService";
import { getDepartments } from "../services/departmentService";
import { roleOptions } from "../utils/roleOptions";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";
import {
  buildCreateUserPayload,
  buildUpdateUserPayload,
  getInitialCreateUserForm,
  getInitialEditUserForm,
  mapUserToEditForm,
} from "../mappers/userMappers";
import {
  validateCreateUserForm,
  validateUpdateUserForm,
} from "../validators/userValidators";

/**
 * Encapsulates all UsersPage state and handlers.
 */
export function useUsersPage() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [updatingUserId, setUpdatingUserId] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createForm, setCreateForm] = useState(getInitialCreateUserForm());

  const [showEditForm, setShowEditForm] = useState(false);
  const [loadingEditUser, setLoadingEditUser] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState(getInitialEditUserForm());

  useEffect(() => {
    async function loadData() {
      try {
        const [usersData, departmentsData] = await Promise.all([
          getUsers(),
          getDepartments(),
        ]);

        const normalizedUsers = Array.isArray(usersData)
          ? usersData
          : usersData.users || usersData.items || [];

        const normalizedDepts = Array.isArray(departmentsData)
          ? departmentsData
          : departmentsData.departments || departmentsData.items || [];

        setUsers(normalizedUsers);
        setDepartments(normalizedDepts);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(getApiErrorMessage(err, t("users.messages.loadError")));
        } else {
          setError(t("users.messages.unexpected"));
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function updateUserStatusInState(userId, isActive) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive } : u)),
    );
  }

  function updateUserInState(updatedUser) {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
  }

  async function handleDeactivate(userId) {
    setActionMessage("");
    setUpdatingUserId(userId);

    try {
      await deactivateUser(userId);
      updateUserStatusInState(userId, false);
      setActionMessage(t("users.messages.deactivateSuccess"));
    } catch (err) {
      setActionMessage(
        axios.isAxiosError(err)
          ? getApiErrorMessage(err, t("users.messages.deactivateError"))
          : t("users.messages.unexpected"),
      );
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleReactivate(userId) {
    setActionMessage("");
    setUpdatingUserId(userId);

    try {
      await reactivateUser(userId);
      updateUserStatusInState(userId, true);
      setActionMessage(t("users.messages.reactivateSuccess"));
    } catch (err) {
      setActionMessage(
        axios.isAxiosError(err)
          ? getApiErrorMessage(err, t("users.messages.reactivateError"))
          : t("users.messages.unexpected"),
      );
    } finally {
      setUpdatingUserId(null);
    }
  }

  function handleCreateFormChange(e) {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetCreateForm() {
    setCreateForm(getInitialCreateUserForm());
  }

  async function handleCreateUser(e) {
    e.preventDefault();

    const validationError = validateCreateUserForm(createForm, t);
    if (validationError) {
      setActionMessage(validationError);
      return;
    }

    setCreatingUser(true);
    setActionMessage("");

    try {
      const payload = buildCreateUserPayload(createForm);
      const createdUser = await createUser(payload);

      if (createdUser?.id) {
        setUsers((prev) => [createdUser, ...prev]);
      }

      setActionMessage(t("users.messages.createSuccess"));
      resetCreateForm();
      setShowCreateForm(false);
    } catch (err) {
      setActionMessage(
        axios.isAxiosError(err)
          ? getApiErrorMessage(err, t("users.messages.createError"))
          : t("users.messages.unexpected"),
      );
    } finally {
      setCreatingUser(false);
    }
  }

  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetEditForm() {
    setEditForm(getInitialEditUserForm());
    setEditingUserId(null);
    setShowEditForm(false);
  }

  async function handleOpenEditForm(userId) {
    setLoadingEditUser(true);
    setShowEditForm(true);

    try {
      const userData = await getUserById(userId);
      const matchedRole = roleOptions.find((r) => r.label === userData.role);

      setEditForm(mapUserToEditForm(userData, matchedRole));
      setEditingUserId(userId);
    } catch (err) {
      setShowEditForm(false);
      setActionMessage(
        axios.isAxiosError(err)
          ? getApiErrorMessage(err, t("users.messages.loadError"))
          : t("users.messages.unexpected"),
      );
    } finally {
      setLoadingEditUser(false);
    }
  }

  async function handleUpdateUser(e) {
    e.preventDefault();

    if (!editingUserId) {
      return;
    }

    const validationError = validateUpdateUserForm(editForm, t);
    if (validationError) {
      setActionMessage(validationError);
      return;
    }

    setUpdatingUser(true);
    setActionMessage("");

    try {
      const payload = buildUpdateUserPayload(editForm);
      const updatedUser = await updateUser(editingUserId, payload);

      if (updatedUser?.id) {
        updateUserInState(updatedUser);
      }

      setActionMessage(t("users.messages.updateSuccess"));
      resetEditForm();
    } catch (err) {
      setActionMessage(
        axios.isAxiosError(err)
          ? getApiErrorMessage(err, t("users.messages.updateError"))
          : t("users.messages.unexpected"),
      );
    } finally {
      setUpdatingUser(false);
    }
  }

  return {
    users,
    departments,
    loading,
    error,
    actionMessage,
    showCreateForm,
    setShowCreateForm,
    createForm,
    creatingUser,
    handleCreateFormChange,
    handleCreateUser,
    resetCreateForm,
    showEditForm,
    editForm,
    loadingEditUser,
    updatingUser,
    handleEditFormChange,
    handleOpenEditForm,
    handleUpdateUser,
    resetEditForm,
    updatingUserId,
    handleDeactivate,
    handleReactivate,
  };
}
