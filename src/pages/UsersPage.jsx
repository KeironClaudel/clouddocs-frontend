import { useEffect, useState } from "react";
import axios from "axios";
import {
  createUser,
  getUsers,
  deactivateUser,
  reactivateUser,
} from "../services/userService";
import { roleOptions } from "../utils/roleOptions";

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
        setActionMessage(
          err.response?.data?.message || "Failed to deactivate user.",
        );
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
        setActionMessage(
          err.response?.data?.message || "Failed to reactivate user.",
        );
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
        setActionMessage(
          err.response?.data?.message || "Failed to reactivate user.",
        );
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setUpdatingUserId(null);
    }
  }

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
          setError(err.response?.data?.message || "Failed to load users.");
        } else {
          setError(err.message || "An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

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
        setActionMessage(
          err.response?.data?.message || "Failed to create user.",
        );
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setCreatingUser(false);
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
                        <td>
                          {new Date(userItem.createdAt).toLocaleDateString()}
                        </td>
                        <td>
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
