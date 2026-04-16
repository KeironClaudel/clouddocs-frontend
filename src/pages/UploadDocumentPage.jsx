import { t } from "../i18n";
import { useUploadDocument } from "../hooks/useUploadDocument";
import ClientAutocomplete from "../components/ClientAutocomplete";
function UploadDocumentPage() {
  const {
    categories,
    departments,
    documentAccessLevels,
    documentTypes,
    error,
    form,
    handleDepartmentToggle,
    handleFileChange,
    handleInputChange,
    handleSubmit,
    isDepartmentOnly,
    loadingCategories,
    loadingDepartments,
    resetForm,
    selectedFile,
    successMessage,
    uploading,
    clientOptions,
    clientSearchTerm,
    searchingClients,
    setClientSearchTerm,
  } = useUploadDocument();

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("uploadDocument.title")}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t("uploadDocument.subtitle")}
          </p>
        </div>

        {/* MESSAGES */}
        {successMessage && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* FILE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("uploadDocument.form.file")}
              </label>

              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                disabled={uploading}
                required
              />

              {selectedFile && (
                <p className="mt-2 text-sm text-green-600">
                  {t("uploadDocument.form.selectedFile")}: {selectedFile.name}
                </p>
              )}
            </div>

            {/* CLIENT */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("uploadDocument.form.client")}
              </label>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <ClientAutocomplete
                  searchTerm={clientSearchTerm}
                  setSearchTerm={setClientSearchTerm}
                  options={clientOptions}
                  loading={searchingClients}
                  selectedClientId={form.clientId}
                  onSelectClient={(client) =>
                    handleInputChange({
                      target: {
                        name: "clientId",
                        value: client.id,
                      },
                    })
                  }
                />
              </div>

              {searchingClients && (
                <p className="mt-2 text-sm text-gray-500">
                  {t("uploadDocument.messages.searchingClients")}
                </p>
              )}

              {!searchingClients &&
                clientSearchTerm.trim() &&
                clientOptions.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    {t("uploadDocument.messages.noClientsFound")}
                  </p>
                )}
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* CATEGORY */}
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                name="categoryId"
                value={form.categoryId}
                onChange={handleInputChange}
                disabled={loadingCategories || uploading}
                required
              >
                <option value="">{t("uploadDocument.form.category")}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* TYPE */}
              <select
                name="documentTypeId"
                value={form.documentTypeId}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                disabled={uploading}
                required
              >
                <option value="">
                  {t("uploadDocument.form.documentType")}
                </option>

                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>

              {/* ACCESS */}
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                name="accessLevelId"
                value={form.accessLevelId}
                onChange={handleInputChange}
                disabled={uploading}
                required
              >
                <option value="">{t("uploadDocument.form.accessLevel")}</option>
                {documentAccessLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>

              {/* EXP DATE */}
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                type="date"
                name="expirationDate"
                value={form.expirationDate}
                onChange={handleInputChange}
                disabled={uploading || form.expirationDatePendingDefinition}
              />
            </div>

            {/* VISIBLE DEPARTMENTS */}
            {isDepartmentOnly && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t("uploadDocument.form.visibleDepartments")}
                </label>

                <div className="rounded-lg border border-gray-300 p-3">
                  {loadingDepartments ? (
                    <p className="text-sm text-gray-500">
                      {t("uploadDocument.messages.loadingDepartments")}
                    </p>
                  ) : departments.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      {t("uploadDocument.messages.noDepartments")}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {departments.map((department) => (
                        <label
                          key={department.id}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={form.departmentIds.includes(department.id)}
                            onChange={() =>
                              handleDepartmentToggle(department.id)
                            }
                            disabled={uploading}
                            className="h-4 w-4"
                          />
                          <span>{department.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CHECKBOX */}
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="expirationDatePendingDefinition"
                checked={form.expirationDatePendingDefinition}
                onChange={handleInputChange}
                disabled={uploading}
                className="h-4 w-4"
              />
              {t("uploadDocument.form.expirationPending")}
            </label>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                disabled={uploading || loadingCategories}
              >
                {uploading
                  ? t("uploadDocument.buttons.uploading")
                  : t("uploadDocument.buttons.submit")}
              </button>

              <button
                type="button"
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-300"
                onClick={resetForm}
                disabled={uploading}
              >
                {t("uploadDocument.buttons.reset")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default UploadDocumentPage;
