import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  canRenameDocuments,
  canUploadDocumentVersions,
  canDeactivateDocuments,
  canEditDocumentVisibility,
} from "../utils/permissionUtils";
import { formatLocalDateForDisplay } from "../utils/dateUtils";
import DataTable from "../components/DataTable";
import { t } from "../i18n";
import { useDocumentsPage } from "../hooks/useDocuments";
import DocumentVisibilityEditorRow from "../components/DocumentVisibilityEditorRow";
import ClientAutocomplete from "../components/ClientAutocomplete";
import SendToClientModal from "../components/SendToClientModal";
import { getDocumentTableColumns } from "../config/documentTableConfig";

function DocumentsPage() {
  const { user } = useAuth();

  const {
    actionMessage,
    categories,
    clientOptions,
    clientSearchTerm,
    currentPage,
    deactivatingDocumentId,
    departments,
    documentAccessLevels,
    documentTypes,
    editingVisibilityDocumentId,
    error,
    filters,
    handleCancelEditVisibility,
    handleCancelRename,
    handleClearFilters,
    handleClientSearchChange,
    handleConfirmRename,
    handleDeactivateDocument,
    handleDownload,
    handleFilterChange,
    handleLoadVersions,
    handleNextPage,
    handlePreview,
    handlePreviousPage,
    handleReactivateDocument,
    handleSaveVisibility,
    handleStartEditVisibility,
    handleStartRename,
    handleUploadVersion,
    handleVersionChange,
    handleVisibilityDepartmentToggle,
    isVisibilityDepartmentOnly,
    loading,
    reactivatingDocumentId,
    renameValue,
    renamingDocumentId,
    searchingClients,
    selectedVersionByDocumentId,
    setRenameValue,
    setVisibilityForm,
    totalCount,
    totalPages,
    updatingVisibility,
    uploadingVersionDocumentId,
    versionLoadingByDocumentId,
    versionsByDocumentId,
    visibleDocuments,
    visibilityForm,
    handleCloseSendToClientModal,
    handleConfirmSendToClient,
    handleOpenSendToClientModal,
    handleSendToClientFormChange,
    sendToClientForm,
    sendToClientModalDocument,
    sendingToClientDocumentId,
  } = useDocumentsPage(user);

  const canRename = canRenameDocuments(user);
  const canUploadVersion = canUploadDocumentVersions(user);
  const canDeactivate = canDeactivateDocuments(user);
  const canEditVisibility = canEditDocumentVisibility(user);

  const documentTableColumns = getDocumentTableColumns(t);

  function renderExpirationDate(document) {
    if (document.expirationDate) {
      return formatLocalDateForDisplay(document.expirationDate);
    }

    if (document.expirationDatePendingDefinition) {
      return t("documents.table.expirationPending");
    }

    return t("documents.table.notAvailable");
  }

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("documents.title")}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {t("documents.subtitle")}
            </p>
          </div>

          <Link
            to="/documents/upload"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {t("documents.buttons.upload")}
          </Link>
        </div>
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t("documents.filters.title")}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("documents.filters.searchLabel")}
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                type="text"
                name="searchTerm"
                placeholder={t("documents.filters.search")}
                value={filters.searchTerm}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("documents.filters.clientLabel")}
              </label>

              <ClientAutocomplete
                searchTerm={clientSearchTerm}
                setSearchTerm={handleClientSearchChange}
                options={clientOptions}
                loading={searchingClients}
                selectedClientId={filters.clientId || ""}
                onSelectClient={(client) =>
                  handleFilterChange({
                    target: {
                      name: "clientId",
                      value: client.id,
                    },
                  })
                }
                placeholder={t("documents.filters.searchClient")}
                emptyText={t("documents.filters.noClientsFound")}
                loadingText={t("documents.filters.searchingClients")}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("documents.filters.categoryLabel")}
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
              >
                <option value="">{t("documents.filters.allCategories")}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("documents.filters.monthLabel")}
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                type="number"
                name="month"
                placeholder={t("documents.filters.month")}
                value={filters.month}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("documents.filters.yearLabel")}
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                type="number"
                name="year"
                placeholder={t("documents.filters.year")}
                value={filters.year}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("documents.filters.typeLabel")}
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                name="documentType"
                value={filters.documentType}
                onChange={handleFilterChange}
              >
                <option value="">{t("documents.filters.allTypes")}</option>
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("documents.filters.expirationLabel")}
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                name="expirationPending"
                value={filters.expirationPending}
                onChange={handleFilterChange}
              >
                <option value="">{t("documents.filters.all")}</option>
                <option value="true">{t("documents.filters.pending")}</option>
                <option value="false">{t("documents.filters.defined")}</option>
              </select>
            </div>

            {canRename && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t("documents.filters.statusLabel")}
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="isActive"
                  value={filters.isActive}
                  onChange={handleFilterChange}
                >
                  <option value="">{t("documents.filters.all")}</option>
                  <option value="true">{t("documents.filters.active")}</option>
                  <option value="false">
                    {t("documents.filters.inactive")}
                  </option>
                </select>
              </div>
            )}
          </div>

          <button
            className="mt-4 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
            onClick={handleClearFilters}
          >
            {t("documents.filters.clear")}
          </button>
        </div>
        {actionMessage && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {actionMessage}
          </div>
        )}
        {loading && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {t("documents.messages.loading")}
          </div>
        )}
        {!loading && error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {!loading && !error && (
          <DataTable
            columns={documentTableColumns}
            hasData={visibleDocuments.length > 0}
            emptyMessage={t("documents.table.noData")}
            footer={
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p>
                  {t("documents.pagination.showing")} {visibleDocuments.length}{" "}
                  {t("documents.pagination.of")} {totalCount}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("documents.pagination.prev")}
                  </button>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("documents.pagination.next")}
                  </button>
                </div>
              </div>
            }
          >
            {visibleDocuments.map((document) => (
              <Fragment key={document.id}>
                <tr className="transition hover:bg-gray-50/80">
                  <td className="px-6 py-4 align-middle">
                    {renamingDocumentId === document.id ? (
                      <div className="flex min-w-[220px] flex-col gap-2">
                        <input
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                        />

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                            onClick={() => handleConfirmRename(document.id)}
                          >
                            {t("documents.buttons.save")}
                          </button>

                          <button
                            type="button"
                            className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                            onClick={handleCancelRename}
                          >
                            {t("documents.buttons.cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900">
                        {document.originalFileName}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {document.clientName || t("documents.table.notAvailable")}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {document.categoryName}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {document.uploadedByUserName}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {document.department || t("documents.table.notAvailable")}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {document.documentTypeName}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {formatLocalDateForDisplay(document.createdAt)}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {renderExpirationDate(document)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        document.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {document.isActive
                        ? t("documents.table.active")
                        : t("documents.table.inactive")}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      value={selectedVersionByDocumentId[document.id] || ""}
                      onMouseDown={() => handleLoadVersions(document.id)}
                      onChange={(e) =>
                        handleVersionChange(document.id, e.target.value)
                      }
                    >
                      <option value="">{t("documents.table.current")}</option>
                      {versionLoadingByDocumentId[document.id] && (
                        <option value="" disabled>
                          {t("documents.table.loadingVersions")}
                        </option>
                      )}

                      {(versionsByDocumentId[document.id] || []).map((v) => (
                        <option key={v.id} value={v.id}>
                          {`v${v.versionNumber} - ${formatLocalDateForDisplay(v.createdAt)}`}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {canRename && (
                        <button
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                          onClick={() => handleStartRename(document)}
                          disabled={
                            !document.isActive ||
                            renamingDocumentId === document.id
                          }
                        >
                          {t("documents.buttons.rename")}
                        </button>
                      )}

                      {canUploadVersion && (
                        <>
                          <input
                            id={`upload-version-${document.id}`}
                            type="file"
                            accept="application/pdf,.pdf"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                handleUploadVersion(document.id, file);
                              }
                              event.target.value = "";
                            }}
                          />

                          <label
                            htmlFor={`upload-version-${document.id}`}
                            className={`cursor-pointer rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-100 ${
                              uploadingVersionDocumentId === document.id
                                ? "pointer-events-none opacity-50"
                                : ""
                            }`}
                          >
                            {uploadingVersionDocumentId === document.id
                              ? t("documents.buttons.uploading")
                              : t("documents.buttons.uploadVersion")}
                          </label>
                        </>
                      )}

                      <button
                        className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 transition hover:bg-cyan-100"
                        onClick={() => handlePreview(document.id)}
                        disabled={!document.isActive}
                      >
                        {t("documents.buttons.preview")}
                      </button>

                      <button
                        className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
                        onClick={() =>
                          handleDownload(document.id, document.originalFileName)
                        }
                        disabled={!document.isActive}
                      >
                        {t("documents.buttons.download")}
                      </button>

                      <button
                        className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                        onClick={() => handleOpenSendToClientModal(document)}
                        disabled={
                          !document.isActive ||
                          !document.clientName ||
                          sendingToClientDocumentId === document.id
                        }
                      >
                        {sendingToClientDocumentId === document.id
                          ? t("documents.buttons.sendingToClient")
                          : t("documents.buttons.sendToClient")}
                      </button>

                      {canDeactivate &&
                        (document.isActive ? (
                          <button
                            className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 transition hover:bg-yellow-100"
                            onClick={() =>
                              handleDeactivateDocument(document.id)
                            }
                            disabled={deactivatingDocumentId === document.id}
                          >
                            {deactivatingDocumentId === document.id
                              ? t("documents.buttons.processing")
                              : t("documents.buttons.deactivate")}
                          </button>
                        ) : (
                          <button
                            className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
                            onClick={() =>
                              handleReactivateDocument(document.id)
                            }
                            disabled={reactivatingDocumentId === document.id}
                          >
                            {reactivatingDocumentId === document.id
                              ? t("documents.buttons.processing")
                              : t("documents.buttons.reactivate")}
                          </button>
                        ))}

                      {canEditVisibility && (
                        <button
                          className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 transition hover:bg-purple-100"
                          onClick={() => handleStartEditVisibility(document)}
                          disabled={!document.isActive}
                        >
                          {t("documents.buttons.editVisibility")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {editingVisibilityDocumentId === document.id && (
                  <DocumentVisibilityEditorRow
                    colSpan={documentTableColumns.length}
                    departments={departments}
                    documentAccessLevels={documentAccessLevels}
                    documentId={document.id}
                    handleCancelEditVisibility={handleCancelEditVisibility}
                    handleSaveVisibility={handleSaveVisibility}
                    handleVisibilityDepartmentToggle={
                      handleVisibilityDepartmentToggle
                    }
                    isVisibilityDepartmentOnly={isVisibilityDepartmentOnly}
                    setVisibilityForm={setVisibilityForm}
                    updatingVisibility={updatingVisibility}
                    visibilityForm={visibilityForm}
                  />
                )}
              </Fragment>
            ))}
          </DataTable>
        )}
        {/* MODAL */}
        {sendToClientModalDocument && (
          <SendToClientModal
            documentName={sendToClientModalDocument.originalFileName}
            clientName={sendToClientModalDocument.clientName}
            subject={sendToClientForm.subject}
            message={sendToClientForm.message}
            onSubjectChange={(value) =>
              handleSendToClientFormChange("subject", value)
            }
            onMessageChange={(value) =>
              handleSendToClientFormChange("message", value)
            }
            onCancel={handleCloseSendToClientModal}
            onConfirm={handleConfirmSendToClient}
            sending={sendingToClientDocumentId === sendToClientModalDocument.id}
          />
        )}
      </div>
    </section>
  );
}

export default DocumentsPage;
