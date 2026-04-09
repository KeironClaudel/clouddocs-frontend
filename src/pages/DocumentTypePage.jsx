import { formatLocalDateForDisplay } from "../utils/dateUtils";
import DataTable from "../components/DataTable";
import { t } from "../i18n";
import { useDocumentTypesPage } from "../hooks/useDocumentTypes";

function DocumentTypesPage() {
  const {
    actionMessage,
    createForm,
    creatingDocumentType,
    deactivatingDocumentTypeId,
    documentTypes,
    editForm,
    error,
    handleCreateDocumentType,
    handleCreateFormChange,
    handleDeactivateDocumentType,
    handleEditFormChange,
    handleOpenEditForm,
    handleReactivateDocumentType,
    handleUpdateDocumentType,
    loading,
    reactivatingDocumentTypeId,
    resetCreateForm,
    resetEditForm,
    setShowCreateForm,
    showCreateForm,
    showEditForm,
    updatingDocumentType,
  } = useDocumentTypesPage();

  const documentTypeTableColumns = [
    { key: "name", label: t("documentTypes.table.name") },
    { key: "description", label: t("documentTypes.table.description") },
    { key: "status", label: t("documentTypes.table.status") },
    { key: "createdAt", label: t("documentTypes.table.created") },
    { key: "actions", label: t("documentTypes.table.actions") },
  ];

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("documentTypes.title")}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {t("documentTypes.subtitle")}
          </p>

          <div className="mt-4">
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              onClick={() => setShowCreateForm((prev) => !prev)}
            >
              {showCreateForm
                ? t("documentTypes.buttons.cancel")
                : t("documentTypes.buttons.create")}
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {actionMessage}
          </div>
        )}

        {showCreateForm && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t("documentTypes.form.createTitle")}
            </h2>

            <form onSubmit={handleCreateDocumentType} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("documentTypes.form.name")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="name"
                    value={createForm.name}
                    onChange={handleCreateFormChange}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("documentTypes.form.description")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="description"
                    value={createForm.description}
                    onChange={handleCreateFormChange}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:opacity-70"
                  disabled={creatingDocumentType}
                >
                  {creatingDocumentType
                    ? t("documentTypes.buttons.creating")
                    : t("documentTypes.buttons.create")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-300"
                  onClick={resetCreateForm}
                  disabled={creatingDocumentType}
                >
                  {t("documentTypes.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {showEditForm && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t("documentTypes.form.editTitle")}
            </h2>

            <form onSubmit={handleUpdateDocumentType} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("documentTypes.form.name")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("documentTypes.form.description")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-700"
                  disabled={updatingDocumentType}
                >
                  {updatingDocumentType
                    ? t("documentTypes.buttons.saving")
                    : t("documentTypes.buttons.save")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-300"
                  onClick={resetEditForm}
                  disabled={updatingDocumentType}
                >
                  {t("documentTypes.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {t("documentTypes.messages.loading")}
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <DataTable
            columns={documentTypeTableColumns}
            hasData={documentTypes.length > 0}
            emptyMessage={t("documentTypes.table.noData")}
          >
            {documentTypes.map((documentType) => (
              <tr
                key={documentType.id}
                className="transition hover:bg-gray-50/80"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {documentType.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {documentType.description ||
                    t("documentTypes.table.noDescription")}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      documentType.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {documentType.isActive
                      ? t("documentTypes.table.active")
                      : t("documentTypes.table.inactive")}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatLocalDateForDisplay(documentType.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      onClick={() => handleOpenEditForm(documentType)}
                      disabled={!documentType.isActive}
                    >
                      {t("documentTypes.buttons.edit")}
                    </button>

                    {documentType.isActive ? (
                      <button
                        className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                        onClick={() =>
                          handleDeactivateDocumentType(documentType.id)
                        }
                        disabled={
                          deactivatingDocumentTypeId === documentType.id
                        }
                      >
                        {deactivatingDocumentTypeId === documentType.id
                          ? t("documentTypes.buttons.processing")
                          : t("documentTypes.buttons.deactivate")}
                      </button>
                    ) : (
                      <button
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                        onClick={() =>
                          handleReactivateDocumentType(documentType.id)
                        }
                        disabled={
                          reactivatingDocumentTypeId === documentType.id
                        }
                      >
                        {reactivatingDocumentTypeId === documentType.id
                          ? t("documentTypes.buttons.processing")
                          : t("documentTypes.buttons.reactivate")}
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

export default DocumentTypesPage;
