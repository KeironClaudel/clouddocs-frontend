import { formatLocalDateForDisplay } from "../utils/dateUtils";
import DataTable from "../components/DataTable";
import { t } from "../i18n";
import { useDepartmentsPage } from "../hooks/useDepartments";

function DepartmentsPage() {
  const {
    actionMessage,
    createForm,
    creatingDepartment,
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
    resetCreateForm,
    resetEditForm,
    searchTerm,
    setShowCreateForm,
    showCreateForm,
    showEditForm,
    statusFilter,
    updatingDepartment,
    updatingDepartmentId,
  } = useDepartmentsPage();

  const departmentTableColumns = [
    { key: "name", label: t("departments.table.name") },
    { key: "description", label: t("departments.table.description") },
    { key: "status", label: t("departments.table.status") },
    { key: "createdAt", label: t("departments.table.created") },
    { key: "actions", label: t("departments.table.actions") },
  ];

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("departments.title")}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t("departments.subtitle")}
          </p>

          {actionMessage && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {actionMessage}
            </div>
          )}

          <div className="mt-4">
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              onClick={() => setShowCreateForm((prev) => !prev)}
            >
              {showCreateForm
                ? t("departments.buttons.cancel")
                : t("departments.buttons.create")}
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t("departments.form.createTitle")}
            </h2>

            <form onSubmit={handleCreateDepartment} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateFormChange}
                  placeholder={t("departments.form.name")}
                  required
                />

                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="text"
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateFormChange}
                  placeholder={t("departments.form.description")}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  disabled={creatingDepartment}
                >
                  {creatingDepartment
                    ? t("departments.buttons.creating")
                    : t("departments.buttons.create")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                  onClick={resetCreateForm}
                >
                  {t("departments.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {showEditForm && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t("departments.form.editTitle")}
            </h2>

            <form onSubmit={handleUpdateDepartment} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  placeholder={t("departments.form.name")}
                  required
                />

                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="text"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                  placeholder={t("departments.form.description")}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                  disabled={updatingDepartment}
                >
                  {updatingDepartment
                    ? t("departments.buttons.saving")
                    : t("departments.buttons.save")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                  onClick={resetEditForm}
                >
                  {t("departments.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t("departments.filters.title")}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("departments.filters.searchLabel")}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchTermChange}
                placeholder={t("departments.filters.searchPlaceholder")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("departments.filters.statusLabel")}
              </label>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">{t("departments.filters.allStatuses")}</option>
                <option value="true">{t("departments.filters.active")}</option>
                <option value="false">
                  {t("departments.filters.inactive")}
                </option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-4 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
          >
            {t("departments.filters.clear")}
          </button>
        </div>

        {loading && (
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {t("departments.messages.loading")}
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <DataTable
            columns={departmentTableColumns}
            hasData={filteredDepartments.length > 0}
            emptyMessage={t("departments.table.noData")}
          >
            {filteredDepartments.map((departmentItem) => (
              <tr
                key={departmentItem.id}
                className="transition hover:bg-gray-50/80"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {departmentItem.name}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {departmentItem.description ||
                    t("departments.table.noDescription")}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      departmentItem.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {departmentItem.isActive
                      ? t("departments.table.active")
                      : t("departments.table.inactive")}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatLocalDateForDisplay(departmentItem.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      onClick={() => handleOpenEditForm(departmentItem)}
                      disabled={updatingDepartmentId === departmentItem.id}
                    >
                      {t("departments.buttons.edit")}
                    </button>

                    {departmentItem.isActive ? (
                      <button
                        className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                        onClick={() =>
                          handleDeactivateDepartment(departmentItem.id)
                        }
                        disabled={updatingDepartmentId === departmentItem.id}
                      >
                        {updatingDepartmentId === departmentItem.id
                          ? t("departments.buttons.processing")
                          : t("departments.buttons.deactivate")}
                      </button>
                    ) : (
                      <button
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                        onClick={() =>
                          handleReactivateDepartment(departmentItem.id)
                        }
                        disabled={updatingDepartmentId === departmentItem.id}
                      >
                        {updatingDepartmentId === departmentItem.id
                          ? t("departments.buttons.processing")
                          : t("departments.buttons.reactivate")}
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

export default DepartmentsPage;
