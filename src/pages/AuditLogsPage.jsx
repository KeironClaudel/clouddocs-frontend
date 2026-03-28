import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getAuditLogs } from "../services/auditService";
import {
  formatLocalDate,
  formatLocalDateTimeForDisplay,
} from "../utils/dateUtils";

function AuditLogsPage() {
  /**
   * Stores the audit log list returned by the API.
   */
  const [auditLogs, setAuditLogs] = useState([]);

  /**
   * Indicates whether audit logs are currently loading.
   */
  const [loading, setLoading] = useState(true);

  /**
   * Stores a page-level error message.
   */
  const [error, setError] = useState("");

  /**
   * Stores the current filter values for the audit table.
   */
  const [filters, setFilters] = useState({
    user: "",
    action: "",
    module: "",
    date: "",
  });

  /**
   * Loads audit logs when the page is rendered for the first time.
   */
  useEffect(() => {
    async function loadAuditLogs() {
      try {
        const data = await getAuditLogs();

        const normalizedLogs = Array.isArray(data)
          ? data
          : data.auditLogs || data.items || [];

        setAuditLogs(normalizedLogs);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load audit logs.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadAuditLogs();
  }, []);

  /**
   * Updates audit filter state when an input changes.
   */
  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /**
   * Clears all audit filters.
   */
  function handleClearFilters() {
    setFilters({
      user: "",
      action: "",
      module: "",
      date: "",
    });
  }

  /**
   * Builds unique user ID options from loaded logs.
   */
  const userOptions = useMemo(() => {
    return [...new Set(auditLogs.map((log) => log.userId))]
      .filter(Boolean)
      .sort();
  }, [auditLogs]);
  /**
   * Builds unique action options from loaded logs.
   */
  const actionOptions = useMemo(() => {
    return [...new Set(auditLogs.map((log) => log.action))]
      .filter(Boolean)
      .sort();
  }, [auditLogs]);

  /**
   * Builds unique module options from loaded logs.
   */
  const moduleOptions = useMemo(() => {
    return [...new Set(auditLogs.map((log) => log.module))]
      .filter(Boolean)
      .sort();
  }, [auditLogs]);

  /**
   * Applies all active filters to the loaded audit log list.
   */
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const logUserId = log.userId || "";
      const logDate = formatLocalDate(log.createdAt);

      const matchesUser = !filters.user || logUserId === filters.user;
      const matchesAction = !filters.action || log.action === filters.action;
      const matchesModule = !filters.module || log.module === filters.module;
      const matchesDate = !filters.date || logDate === filters.date;

      return matchesUser && matchesAction && matchesModule && matchesDate;
    });
  }, [auditLogs, filters]);

  return (
    <section className="section app-section">
      <div className="container">
        <div className="mb-5">
          <h1 className="title is-2">Audit Logs</h1>
          <p className="subtitle is-6">
            Review system activity records in read-only mode.
          </p>
        </div>

        <div className="box">
          <h2 className="title is-5">Filters</h2>

          <div className="columns is-multiline">
            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <div className="field">
                <label className="label">User Id</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      name="user"
                      value={filters.user}
                      onChange={handleFilterChange}
                    >
                      <option value="">All users</option>
                      {userOptions.map((userId) => (
                        <option key={userId} value={userId}>
                          {userId}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <div className="field">
                <label className="label">Action</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      name="action"
                      value={filters.action}
                      onChange={handleFilterChange}
                    >
                      <option value="">All actions</option>
                      {actionOptions.map((action) => (
                        <option key={action} value={action}>
                          {action}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <div className="field">
                <label className="label">Module</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      name="module"
                      value={filters.module}
                      onChange={handleFilterChange}
                    >
                      <option value="">All modules</option>
                      {moduleOptions.map((module) => (
                        <option key={module} value={module}>
                          {module}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <div className="field">
                <label className="label">Date</label>
                <div className="control">
                  <input
                    className="input"
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field mt-3">
            <div className="control">
              <button
                type="button"
                className="button is-light"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <article className="message is-info">
            <div className="message-body">Loading audit logs...</div>
          </article>
        )}

        {!loading && error && (
          <article className="message is-danger">
            <div className="message-body">{error}</div>
          </article>
        )}

        {!loading && !error && (
          <div className="box">
            {filteredAuditLogs.length === 0 ? (
              <p>No audit logs found.</p>
            ) : (
              <>
                <div className="table-container">
                  <table className="table is-fullwidth is-hoverable is-striped">
                    <thead>
                      <tr>
                        <th>User Id</th>
                        <th>Action</th>
                        <th>Module</th>
                        <th>Entity Name</th>
                        <th>Entity Id</th>
                        <th>Details</th>
                        <th>IP Address</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAuditLogs.map((log) => (
                        <tr key={log.id}>
                          <td title={log.userId || ""}>
                            {log.userId
                              ? `${log.userId.slice(0, 8)}...`
                              : "N/A"}
                          </td>
                          <td>{log.action || "N/A"}</td>
                          <td>{log.module || "N/A"}</td>
                          <td>{log.entityName || "N/A"}</td>
                          <td title={log.entityId || ""}>
                            {log.entityId
                              ? `${log.entityId.slice(0, 8)}...`
                              : "N/A"}
                          </td>
                          <td>{log.details || "N/A"}</td>
                          <td>{log.ipAddress || "N/A"}</td>
                          <td>
                            {formatLocalDateTimeForDisplay(log.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4">
                  Showing {filteredAuditLogs.length} of {auditLogs.length} audit
                  records.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default AuditLogsPage;
