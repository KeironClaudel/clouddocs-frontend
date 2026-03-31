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
import { roleOptions } from "../utils/roleOptions";
import { formatLocalDateForDisplay } from "../utils/dateUtils";
import { getApiErrorMessage } from "../utils/errorUtils";
import DataTable from "../components/DataTable";

function UsersPage() {
  /**
   * Stores the user list returned by the API.
   */
  const [users, setUsers] = useState([]);

  /**
   * Indicates whether the user request is currently in progress.
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
   * Tracks which user is currently being updated.
   */
  const [updatingUserId, setUpdatingUserId] = useState(null);

  /**
   * Controls whether the create user form is visible.
   */
  const [showCreateForm, setShowCreateForm] = useState(false);

  /**
   * Stores whether the create user request is currently in progress.
   */
  const [creatingUser, setCreatingUser] = useState(false);

  /**
   * Stores the create user form values.
   */
  const [createForm, setCreateForm] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    roleId: "",
  });

  /**
   * Controls whether the edit user form is visible.
   */
  const [showEditForm, setShowEditForm] = useState(false);

  /**
   * Stores whether the selected user is being loaded for editing.
   */
  const [loadingEditUser, setLoadingEditUser] = useState(false);

  /**
   * Stores whether the update request is currently in progress.
   */
  const [updatingUser, setUpdatingUser] = useState(false);

  /**
   * Stores the ID of the user currently being edited.
   */
  const [editingUserId, setEditingUserId] = useState(null);

  /**
   * Stores the edit user form values.
   */
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    department: "",
    roleId: "",
  });

  /**
   * Defines the columns to display in the user table, along with their labels.
   * The "key" corresponds to the property in the user object, and "label" is the column header.
   * The "actions" column will be used to render action buttons for each user.
   */
  const userTableColumns = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" },
    { key: "actions", label: "Actions" },
  ];

  /**
   * Loads the user list when the page is rendered for the first time.
   */
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();

        const normalizedUsers = Array.isArray(data)
          ? data
          : data.users || data.items || [];

        setUsers(normalizedUsers);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setActionMessage(getApiErrorMessage(err, "Failed to load user."));
        } else {
          setActionMessage("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  /**
   * Updates a user's active status in local state after a successful API request.
   */
  function updateUserStatusInState(userId, isActive) {
    setUsers((prevUsers) =>
      prevUsers.map((userItem) =>
        userItem.id === userId ? { ...userItem, isActive } : userItem,
      ),
    );
  }

  /**
   * Updates the selected user in local state after a successful edit.
   */
  function updateUserInState(updatedUser) {
    setUsers((prevUsers) =>
      prevUsers.map((userItem) =>
        userItem.id === updatedUser.id ? updatedUser : userItem,
      ),
    );
  }

  /**
   * Handles user deactivation.
   */
  async function handleDeactivate(userId) {
    setActionMessage("");
    setUpdatingUserId(userId);

    try {
      await deactivateUser(userId);
      updateUserStatusInState(userId, false);
      setActionMessage("User deactivated successfully.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(getApiErrorMessage(err, "Failed to deactivate user."));
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setUpdatingUserId(null);
    }
  }

  /**
   * Handles user reactivation.
   */
  async function handleReactivate(userId) {
    setActionMessage("");
    setUpdatingUserId(userId);

    try {
      await reactivateUser(userId);
      updateUserStatusInState(userId, true);
      setActionMessage("User reactivated successfully.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(getApiErrorMessage(err, "Failed to reactivate user."));
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setUpdatingUserId(null);
    }
  }

  /**
   * Updates the create user form state when an input changes.
   */
  function handleCreateFormChange(event) {
    const { name, value } = event.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /**
   * Resets the create user form to its initial state.
   */
  function resetCreateForm() {
    setCreateForm({
      fullName: "",
      email: "",
      password: "",
      department: "",
      roleId: "",
    });
  }

  /**
   * Handles the create user form submission.
   */
  async function handleCreateUser(event) {
    event.preventDefault();

    setActionMessage("");
    setCreatingUser(true);

    try {
      const payload = {
        fullName: createForm.fullName,
        email: createForm.email,
        password: createForm.password,
        department: createForm.department || null,
        roleId: createForm.roleId,
      };

      const createdUser = await createUser(payload);

      if (createdUser && createdUser.id) {
        setUsers((prev) => [createdUser, ...prev]);
      }

      setActionMessage("User created successfully.");
      resetCreateForm();
      setShowCreateForm(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(getApiErrorMessage(err, "Failed to create user."));
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setCreatingUser(false);
    }
  }

  /**
   * Updates the edit user form state when an input changes.
   */
  function handleEditFormChange(event) {
    const { name, value } = event.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /**
   * Resets the edit user form to its initial state.
   */
  function resetEditForm() {
    setEditForm({
      fullName: "",
      email: "",
      department: "",
      roleId: "",
    });

    setEditingUserId(null);
    setShowEditForm(false);
  }

  /**
   * Opens the edit form and loads the selected user's details.
   */
  async function handleOpenEditForm(userId) {
    setActionMessage("");
    setLoadingEditUser(true);
    setShowEditForm(true);

    try {
      const userData = await getUserById(userId);

      const matchedRole = roleOptions.find(
        (role) => role.label === userData.role,
      );

      setEditForm({
        fullName: userData.fullName || "",
        email: userData.email || "",
        department: userData.department || "",
        roleId: userData.roleId || matchedRole?.value || "",
      });

      setEditingUserId(userId);
    } catch (err) {
      setShowEditForm(false);
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, "Failed to load user details."),
        );
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setLoadingEditUser(false);
    }
  }

  /**
   * Handles the edit user form submission.
   */
  async function handleUpdateUser(event) {
    event.preventDefault();

    if (!editingUserId) {
      return;
    }

    setActionMessage("");
    setUpdatingUser(true);

    try {
      const payload = {
        fullName: editForm.fullName,
        email: editForm.email,
        department: editForm.department || null,
        roleId: editForm.roleId,
      };

      const updatedUser = await updateUser(editingUserId, payload);

      if (updatedUser && updatedUser.id) {
        updateUserInState(updatedUser);
      }

      setActionMessage("User updated successfully.");
      resetEditForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          err.response?.data?.message || "Failed to update user.",
        );
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setUpdatingUser(false);
    }
  }

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-600">
            View registered users and their account information.
          </p>

          {actionMessage && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {actionMessage}
            </div>
          )}

          <div className="mt-4">
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              onClick={() => setShowCreateForm((prev) => !prev)}
            >
              {showCreateForm ? "Cancel" : "Create User"}
            </button>
          </div>
        </div>

        {/* CREATE FORM */}
        {showCreateForm && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Create New User
            </h2>

            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="text"
                  name="fullName"
                  value={createForm.fullName}
                  onChange={handleCreateFormChange}
                  placeholder="Full Name"
                  required
                />

                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="email"
                  name="email"
                  value={createForm.email}
                  onChange={handleCreateFormChange}
                  placeholder="Email"
                  required
                />

                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="password"
                  name="password"
                  value={createForm.password}
                  onChange={handleCreateFormChange}
                  placeholder="Password"
                  required
                />

                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="text"
                  name="department"
                  value={createForm.department}
                  onChange={handleCreateFormChange}
                  placeholder="Department"
                />

                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  name="roleId"
                  value={createForm.roleId}
                  onChange={handleCreateFormChange}
                  required
                >
                  <option value="">Select a role</option>
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  disabled={creatingUser}
                >
                  {creatingUser ? "Creating..." : "Create"}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                  onClick={() => {
                    resetCreateForm();
                    setShowCreateForm(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* EDIT FORM */}
        {showEditForm && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Edit User
            </h2>

            {loadingEditUser ? (
              <p className="text-sm text-gray-600">Loading user details...</p>
            ) : (
              <form onSubmit={handleUpdateUser} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleEditFormChange}
                    required
                  />

                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditFormChange}
                    required
                  />

                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="department"
                    value={editForm.department}
                    onChange={handleEditFormChange}
                  />

                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    name="roleId"
                    value={editForm.roleId}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="">Select a role</option>
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                    onClick={resetEditForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* STATES */}
        {loading && (
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Loading users...
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* TABLE */}
        {!loading && !error && (
          <DataTable
            columns={userTableColumns}
            hasData={users.length > 0}
            emptyMessage="No users found."
          >
            {users.map((userItem) => (
              <tr key={userItem.id} className="transition hover:bg-gray-50/80">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {userItem.fullName}
                </td>

                <td className="px-6 py-4 text-gray-700">{userItem.email}</td>

                <td className="px-6 py-4 text-gray-600">
                  {userItem.department || "N/A"}
                </td>

                <td className="px-6 py-4 text-gray-700">{userItem.role}</td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      userItem.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {userItem.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatLocalDateForDisplay(userItem.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      onClick={() => handleOpenEditForm(userItem.id)}
                      disabled={
                        loadingEditUser || updatingUserId === userItem.id
                      }
                    >
                      Edit
                    </button>

                    {userItem.isActive ? (
                      <button
                        className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                        onClick={() => handleDeactivate(userItem.id)}
                        disabled={updatingUserId === userItem.id}
                      >
                        {updatingUserId === userItem.id
                          ? "Processing..."
                          : "Deactivate"}
                      </button>
                    ) : (
                      <button
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                        onClick={() => handleReactivate(userItem.id)}
                        disabled={updatingUserId === userItem.id}
                      >
                        {updatingUserId === userItem.id
                          ? "Processing..."
                          : "Reactivate"}
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

export default UsersPage;
