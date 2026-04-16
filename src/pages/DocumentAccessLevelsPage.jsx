import { formatLocalDateForDisplay } from "../utils/dateUtils";
import DataTable from "../components/DataTable";
import { t } from "../i18n";
import { useDocumentAccessLevelsPage } from "../hooks/useDocumentAccessLevels";

function DocumentAccessLevelsPage() {
  const {
    actionMessage,
    documentAccessLevels,
    editForm,
    error,
    handleDeactivateDocumentAccessLevel,
    handleEditFormChange,
    handleOpenEditForm,
    handleReactivateDocumentAccessLevel,
    handleUpdateDocumentAccessLevel,
    loading,
    resetEditForm,
    showEditForm,
    updatingDocumentAccessLevel,
    deactivatingDocumentAccessLevelId,
    reactivatingDocumentAccessLevelId,
  } = useDocumentAccessLevelsPage();

  const columns = [
    { key: "name", label: t("documentAccessLevels.table.name") },
    { key: "description", label: t("documentAccessLevels.table.description") },
    { key: "status", label: t("documentAccessLevels.table.status") },
    { key: "createdAt", label: t("documentAccessLevels.table.created") },
    { key: "actions", label: t("documentAccessLevels.table.actions") },
  ];

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("documentAccessLevels.title")}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {t("documentAccessLevels.subtitle")}
          </p>
        </div>

        {/* ACTION MESSAGE */}
        {actionMessage && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {actionMessage}
          </div>
        )}

        {/* EDIT FORM */}
        {showEditForm && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t("documentAccessLevels.form.editTitle")}
            </h2>

            <form
              onSubmit={handleUpdateDocumentAccessLevel}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("documentAccessLevels.form.name")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("documentAccessLevels.form.description")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    type="text"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditFormChange}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-700 disabled:opacity-70"
                  disabled={updatingDocumentAccessLevel}
                >
                  {updatingDocumentAccessLevel
                    ? t("documentAccessLevels.buttons.saving")
                    : t("documentAccessLevels.buttons.save")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-300"
                  onClick={resetEditForm}
                  disabled={updatingDocumentAccessLevel}
                >
                  {t("documentAccessLevels.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {t("documentAccessLevels.messages.loading")}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* TABLE */}
        {!loading && !error && (
          <DataTable
            columns={columns}
            hasData={documentAccessLevels.length > 0}
            emptyMessage={t("documentAccessLevels.table.noData")}
          >
            {documentAccessLevels.map((item) => (
              <tr key={item.id} className="transition hover:bg-gray-50/80">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {item.description ||
                    t("documentAccessLevels.table.noDescription")}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isActive
                      ? t("documentAccessLevels.table.active")
                      : t("documentAccessLevels.table.inactive")}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatLocalDateForDisplay(item.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                      onClick={() => handleOpenEditForm(item)}
                      disabled={!item.isActive}
                    >
                      {t("documentAccessLevels.buttons.edit")}
                    </button>

                    {item.isActive ? (
                      <button
                        className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 transition hover:bg-yellow-100"
                        onClick={() =>
                          handleDeactivateDocumentAccessLevel(item.id)
                        }
                        disabled={deactivatingDocumentAccessLevelId === item.id}
                      >
                        {deactivatingDocumentAccessLevelId === item.id
                          ? t("documentAccessLevels.buttons.processing")
                          : t("documentAccessLevels.buttons.deactivate")}
                      </button>
                    ) : (
                      <button
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
                        onClick={() =>
                          handleReactivateDocumentAccessLevel(item.id)
                        }
                        disabled={reactivatingDocumentAccessLevelId === item.id}
                      >
                        {reactivatingDocumentAccessLevelId === item.id
                          ? t("documentAccessLevels.buttons.processing")
                          : t("documentAccessLevels.buttons.reactivate")}
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

export default DocumentAccessLevelsPage;
