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

  const [createForm, setCreateForm] = useState({
    fullName: "",
    email: "",
    password: "",
    departmentId: "",
    roleId: "",
  });

  const [showEditForm, setShowEditForm] = useState(false);
  const [loadingEditUser, setLoadingEditUser] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    departmentId: "",
    roleId: "",
  });

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
    setCreateForm({
      fullName: "",
      email: "",
      password: "",
      departmentId: "",
      roleId: "",
    });
  }

  async function handleCreateUser(e) {
    e.preventDefault();

    setCreatingUser(true);
    setActionMessage("");

    try {
      const payload = {
        fullName: createForm.fullName,
        email: createForm.email,
        password: createForm.password,
        departmentId:
          createForm.departmentId && createForm.departmentId !== ""
            ? createForm.departmentId
            : null,
        roleId: createForm.roleId,
      };

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
    setEditForm({
      fullName: "",
      email: "",
      departmentId: "",
      roleId: "",
    });

    setEditingUserId(null);
    setShowEditForm(false);
  }

  async function handleOpenEditForm(userId) {
    setLoadingEditUser(true);
    setShowEditForm(true);

    try {
      const userData = await getUserById(userId);

      const matchedRole = roleOptions.find((r) => r.label === userData.role);

      setEditForm({
        fullName: userData.fullName || "",
        email: userData.email || "",
        departmentId: userData.departmentId
          ? String(userData.departmentId)
          : "",
        roleId: userData.roleId || matchedRole?.value || "",
      });

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

    if (!editingUserId) return;

    setUpdatingUser(true);
    setActionMessage("");

    try {
      const payload = {
        fullName: editForm.fullName,
        email: editForm.email,
        departmentId: editForm.departmentId || null,
        roleId: editForm.roleId,
      };

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
