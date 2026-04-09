import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  deactivateDocument,
  downloadDocument,
  getDocumentVersions,
  previewDocument,
  reactivateDocument,
  renameDocument,
  searchDocuments,
  updateDocumentVisibility,
  uploadDocumentVersion,
} from "../services/documentService";
import { getDepartments } from "../services/departmentService";
import { getDocumentTypes } from "../services/documentTypeService";
import { getCategories } from "../services/categoryService";
import { getDocumentAccessLevels } from "../services/documentAccessLevelService";
import { isAdmin } from "../utils/permissionUtils";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";

/**
 * Encapsulates all DocumentsPage state, data loading,
 * actions, filters, pagination, versions, and visibility editing.
 */
export function useDocumentsPage(user) {
  /**
   * Stores the document list returned by the API.
   */
  const [documents, setDocuments] = useState([]);

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
   * Tracks which document is currently editing visibility settings.
   */
  const [editingVisibilityDocumentId, setEditingVisibilityDocumentId] =
    useState(null);

  /**
   * Stores the visibility form state for the document being edited.
   */
  const [visibilityForm, setVisibilityForm] = useState({
    accessLevelId: "",
    departmentIds: [],
  });

  /**
   * Tracks whether the visibility update request is in progress.
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

  /**
   * Stores the total result count.
   */
  const [totalCount, setTotalCount] = useState(0);

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

  /**
   * Tracks which document is currently uploading a new version.
   */
  const [uploadingVersionDocumentId, setUploadingVersionDocumentId] =
    useState(null);

  /**
   * Stores filter values used by the document search.
   */
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
   * Stores catalog data used by filters and visibility editing.
   */
  const [categories, setCategories] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [documentAccessLevels, setDocumentAccessLevels] = useState([]);
  const [departments, setDepartments] = useState([]);

  /**
   * Calculates the total number of pages based on the document count.
   */
  const totalPages = Math.ceil(totalCount / pageSize);

  /**
   * Applies the local status filter to the current page of documents.
   */
  const visibleDocuments = useMemo(() => {
    return filters.isActive === ""
      ? documents
      : documents.filter(
          (document) => String(document.isActive) === filters.isActive,
        );
  }, [documents, filters.isActive]);

  /**
   * Retrieves the selected access level for visibility editing.
   */
  const selectedVisibilityAccessLevel = useMemo(() => {
    return documentAccessLevels.find(
      (level) => String(level.id) === String(visibilityForm.accessLevelId),
    );
  }, [documentAccessLevels, visibilityForm.accessLevelId]);

  /**
   * Returns true when the selected visibility access level
   * requires department selection.
   */
  const isVisibilityDepartmentOnly =
    selectedVisibilityAccessLevel?.code === "DEPARTMENT_ONLY";

  /**
   * Loads active categories for the filter dropdown.
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
   * Loads active document types for the filter dropdown.
   */
  useEffect(() => {
    async function loadDocumentTypes() {
      try {
        const data = await getDocumentTypes();

        const normalizedTypes = Array.isArray(data)
          ? data
          : data.documentTypes || data.items || [];

        const activeTypes = normalizedTypes.filter(
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
   * Loads active document access levels for visibility editing.
   */
  useEffect(() => {
    async function loadDocumentAccessLevels() {
      try {
        const data = await getDocumentAccessLevels();

        const normalizedAccessLevels = Array.isArray(data)
          ? data
          : data.documentAccessLevels || data.items || [];

        const activeAccessLevels = normalizedAccessLevels.filter(
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
   * Loads active departments for visibility editing.
   */
  useEffect(() => {
    async function loadDepartments() {
      try {
        const data = await getDepartments();

        const normalizedDepartments = Array.isArray(data)
          ? data
          : data.departments || data.items || [];

        const activeDepartments = normalizedDepartments.filter(
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
   * Ensures the current page stays valid when the document list changes.
   */
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /**
   * Loads the document list when filters or pagination change.
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

        if (isAdmin(user)) {
          params.includeInactive = true;
        }

        const data = await searchDocuments(params);

        const items = Array.isArray(data?.items) ? data.items : [];

        setDocuments(items);
        setTotalCount(data?.totalCount || 0);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(getApiErrorMessage(err, t("documents.messages.loadError")));
        } else {
          setError(t("documents.messages.unexpected"));
        }
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, [currentPage, pageSize, filters, user]);

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
    } catch (err) {
      console.error("Failed to load versions:", err);

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
    } catch (err) {
      console.error("Preview failed:", err);
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
    } catch (err) {
      console.error("Download failed:", err);
    }
  }

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

      setVersionsByDocumentId((prev) => {
        const updated = { ...prev };
        delete updated[documentId];
        return updated;
      });

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
        setActionMessage(t("documents.messages.unexpected"));
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
   * Marks a document as active in local state after reactivation.
   */
  function reactivateDocumentInState(documentId) {
    setDocuments((prevDocuments) =>
      prevDocuments.map((document) =>
        document.id === documentId ? { ...document, isActive: true } : document,
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
        setActionMessage(t("documents.messages.unexpected"));
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
        setActionMessage(t("documents.messages.unexpected"));
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
        setActionMessage(t("documents.messages.unexpected"));
      }
    } finally {
      setReactivatingDocumentId(null);
    }
  }

  /**
   * Handles filter state and resets pagination.
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
   * Clears filter options and resets pagination.
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
   * Opens the visibility settings form for a document
   * and loads its current settings into the form state.
   */
  function handleStartEditVisibility(document) {
    setActionMessage("");
    setEditingVisibilityDocumentId(document.id);

    setVisibilityForm({
      accessLevelId: document.accessLevelId || "",
      departmentIds: Array.isArray(document.visibleDepartments)
        ? document.visibleDepartments.map((department) => department.id)
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

  /**
   * Saves the updated visibility settings for a document.
   */
  async function handleSaveVisibility(documentId) {
    if (!visibilityForm.accessLevelId) {
      setActionMessage(t("documents.messages.selectAccessLevel"));
      return;
    }

    if (
      isVisibilityDepartmentOnly &&
      visibilityForm.departmentIds.length === 0
    ) {
      setActionMessage(t("documents.messages.selectDepartments"));
      return;
    }

    setUpdatingVisibility(true);
    setActionMessage("");

    try {
      await updateDocumentVisibility(documentId, {
        accessLevelId: visibilityForm.accessLevelId,
        departmentIds: isVisibilityDepartmentOnly
          ? visibilityForm.departmentIds
          : [],
      });

      setActionMessage(t("documents.messages.visibilityUpdated"));
      setEditingVisibilityDocumentId(null);

      setDocuments((prevDocuments) =>
        prevDocuments.map((document) =>
          document.id === documentId
            ? {
                ...document,
                accessLevelId: visibilityForm.accessLevelId,
                visibleDepartments: isVisibilityDepartmentOnly
                  ? departments.filter((department) =>
                      visibilityForm.departmentIds.includes(department.id),
                    )
                  : [],
              }
            : document,
        ),
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(
            err,
            t("documents.messages.visibilityUpdateError"),
          ),
        );
      } else {
        setActionMessage(t("documents.messages.unexpected"));
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

  return {
    actionMessage,
    categories,
    currentPage,
    deactivatingDocumentId,
    departments,
    documentAccessLevels,
    documentTypes,
    documents,
    editingVisibilityDocumentId,
    error,
    filters,
    handleCancelEditVisibility,
    handleCancelRename,
    handleClearFilters,
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
    pageSize,
    reactivateDocumentInState,
    reactivatingDocumentId,
    renameValue,
    renamingDocumentId,
    selectedVersionByDocumentId,
    selectedVisibilityAccessLevel,
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
  };
}
