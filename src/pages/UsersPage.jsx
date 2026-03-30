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
    <section className="section">
      <div className="container">
        <div className="mb-5">
          <h1 className="title is-2">Users</h1>
          <p className="subtitle is-6">
            View registered users and their account information.
          </p>

          {actionMessage && (
            <article className="message is-info">
              <div className="message-body">{actionMessage}</div>
            </article>
          )}

          <div className="mb-4">
            <button
              className="button is-primary"
              onClick={() => setShowCreateForm((prev) => !prev)}
            >
              {showCreateForm ? "Cancel" : "Create User"}
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="box">
            <h2 className="title is-5">Create New User</h2>

            <form onSubmit={handleCreateUser}>
              <div className="columns is-multiline">
                <div className="column is-half">
                  <div className="field">
                    <label className="label">Full Name</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name="fullName"
                        value={createForm.fullName}
                        onChange={handleCreateFormChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="column is-half">
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input
                        className="input"
                        type="email"
                        name="email"
                        value={createForm.email}
                        onChange={handleCreateFormChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="column is-half">
                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input
                        className="input"
                        type="password"
                        name="password"
                        value={createForm.password}
                        onChange={handleCreateFormChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="column is-half">
                  <div className="field">
                    <label className="label">Department</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name="department"
                        value={createForm.department}
                        onChange={handleCreateFormChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="column is-half">
                  <div className="field">
                    <label className="label">Role</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="field is-grouped mt-4">
                <div className="control">
                  <button
                    type="submit"
                    className="button is-primary"
                    disabled={creatingUser}
                  >
                    {creatingUser ? "Creating..." : "Create"}
                  </button>
                </div>

                <div className="control">
                  <button
                    type="button"
                    className="button is-light"
                    onClick={() => {
                      resetCreateForm();
                      setShowCreateForm(false);
                    }}
                    disabled={creatingUser}
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
            <h2 className="title is-5">Edit User</h2>

            {loadingEditUser ? (
              <p>Loading user details...</p>
            ) : (
              <form onSubmit={handleUpdateUser}>
                <div className="columns is-multiline">
                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Full Name</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="fullName"
                          value={editForm.fullName}
                          onChange={handleEditFormChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Email</label>
                      <div className="control">
                        <input
                          className="input"
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditFormChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Department</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="department"
                          value={editForm.department}
                          onChange={handleEditFormChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Role</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
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
                      </div>
                    </div>
                  </div>
                </div>

                <div className="field is-grouped mt-4">
                  <div className="control">
                    <button
                      type="submit"
                      className="button is-link"
                      disabled={updatingUser}
                    >
                      {updatingUser ? "Saving..." : "Save Changes"}
                    </button>
                  </div>

                  <div className="control">
                    <button
                      type="button"
                      className="button is-light"
                      onClick={resetEditForm}
                      disabled={updatingUser}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {loading && (
          <article className="message is-info">
            <div className="message-body">Loading users...</div>
          </article>
        )}

        {!loading && error && (
          <article className="message is-danger">
            <div className="message-body">{error}</div>
          </article>
        )}

        {!loading && !error && (
          <div className="box">
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div className="table-container">
                <table className="table is-fullwidth is-hoverable is-striped">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => (
                      <tr key={userItem.id}>
                        <td>{userItem.fullName}</td>
                        <td>{userItem.email}</td>
                        <td>{userItem.department || "N/A"}</td>
                        <td>{userItem.role}</td>
                        <td>
                          {userItem.isActive ? (
                            <span className="tag is-success is-light">
                              Active
                            </span>
                          ) : (
                            <span className="tag is-danger is-light">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td>{formatLocalDateForDisplay(userItem.createdAt)}</td>
                        <td>
                          <div className="buttons are-small">
                            <button
                              className="button is-link is-light"
                              onClick={() => handleOpenEditForm(userItem.id)}
                              disabled={
                                loadingEditUser ||
                                updatingUserId === userItem.id
                              }
                            >
                              Edit
                            </button>

                            {userItem.isActive ? (
                              <button
                                className="button is-warning is-light is-small"
                                onClick={() => handleDeactivate(userItem.id)}
                                disabled={updatingUserId === userItem.id}
                              >
                                {updatingUserId === userItem.id
                                  ? "Processing..."
                                  : "Deactivate"}
                              </button>
                            ) : (
                              <button
                                className="button is-success is-light is-small"
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

export default UsersPage;
