import { useEffect, useState } from "react";
import axios from "axios";
import { getUsers } from "../services/userService";

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

  return (
    <section className="section">
      <div className="container">
        <div className="mb-5">
          <h1 className="title is-2">Users</h1>
          <p className="subtitle is-6">
            View registered users and their account information.
          </p>
        </div>

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
