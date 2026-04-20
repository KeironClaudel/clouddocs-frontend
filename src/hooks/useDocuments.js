import { useEffect, useMemo, useState } from "react";
import {
  deactivateDocument,
  downloadDocument,
  getDocumentVersions,
  previewDocument,
  reactivateDocument,
  renameDocument,
  searchDocuments,
  updateDocumentVisibility,
  sendDocumentToClient,
  uploadDocumentVersion,
} from "../services/documentService";
import { searchClients } from "../services/clientService";
import { getDepartments } from "../services/departmentService";
import { getDocumentTypes } from "../services/documentTypeService";
import { getCategories } from "../services/categoryService";
import { getDocumentAccessLevels } from "../services/documentAccessLevelService";
import { isAdmin } from "../utils/permissionUtils";
import { resolveApiErrorMessage } from "../utils/apiErrorHandler";
import {
  validateRename,
  validateVisibilityForm,
  validateUploadVersion,
} from "../validators/documentValidators";

import {
  buildVisibilityPayload,
  buildSendToClientPayload,
  getInitialDocumentFilters,
  getInitialSendToClientForm,
  getInitialVisibilityForm,
} from "../mappers/documentMappers";
import { t } from "../i18n";

export function useDocumentsPage(user) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sendingToClientDocumentId, setSendingToClientDocumentId] =
    useState(null);

  const [sendToClientModalDocument, setSendToClientModalDocument] =
    useState(null);

  const [sendToClientForm, setSendToClientForm] = useState({
    ...getInitialSendToClientForm(),
  });

  const [versionsByDocumentId, setVersionsByDocumentId] = useState({});
  const [selectedVersionByDocumentId, setSelectedVersionByDocumentId] =
    useState({});
  const [versionLoadingByDocumentId, setVersionLoadingByDocumentId] = useState(
    {},
  );

  const [editingVisibilityDocumentId, setEditingVisibilityDocumentId] =
    useState(null);

  const [visibilityForm, setVisibilityForm] = useState({
    ...getInitialVisibilityForm(),
  });

  const [updatingVisibility, setUpdatingVisibility] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [actionMessage, setActionMessage] = useState("");
  const [renamingDocumentId, setRenamingDocumentId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const [deactivatingDocumentId, setDeactivatingDocumentId] = useState(null);
  const [reactivatingDocumentId, setReactivatingDocumentId] = useState(null);
  const [uploadingVersionDocumentId, setUploadingVersionDocumentId] =
    useState(null);

  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [clientOptions, setClientOptions] = useState([]);
  const [searchingClients, setSearchingClients] = useState(false);

  const [filters, setFilters] = useState(getInitialDocumentFilters());

  const [categories, setCategories] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [documentAccessLevels, setDocumentAccessLevels] = useState([]);
  const [departments, setDepartments] = useState([]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const visibleDocuments = useMemo(() => {
    return filters.isActive === ""
      ? documents
      : documents.filter(
          (document) => String(document.isActive) === filters.isActive,
        );
  }, [documents, filters.isActive]);

  const selectedVisibilityAccessLevel = useMemo(() => {
    return documentAccessLevels.find(
      (level) => String(level.id) === String(visibilityForm.accessLevelId),
    );
  }, [documentAccessLevels, visibilityForm.accessLevelId]);

  const isVisibilityDepartmentOnly =
    selectedVisibilityAccessLevel?.code === "DEPARTMENT_ONLY";

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        const normalizedCategories = Array.isArray(data)
          ? data
          : data.categories || data.items || [];
        setCategories(
          normalizedCategories.filter(
            (category) => category.isActive !== false,
          ),
        );
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    async function loadDocumentTypes() {
      try {
        const data = await getDocumentTypes();
        const normalizedTypes = Array.isArray(data)
          ? data
          : data.documentTypes || data.items || [];
        setDocumentTypes(
          normalizedTypes.filter((type) => type.isActive !== false),
        );
      } catch (err) {
        console.error("Failed to load document types:", err);
      }
    }

    loadDocumentTypes();
  }, []);

  useEffect(() => {
    async function loadDocumentAccessLevels() {
      try {
        const data = await getDocumentAccessLevels();
        const normalizedAccessLevels = Array.isArray(data)
          ? data
          : data.documentAccessLevels || data.items || [];
        setDocumentAccessLevels(
          normalizedAccessLevels.filter((level) => level.isActive !== false),
        );
      } catch (err) {
        console.error("Failed to load document access levels:", err);
      }
    }

    loadDocumentAccessLevels();
  }, []);

  useEffect(() => {
    async function loadDepartments() {
      try {
        const data = await getDepartments();
        const normalizedDepartments = Array.isArray(data)
          ? data
          : data.departments || data.items || [];
        setDepartments(
          normalizedDepartments.filter(
            (department) => department.isActive !== false,
          ),
        );
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    }

    loadDepartments();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

        if (filters.clientId) {
          params.clientId = filters.clientId;
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
        setError(
          resolveApiErrorMessage(err, t("documents.messages.loadError")),
        );
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, [currentPage, pageSize, filters, user]);

  useEffect(() => {
    if (!clientSearchTerm.trim()) {
      setClientOptions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setSearchingClients(true);

        const data = await searchClients(clientSearchTerm.trim());
        const normalized = Array.isArray(data)
          ? data
          : data.clients || data.items || [];

        setClientOptions(normalized);
      } catch (error) {
        console.error("Failed to search clients:", error);
      } finally {
        setSearchingClients(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [clientSearchTerm]);

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

  function handleVersionChange(documentId, versionId) {
    setSelectedVersionByDocumentId((prev) => ({
      ...prev,
      [documentId]: versionId,
    }));
  }

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
   * Opens the send-to-client modal for the selected document.
   */
  function handleOpenSendToClientModal(document) {
    if (!document?.clientName) {
      setActionMessage(t("documents.sendToClient.noClientAssigned"));
      return;
    }

    setActionMessage("");
    setSendToClientModalDocument(document);
    setSendToClientForm({
      subject: `${t("documents.sendToClient.defaultSubjectPrefix")}: ${document.originalFileName}`,
      message: t("documents.sendToClient.defaultMessage"),
    });
  }

  /**
   * Closes the send-to-client modal and resets form state.
   */
  function handleCloseSendToClientModal() {
    setSendToClientModalDocument(null);
    setSendToClientForm(getInitialSendToClientForm());
  }

  /**
   * Updates the send-to-client form state.
   */
  function handleSendToClientFormChange(field, value) {
    setSendToClientForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  /**
   * Sends the selected document to its assigned client.
   */
  async function handleConfirmSendToClient() {
    if (!sendToClientModalDocument) {
      return;
    }

    setActionMessage("");
    setSendingToClientDocumentId(sendToClientModalDocument.id);

    try {
      const selectedVersionId =
        selectedVersionByDocumentId[sendToClientModalDocument.id] || null;

      const payload = buildSendToClientPayload({
        ...sendToClientForm,
        versionId: selectedVersionId,
      });

      await sendDocumentToClient(sendToClientModalDocument.id, payload);

      setActionMessage(t("documents.sendToClient.success"));
      handleCloseSendToClientModal();
    } catch (err) {
      setError(
        resolveApiErrorMessage(err, t("documents.messages.sendToClientError")),
      );
    } finally {
      setSendingToClientDocumentId(null);
    }
  }

  async function handleUploadVersion(documentId, file) {
    const validationError = validateUploadVersion(file, t);

    if (validationError) {
      setActionMessage(validationError);
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
      setError(
        resolveApiErrorMessage(err, t("documents.messages.uploadVersionError")),
      );
    } finally {
      setUploadingVersionDocumentId(null);
    }
  }

  function handlePreviousPage() {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }

  function handleNextPage() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }

  function updateDocumentNameInState(documentId, newName) {
    setDocuments((prevDocuments) =>
      prevDocuments.map((document) =>
        document.id === documentId
          ? { ...document, originalFileName: newName }
          : document,
      ),
    );
  }

  function deactivateDocumentInState(documentId) {
    setDocuments((prevDocuments) =>
      prevDocuments.map((document) =>
        document.id === documentId
          ? { ...document, isActive: false }
          : document,
      ),
    );
  }

  function reactivateDocumentInState(documentId) {
    setDocuments((prevDocuments) =>
      prevDocuments.map((document) =>
        document.id === documentId ? { ...document, isActive: true } : document,
      ),
    );
  }

  function handleStartRename(document) {
    setActionMessage("");
    setRenamingDocumentId(document.id);
    setRenameValue(document.originalFileName);
  }

  function handleCancelRename() {
    setRenamingDocumentId(null);
    setRenameValue("");
  }

  async function handleConfirmRename(documentId) {
    const validationError = validateRename(renameValue, t);

    if (validationError) {
      setActionMessage(validationError);
      return;
    }

    setActionMessage("");

    try {
      await renameDocument(documentId, renameValue.trim());
      updateDocumentNameInState(documentId, renameValue.trim());
      setActionMessage(t("documents.messages.renameSuccess"));
      handleCancelRename();
    } catch (err) {
      setError(
        resolveApiErrorMessage(err, t("documents.messages.renameError")),
      );
    }
  }

  async function handleDeactivateDocument(documentId) {
    setActionMessage("");
    setDeactivatingDocumentId(documentId);

    try {
      await deactivateDocument(documentId);
      deactivateDocumentInState(documentId);
      setActionMessage(t("documents.messages.deactivateSuccess"));
    } catch (err) {
      setError(
        resolveApiErrorMessage(err, t("documents.messages.deactivateError")),
      );
    } finally {
      setDeactivatingDocumentId(null);
    }
  }

  async function handleReactivateDocument(documentId) {
    setActionMessage("");
    setReactivatingDocumentId(documentId);

    try {
      await reactivateDocument(documentId);
      reactivateDocumentInState(documentId);
      setActionMessage(t("documents.messages.reactivateSuccess"));
    } catch (err) {
      setError(
        resolveApiErrorMessage(err, t("documents.messages.reactivateError")),
      );
    } finally {
      setReactivatingDocumentId(null);
    }
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setCurrentPage(1);
  }

  function handleClientSearchChange(value) {
    setClientSearchTerm(value);

    if (!value.trim()) {
      setFilters((prev) => ({
        ...prev,
        clientId: "",
      }));
    }

    setCurrentPage(1);
  }

  function handleClearFilters() {
    setFilters(getInitialDocumentFilters());

    setClientSearchTerm("");
    setClientOptions([]);
    setCurrentPage(1);
  }

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

  async function handleSaveVisibility(documentId) {
    const validationError = validateVisibilityForm({
      visibilityForm,
      isDepartmentOnly: isVisibilityDepartmentOnly,
      t,
    });

    if (validationError) {
      setActionMessage(validationError);
      return;
    }

    setUpdatingVisibility(true);
    setActionMessage("");

    try {
      await updateDocumentVisibility(
        documentId,
        buildVisibilityPayload({
          visibilityForm,
          isDepartmentOnly: isVisibilityDepartmentOnly,
        }),
      );

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
      setError(
        resolveApiErrorMessage(
          err,
          t("documents.messages.visibilityUpdateError"),
        ),
      );
    } finally {
      setUpdatingVisibility(false);
    }
  }

  function handleCancelEditVisibility() {
    setEditingVisibilityDocumentId(null);
    setVisibilityForm(getInitialVisibilityForm());
  }

  return {
    actionMessage,
    categories,
    clientOptions,
    clientSearchTerm,
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
    pageSize,
    reactivatingDocumentId,
    renameValue,
    renamingDocumentId,
    searchingClients,
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
    handleCloseSendToClientModal,
    handleConfirmSendToClient,
    handleOpenSendToClientModal,
    handleSendToClientFormChange,
    sendToClientForm,
    sendToClientModalDocument,
    sendingToClientDocumentId,
  };
}
