import { useEffect, useMemo, useState } from "react";
import { getAuditLogs } from "../services/auditService";
import { formatLocalDateTimeForDisplay } from "../utils/dateUtils";
import DataTable from "../components/DataTable";
import { useSearchParams } from "react-router-dom";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";

function AuditLogsPage() {
  /**
   * Stores the audit log list returned by the API.
   */
  const [auditLogs, setAuditLogs] = useState([]);

  /**
   * Pagination state.
   */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  /**
   * Stores URL search parameters.
   */
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Stores the current filter values for the audit table.
   */
  const [filters, setFilters] = useState({
    userId: "",
    action: "",
    module: "",
    date: "",
  });

  /**
   * Debounced filters used for API requests.
   */
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  /**
   * Indicates whether audit logs are currently loading.
   */
  const [loading, setLoading] = useState(true);

  /**
   * Stores a page-level error message.
   */
  const [error, setError] = useState("");

  /**
   * Defines the columns displayed in the audit log table.
   */
  const auditLogTableColumns = [
    { key: "userId", label: t("auditLogs.table.userId") },
    { key: "action", label: t("auditLogs.table.action") },
    { key: "module", label: t("auditLogs.table.module") },
    { key: "entityName", label: t("auditLogs.table.entity") },
    { key: "entityId", label: t("auditLogs.table.entityId") },
    { key: "details", label: t("auditLogs.table.details") },
    { key: "ipAddress", label: t("auditLogs.table.ip") },
    { key: "date", label: t("auditLogs.table.date") },
  ];

  /**
   * Calculates total pages based on backend metadata.
   */
  const totalPages = Math.ceil(totalCount / pageSize);

  /**
   * Loads audit logs from the backend using pagination and filters.
   */
  async function loadAuditLogs({
    pageParam,
    filtersParam,
    pageSizeParam,
  } = {}) {
    try {
      setLoading(true);
      setError("");

      const effectivePage = pageParam ?? 1;
      const effectiveFilters = filtersParam ?? debouncedFilters;
      const effectivePageSize = pageSizeParam ?? pageSize;

      const params = {
        page: effectivePage,
        pageSize: effectivePageSize,
        userId: effectiveFilters.userId || undefined,
        action: effectiveFilters.action || undefined,
        module: effectiveFilters.module || undefined,
        date: effectiveFilters.date || undefined,
      };

      const data = await getAuditLogs(params);

      setAuditLogs(data.items || []);
      setPage(data.page || effectivePage);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(getApiErrorMessage(err, t("auditLogs.loadError")));
    } finally {
      setLoading(false);
    }
  }

  /**
   * Debounces filters to avoid sending a request on every keystroke/change immediately.
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 400);

    return () => clearTimeout(timeout);
  }, [filters]);

  /**
   * Syncs API loading with URL page and debounced filters.
   * This is the single source of truth for fetching data.
   */
  useEffect(() => {
    const pageFromUrl = Number(searchParams.get("page")) || 1;

    loadAuditLogs({
      pageParam: pageFromUrl,
      filtersParam: debouncedFilters,
      pageSizeParam: pageSize,
    });
  }, [searchParams, debouncedFilters, pageSize]);

  /**
   * Moves to the next page by updating the URL.
   */
  function handleNextPage() {
    const currentPage = Number(searchParams.get("page")) || 1;

    if (currentPage < totalPages) {
      setSearchParams({ page: String(currentPage + 1) });
    }
  }

  /**
   * Moves to the previous page by updating the URL.
   */
  function handlePreviousPage() {
    const currentPage = Number(searchParams.get("page")) || 1;

    if (currentPage > 1) {
      setSearchParams({ page: String(currentPage - 1) });
    }
  }

  /**
   * Updates audit filter state when an input changes.
   * Resets pagination back to page 1.
   */
  function handleFilterChange(e) {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSearchParams({ page: "1" });
  }

  /**
   * Clears all audit filters and resets pagination.
   */
  function handleClearFilters() {
    setFilters({
      userId: "",
      action: "",
      module: "",
      date: "",
    });

    setSearchParams({ page: "1" });
  }

  /**
   * Builds unique user ID options from currently loaded logs.
   */
  const userOptions = useMemo(() => {
    return [...new Set(auditLogs.map((log) => log.userId))]
      .filter(Boolean)
      .sort();
  }, [auditLogs]);

  /**
   * Builds unique action options from currently loaded logs.
   */
  const actionOptions = useMemo(() => {
    return [...new Set(auditLogs.map((log) => log.action))]
      .filter(Boolean)
      .sort();
  }, [auditLogs]);

  /**
   * Builds unique module options from currently loaded logs.
   */
  const moduleOptions = useMemo(() => {
    return [...new Set(auditLogs.map((log) => log.module))]
      .filter(Boolean)
      .sort();
  }, [auditLogs]);

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("auditLogs.title")}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {t("auditLogs.subtitle")}
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t("auditLogs.filters")}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
            >
              <option value="">{t("auditLogs.allUsers")}</option>
              {userOptions.map((userId) => (
                <option key={userId} value={userId}>
                  {userId}
                </option>
              ))}
            </select>

            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
            >
              <option value="">{t("auditLogs.allActions")}</option>
              {actionOptions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>

            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              name="module"
              value={filters.module}
              onChange={handleFilterChange}
            >
              <option value="">{t("auditLogs.allModules")}</option>
              {moduleOptions.map((module) => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>

            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>

          <button
            type="button"
            className="mt-4 rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
            onClick={handleClearFilters}
          >
            {t("auditLogs.clearFilters")}
          </button>
        </div>

        {loading && (
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {t("auditLogs.loading")}
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <DataTable
            columns={auditLogTableColumns}
            hasData={auditLogs.length > 0}
            emptyMessage={t("auditLogs.empty")}
            footer={
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <p>
                    {t("auditLogs.showing")} {auditLogs.length}{" "}
                    {t("auditLogs.of")} {totalCount} {t("auditLogs.records")}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {t("auditLogs.pageSize")}
                    </span>

                    <select
                      value={pageSize}
                      onChange={(e) => {
                        const newSize = Number(e.target.value);
                        setPageSize(newSize);
                        setSearchParams({ page: "1" });
                      }}
                      className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
                  >
                    {t("auditLogs.prev")}
                  </button>

                  <span className="text-sm text-gray-600">
                    {t("auditLogs.page")} {page} {t("auditLogs.of")}{" "}
                    {totalPages || 1}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={page === totalPages || totalPages === 0}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
                  >
                    {t("auditLogs.next")}
                  </button>
                </div>
              </div>
            }
          >
            {auditLogs.map((log) => (
              <tr key={log.id} className="transition hover:bg-gray-50/80">
                <td
                  className="px-6 py-4 text-gray-700"
                  title={log.userId || ""}
                >
                  {log.userId
                    ? `${log.userId.slice(0, 8)}...`
                    : t("auditLogs.table.notAvailable")}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {log.action || t("auditLogs.table.notAvailable")}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {log.module || t("auditLogs.table.notAvailable")}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {log.entityName || t("auditLogs.table.notAvailable")}
                </td>

                <td
                  className="px-6 py-4 text-gray-700"
                  title={log.entityId || ""}
                >
                  {log.entityId
                    ? `${log.entityId.slice(0, 8)}...`
                    : t("auditLogs.table.notAvailable")}
                </td>

                <td className="max-w-[220px] truncate px-6 py-4 text-gray-600">
                  {log.details || t("auditLogs.table.notAvailable")}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {log.ipAddress || t("auditLogs.table.notAvailable")}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatLocalDateTimeForDisplay(log.createdAt)}
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </div>
    </section>
  );
}

export default AuditLogsPage;
