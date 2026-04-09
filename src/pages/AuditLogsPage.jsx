import { formatLocalDateTimeForDisplay } from "../utils/dateUtils";
import DataTable from "../components/DataTable";
import { t } from "../i18n";
import { useAuditLogs } from "../hooks/useAuditLogs";

function AuditLogsPage() {
  const {
    actionOptions,
    auditLogTableColumns,
    auditLogs,
    error,
    filters,
    handleClearFilters,
    handleFilterChange,
    handleNextPage,
    handlePreviousPage,
    loading,
    moduleOptions,
    page,
    pageSize,
    setPageSize,
    setSearchParams,
    totalCount,
    totalPages,
    userOptions,
  } = useAuditLogs();

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
