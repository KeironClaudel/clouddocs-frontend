import { useEffect, useState, Fragment } from "react";
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
  updateDocumentVisibility,
} from "../services/documentService";
import { getDepartments } from "../services/departmentService";
import { getDocumentTypes } from "../services/documentTypeService";
import { getCategories } from "../services/categoryService";
import { formatLocalDateForDisplay } from "../utils/dateUtils";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { canManageAdminPanels, isAdmin } from "../utils/permissionUtils";
import { getApiErrorMessage } from "../utils/errorUtils";
import { getDocumentAccessLevels } from "../services/documentAccessLevelService";
import DataTable from "../components/DataTable";
import { t } from "../i18n";

function DocumentsPage() {
  /**
   * Defines the columns to display in the document table, including the key to access the value and the label to show in the header.
   * The "actions" column is a special case that doesn't correspond to a document property but indicates where action buttons will be rendered.
   */
  const documentTableColumns = [
    { key: "name", label: t("documents.table.name") },
    { key: "category", label: t("documents.table.category") },
    { key: "uploadedBy", label: t("documents.table.uploadedBy") },
    { key: "department", label: t("documents.table.department") },
    { key: "documentType", label: t("documents.table.type") },
    { key: "created", label: t("documents.table.created") },
    { key: "status", label: t("documents.table.status") },
    { key: "version", label: t("documents.table.version") },
    { key: "actions", label: t("documents.table.actions") },
  ];

  /**
   * Stores the document list returned by the API.
   */
  const [documents, setDocuments] = useState([]);

  /**
   * Integrates de AuthContext module for use
   */
  const { user } = useAuth();

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

  /*
   * Tracks which document is currently editing visibility settings.
   */
  const [editingVisibilityDocumentId, setEditingVisibilityDocumentId] =
    useState(null);

  /*
   * Stores the visibility form state for the document being edited, including access level and department associations.
   */

  const [visibilityForm, setVisibilityForm] = useState({
    accessLevelId: "",
    departmentIds: [],
  });

  /*
   * Tracks whether the visibility update request is in progress for a document.
   */

  const [updatingVisibility, setUpdatingVisibility] = useState(false);

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
   * Stores the document access levels used for visibility settings, loaded from the API to populate dropdowns and determine behavior in the visibility form.
   */
  const [documentAccessLevels, setDocumentAccessLevels] = useState([]);

  /**
   * Stores departments for the visibility settings form and other parts of the UI that require department information, loaded from the API to populate dropdowns and determine behavior in the visibility form.
   */

  const [departments, setDepartments] = useState([]);

  /**
   * Applies the local status filter to the current page of documents.
   */
  const visibleDocuments =
    filters.isActive === ""
      ? documents
      : documents.filter(
          (document) => String(document.isActive) === filters.isActive,
        );

  /**
   * Stores the category list used by the filter dropdown.
   */
  const [categories, setCategories] = useState([]);

  /**
   * Stores the document type list used by dropdown.
   */
  const [documentTypes, setDocumentTypes] = useState([]);

  /**
   * Stores the document access levels used for visibility settings.
   */
  const selectedVisibilityAccessLevel = documentAccessLevels.find(
    (level) => String(level.id) === String(visibilityForm.accessLevelId),
  );

  /**
   * Stores the document access levels used for visibility settings.
   */

  const isVisibilityDepartmentOnly =
    selectedVisibilityAccessLevel?.code === "DEPARTMENT_ONLY";

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
   * Load document types to DropDownList
   */
  useEffect(() => {
    async function loadDocumentTypes() {
      try {
        const data = await getDocumentTypes();

        const normalized = Array.isArray(data)
          ? data
          : data.documentTypes || data.items || [];

        const activeTypes = normalized.filter(
          (type) => type.isActive !== false,
        );

        setDocumentTypes(activeTypes);
      } catch (err) {
        console.error("Failed to load document types:", err);
      }
    }

    loadDocumentTypes();
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
   * Loads document access levels for the visibility settings form.
   */
  useEffect(() => {
    async function loadDocumentAccessLevels() {
      try {
        const data = await getDocumentAccessLevels();

        const normalized = Array.isArray(data)
          ? data
          : data.documentAccessLevels || data.items || [];

        const activeAccessLevels = normalized.filter(
          (level) => level.isActive !== false,
        );

        setDocumentAccessLevels(activeAccessLevels);
      } catch (err) {
        console.error("Failed to load document access levels:", err);
      }
    }

    loadDocumentAccessLevels();
  }, []);

  /**
   * Loads departments for the visibility settings form and other parts of the UI that require department information.
   */
  useEffect(() => {
    async function loadDepartments() {
      try {
        const data = await getDepartments();

        const normalized = Array.isArray(data)
          ? data
          : data.departments || data.items || [];

        const activeDepartments = normalized.filter(
          (department) => department.isActive !== false,
        );

        setDepartments(activeDepartments);
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    }

    loadDepartments();
  }, []);

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
          params.documentTypeId = filters.documentType;
        }

        if (filters.expirationPending !== "") {
          params.expirationPendingDefinition =
            filters.expirationPending === "true";
        }

        /**
         * Admin users can request inactive documents too.
         */
        if (isAdmin(user)) {
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
   * Opens the visibility settings form for a document and loads its current settings into the form state.
   */
  function handleStartEditVisibility(document) {
    setActionMessage("");
    setEditingVisibilityDocumentId(document.id);

    setVisibilityForm({
      accessLevelId: document.accessLevelId || "",
      departmentIds: Array.isArray(document.visibleDepartments)
        ? document.visibleDepartments.map((d) => d.id)
        : [],
    });
  }

  /**
   * Toggles the selection of a department for visibility settings.
   */
  function handleVisibilityDepartmentToggle(departmentId) {
    setVisibilityForm((prev) => {
      const exists = prev.departmentIds.includes(departmentId);

      return {
        ...prev,
        departmentIds: exists
          ? prev.departmentIds.filter((id) => id !== departmentId)
          : [...prev.departmentIds, departmentId],
      };
    });
  }

  /*
   * Saves the updated visibility settings for a document and handles API interaction and local state updates.
   */

  async function handleSaveVisibility(documentId) {
    if (!visibilityForm.accessLevelId) {
      setActionMessage("Selecciona un nivel de acceso.");
      return;
    }

    if (
      selectedVisibilityAccessLevel?.code === "DEPARTMENT_ONLY" &&
      visibilityForm.departmentIds.length === 0
    ) {
      setActionMessage("Selecciona al menos un departamento.");
      return;
    }

    setUpdatingVisibility(true);
    setActionMessage("");

    try {
      await updateDocumentVisibility(documentId, {
        accessLevelId: visibilityForm.accessLevelId,
        departmentIds:
          selectedVisibilityAccessLevel?.code === "DEPARTMENT_ONLY"
            ? visibilityForm.departmentIds
            : [],
      });

      setActionMessage("Visibilidad actualizada correctamente.");
      setEditingVisibilityDocumentId(null);

      // opcional: recargar lista completa
      setCurrentPage((prev) => prev);

      // o actualizar local state si el backend devuelve el documento actualizado
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, "Error al actualizar la visibilidad."),
        );
      } else {
        setActionMessage("Ocurrió un error inesperado.");
      }
    } finally {
      setUpdatingVisibility(false);
    }
  }

  /**
   * Cancels visibility editing mode and resets the form state.
   */
  function handleCancelEditVisibility() {
    setEditingVisibilityDocumentId(null);
    setVisibilityForm({
      accessLevelId: "",
      departmentIds: [],
    });
  }

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

            {canManageAdminPanels && (
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
              <Fragment key={document.id}>
                <tr className="transition hover:bg-gray-50/80">
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

                  <td className="px-6 py-4 text-gray-700">
                    {document.documentTypeName}
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
                      {canManageAdminPanels && (
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

                      {canManageAdminPanels && (
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

                      {canManageAdminPanels &&
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

                      {canManageAdminPanels && (
                        <button
                          className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 transition hover:bg-purple-100"
                          onClick={() => handleStartEditVisibility(document)}
                          disabled={!document.isActive}
                        >
                          Editar visibilidad
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {editingVisibilityDocumentId === document.id && (
                  <tr>
                    <td
                      colSpan={documentTableColumns.length}
                      className="bg-gray-50 px-6 py-4"
                    >
                      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Nivel de acceso
                          </label>
                          <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={visibilityForm.accessLevelId}
                            onChange={(e) =>
                              setVisibilityForm((prev) => ({
                                ...prev,
                                accessLevelId: e.target.value,
                                departmentIds: [],
                              }))
                            }
                            disabled={updatingVisibility}
                          >
                            <option value="">
                              Seleccionar nivel de acceso
                            </option>
                            {documentAccessLevels.map((level) => (
                              <option key={level.id} value={level.id}>
                                {level.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {isVisibilityDepartmentOnly && (
                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Departamentos visibles
                            </label>

                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                              {departments.map((department) => (
                                <label
                                  key={department.id}
                                  className="flex items-center gap-2 text-sm text-gray-700"
                                >
                                  <input
                                    type="checkbox"
                                    checked={visibilityForm.departmentIds.includes(
                                      department.id,
                                    )}
                                    onChange={() =>
                                      handleVisibilityDepartmentToggle(
                                        department.id,
                                      )
                                    }
                                    disabled={updatingVisibility}
                                    className="h-4 w-4"
                                  />
                                  <span>{department.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button
                            type="button"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
                            onClick={() => handleSaveVisibility(document.id)}
                            disabled={updatingVisibility}
                          >
                            {updatingVisibility
                              ? "Guardando..."
                              : "Guardar visibilidad"}
                          </button>

                          <button
                            type="button"
                            className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                            onClick={handleCancelEditVisibility}
                            disabled={updatingVisibility}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </DataTable>
        )}
      </div>
    </section>
  );
}

export default DocumentsPage;
