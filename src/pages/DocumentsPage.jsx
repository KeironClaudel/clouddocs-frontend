import { useEffect, useState } from "react";
import axios from "axios";
import {
  deactivateDocument,
  downloadDocument,
  getDocumentVersions,
  previewDocument,
  reactivateDocument,
  renameDocument,
  searchDocuments,
  uploadDocumentVersion,
} from "../services/documentService";
import { getCategories } from "../services/categoryService";
import { formatLocalDateForDisplay } from "../utils/dateUtils";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { canManageDocuments, isAdmin } from "../utils/permissionUtils";
import { getApiErrorMessage } from "../utils/errorUtils";
import DataTable from "../components/DataTable";
import { t } from "../i18n";

function DocumentsPage() {
  /**
   * Stores the document list returned by the API.
   */
  const [documents, setDocuments] = useState([]);

  /**
   * Integrates de AuthContext module for use
   */
  const { user } = useAuth();

  /**
   * Checks if current user can manage documents
   */
  const canManageDocumentActions = canManageDocuments(user);

  /**
   * Checks if the current user is admin
   */
  const adminUser = isAdmin(user);

  /**
   * Indicates whether the document request is currently in progress.
   */
  const [loading, setLoading] = useState(true);

  /**
   * Stores an error message to display when document loading fails.
   */
  const [error, setError] = useState("");

  /**
   * Stores the available versions for each document.
   * The key is the document ID and the value is an array of versions.
   */
  const [versionsByDocumentId, setVersionsByDocumentId] = useState({});

  /**
   * Stores the currently selected version ID for each document.
   */
  const [selectedVersionByDocumentId, setSelectedVersionByDocumentId] =
    useState({});

  /**
   * Tracks whether the version list for a document is being loaded.
   */
  const [versionLoadingByDocumentId, setVersionLoadingByDocumentId] = useState(
    {},
  );

  /**
   * Stores the current page number shown in the table.
   */
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Defines how many documents are shown per page.
   */
  const [pageSize] = useState(10);

  const [totalCount, setTotalCount] = useState(0);

  /**
   * Calculates the total number of pages based on the document count.
   */
  const totalPages = Math.ceil(totalCount / pageSize);

  /**
   * Stores a feedback message after document actions.
   */
  const [actionMessage, setActionMessage] = useState("");

  /**
   * Tracks which document is currently being renamed.
   */
  const [renamingDocumentId, setRenamingDocumentId] = useState(null);

  /**
   * Stores the new name value while editing a document.
   */
  const [renameValue, setRenameValue] = useState("");

  /**
   * Tracks which document is currently being deactivated.
   */
  const [deactivatingDocumentId, setDeactivatingDocumentId] = useState(null);

  /**
   * Tracks which document is currently being reactivated.
   */
  const [reactivatingDocumentId, setReactivatingDocumentId] = useState(null);

  const [filters, setFilters] = useState({
    searchTerm: "",
    categoryId: "",
    month: "",
    year: "",
    documentType: "",
    expirationPending: "",
    isActive: "",
  });

  /**
   * Stores the category list used by the filter dropdown.
   */
  const [categories, setCategories] = useState([]);

  /**
   * Defines the columns to display in the document table, including the key to access the value and the label to show in the header.
   * The "actions" column is a special case that doesn't correspond to a document property but indicates where action buttons will be rendered.
   */
  const documentTableColumns = [
    { key: "name", label: t("documents.table.name") },
    { key: "category", label: t("documents.table.category") },
    { key: "uploadedBy", label: t("documents.table.uploadedBy") },
    { key: "department", label: t("documents.table.department") },
    { key: "created", label: t("documents.table.created") },
    { key: "status", label: t("documents.table.status") },
    { key: "version", label: t("documents.table.version") },
    { key: "actions", label: t("documents.table.actions") },
  ];
  /*
  Load categories to DropDownList
   */
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();

        const normalizedCategories = Array.isArray(data)
          ? data
          : data.categories || data.items || [];

        const activeCategories = normalizedCategories.filter(
          (category) => category.isActive !== false,
        );

        setCategories(activeCategories);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }

    loadCategories();
  }, []);

  /**
   * Ensures the current page stays valid when the document list changes.
   */
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /**
   * Loads document versions only once per document when needed.
   */
  async function handleLoadVersions(documentId) {
    if (versionsByDocumentId[documentId]) {
      return;
    }

    setVersionLoadingByDocumentId((prev) => ({
      ...prev,
      [documentId]: true,
    }));

    try {
      const data = await getDocumentVersions(documentId);

      const normalizedVersions = Array.isArray(data)
        ? data
        : data.versions || data.items || [];

      setVersionsByDocumentId((prev) => ({
        ...prev,
        [documentId]: normalizedVersions,
      }));
    } catch (error) {
      console.error("Failed to load versions:", error);

      setVersionsByDocumentId((prev) => ({
        ...prev,
        [documentId]: [],
      }));
    } finally {
      setVersionLoadingByDocumentId((prev) => ({
        ...prev,
        [documentId]: false,
      }));
    }
  }

  /**
   * Stores the selected version ID for a document.
   */
  function handleVersionChange(documentId, versionId) {
    setSelectedVersionByDocumentId((prev) => ({
      ...prev,
      [documentId]: versionId,
    }));
  }

  /**
   * Opens a PDF preview in a new browser tab.
   */
  async function handlePreview(documentId) {
    try {
      const selectedVersionId = selectedVersionByDocumentId[documentId] || null;

      const blob = await previewDocument(documentId, selectedVersionId);

      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Preview failed:", error);
    }
  }

  /**
   * Forces the browser to download the file.
   */
  async function handleDownload(documentId, fileName) {
    try {
      const selectedVersionId = selectedVersionByDocumentId[documentId] || null;

      const blob = await downloadDocument(documentId, selectedVersionId);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }

  /**
   * Loads the document list when the page is rendered for the first time.
   */
  useEffect(() => {
    async function loadDocuments() {
      setLoading(true);
      setError("");

      try {
        const params = {
          page: currentPage,
          pageSize,
        };

        if (filters.searchTerm) {
          params.name = filters.searchTerm;
        }

        if (filters.categoryId) {
          params.categoryId = filters.categoryId;
        }

        if (filters.month) {
          params.month = Number(filters.month);
        }

        if (filters.year) {
          params.year = Number(filters.year);
        }

        if (filters.documentType) {
          params.documentType = Number(filters.documentType);
        }

        if (filters.expirationPending !== "") {
          params.expirationPendingDefinition =
            filters.expirationPending === "true";
        }

        /**
         * Admin users can request inactive documents too.
         */
        if (adminUser) {
          params.includeInactive = true;
        }

        const data = await searchDocuments(params);

        const items = Array.isArray(data?.items) ? data.items : [];

        setDocuments(items);
        setTotalCount(data?.totalCount || 0);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(getApiErrorMessage(err, "Failed to load documents."));
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, [currentPage, pageSize, filters]);

  /**
   * Tracks which document is currently uploading a new version.
   */
  const [uploadingVersionDocumentId, setUploadingVersionDocumentId] =
    useState(null);

  /**
   * Uploads a new version for an existing document.
   */
  async function handleUploadVersion(documentId, file) {
    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setActionMessage(t("documents.messages.onlyPdf"));
      return;
    }

    setActionMessage("");
    setUploadingVersionDocumentId(documentId);

    try {
      await uploadDocumentVersion(documentId, file);

      /**
       * Clear cached versions so the dropdown reloads updated data.
       */
      setVersionsByDocumentId((prev) => {
        const updated = { ...prev };
        delete updated[documentId];
        return updated;
      });

      /**
       * Reset selected version to Current after uploading a new one.
       */
      setSelectedVersionByDocumentId((prev) => ({
        ...prev,
        [documentId]: "",
      }));

      setActionMessage(t("documents.messages.uploadSuccess"));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("documents.messages.uploadError")),
        );
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setUploadingVersionDocumentId(null);
    }
  }

  /**
   * Moves to the previous page if possible.
   */
  function handlePreviousPage() {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }

  /**
   * Moves to the next page if possible.
   */
  function handleNextPage() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }

  /**
   * Updates a document name in local state after a successful rename.
   */
  function updateDocumentNameInState(documentId, newName) {
    setDocuments((prevDocuments) =>
      prevDocuments.map((document) =>
        document.id === documentId
          ? { ...document, originalFileName: newName }
          : document,
      ),
    );
  }

  /**
   * Marks a document as inactive in local state after a successful deactivation.
   */
  function deactivateDocumentInState(documentId) {
    setDocuments((prevDocuments) =>
      prevDocuments.map((document) =>
        document.id === documentId
          ? { ...document, isActive: false }
          : document,
      ),
    );
  }

  /**
   * Opens inline rename mode for a document.
   */
  function handleStartRename(document) {
    setActionMessage("");
    setRenamingDocumentId(document.id);
    setRenameValue(document.originalFileName);
  }

  /**
   * Cancels inline rename mode.
   */
  function handleCancelRename() {
    setRenamingDocumentId(null);
    setRenameValue("");
  }

  /**
   * Handles the rename request for a document.
   */
  async function handleConfirmRename(documentId) {
    if (!renameValue.trim()) {
      setActionMessage(t("documents.messages.emptyName"));
      return;
    }

    setActionMessage("");

    try {
      await renameDocument(documentId, renameValue.trim());
      updateDocumentNameInState(documentId, renameValue.trim());
      setActionMessage(t("documents.messages.renameSuccess"));
      handleCancelRename();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("documents.messages.renameError")),
        );
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    }
  }

  /**
   * Handles document deactivation.
   */
  async function handleDeactivateDocument(documentId) {
    setActionMessage("");
    setDeactivatingDocumentId(documentId);

    try {
      await deactivateDocument(documentId);
      deactivateDocumentInState(documentId);
      setActionMessage(t("documents.messages.deactivateSuccess"));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("documents.messages.deactivateError")),
        );
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setDeactivatingDocumentId(null);
    }
  }

  /**
   * Handles document reactivation.
   */
  async function handleReactivateDocument(documentId) {
    setActionMessage("");
    setReactivatingDocumentId(documentId);

    try {
      await reactivateDocument(documentId);

      reactivateDocumentInState(documentId);

      setActionMessage(t("documents.messages.reactivateSuccess"));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("documents.messages.reactivateError")),
        );
      } else {
        setActionMessage("An unexpected error occurred.");
      }
    } finally {
      setReactivatingDocumentId(null);
    }
  }

  /**
   * Marks a document as active in local state after reactivation.
   */
  function reactivateDocumentInState(documentId) {
    setDocuments((prevDocuments) =>
      prevDocuments.map((document) =>
        document.id === documentId ? { ...document, isActive: true } : document,
      ),
    );
  }

  /*
   * Handles filter state and resets pagination
   */
  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setCurrentPage(1);
  }
  /**
   * Clear filter options
   */
  function handleClearFilters() {
    setFilters({
      searchTerm: "",
      categoryId: "",
      month: "",
      year: "",
      documentType: "",
      expirationPending: "",
      isActive: "",
    });

    setCurrentPage(1);
  }

  /**
   * Applies the local status filter to the current page of documents.
   */
  const visibleDocuments =
    filters.isActive === ""
      ? documents
      : documents.filter(
          (document) => String(document.isActive) === filters.isActive,
        );

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
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

        {/* FILTERS */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t("documents.filters.title")}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              type="text"
              name="searchTerm"
              placeholder={t("documents.filters.search")}
              value={filters.searchTerm}
              onChange={handleFilterChange}
            />

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

            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              type="number"
              name="month"
              placeholder={t("documents.filters.month")}
              value={filters.month}
              onChange={handleFilterChange}
            />

            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              type="number"
              name="year"
              placeholder={t("documents.filters.year")}
              value={filters.year}
              onChange={handleFilterChange}
            />

            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              name="documentType"
              value={filters.documentType}
              onChange={handleFilterChange}
            >
              /* CHANGE TO RECOVER FROM BACKEND *\/
            </select>

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

            {adminUser && (
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                name="isActive"
                value={filters.isActive}
                onChange={handleFilterChange}
              >
                <option value="">{t("documents.filters.all")}</option>
                <option value="true">{t("documents.filters.active")}</option>
                <option value="false">{t("documents.filters.inactive")}</option>
              </select>
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
            {t("documents.loading")}
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("documents.error")}
          </div>
        )}

        {!loading && !error && (
          <DataTable
            columns={documentTableColumns}
            hasData={visibleDocuments.length > 0}
            emptyMessage={t("documents.empty")}
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
              <tr key={document.id} className="transition hover:bg-gray-50/80">
                <td className="px-6 py-4">
                  {renamingDocumentId === document.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                      />
                      <button
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                        onClick={() => handleConfirmRename(document.id)}
                      >
                        {t("documents.buttons.save")}
                      </button>
                      <button
                        className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                        onClick={handleCancelRename}
                      >
                        {t("documents.buttons.cancel")}
                      </button>
                    </div>
                  ) : (
                    <p className="font-medium text-gray-900">
                      {document.originalFileName}
                    </p>
                  )}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {document.categoryName}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {document.uploadedByUserName}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {document.department || "N/A"}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatLocalDateForDisplay(document.createdAt)}
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
                    {canManageDocumentActions && (
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

                    {canManageDocumentActions && (
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

                    {canManageDocumentActions &&
                      (document.isActive ? (
                        <button
                          className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 transition hover:bg-yellow-100"
                          onClick={() => handleDeactivateDocument(document.id)}
                          disabled={deactivatingDocumentId === document.id}
                        >
                          {deactivatingDocumentId === document.id
                            ? t("documents.buttons.processing")
                            : t("documents.buttons.deactivate")}
                        </button>
                      ) : (
                        <button
                          className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
                          onClick={() => handleReactivateDocument(document.id)}
                          disabled={reactivatingDocumentId === document.id}
                        >
                          {reactivatingDocumentId === document.id
                            ? t("documents.buttons.processing")
                            : t("documents.buttons.reactivate")}
                        </button>
                      ))}
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

export default DocumentsPage;
