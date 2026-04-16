import { useEffect, useState } from "react";
import axios from "axios";
import { getCategories } from "../services/categoryService";
import { uploadDocument } from "../services/documentService";
import { getDocumentTypes } from "../services/documentTypeService";
import { getDocumentAccessLevels } from "../services/documentAccessLevelService";
import { getDepartments } from "../services/departmentService";
import { getApiErrorMessage } from "../utils/errorUtils";
import { searchClients } from "../services/clientService";
import { t } from "../i18n";

const MAX_FILE_SIZE_BYTES = import.meta.env.VITE_MAX_FILE_SIZE_BYTES;

/**
 * Encapsulates all UploadDocumentPage state, data loading,
 * validation logic, and submit handlers.
 */
export function useUploadDocument() {
  /**
   * Stores the category list available for selection.
   */
  const [categories, setCategories] = useState([]);

  /**
   * Stores the department list available for selection.
   */
  const [departments, setDepartments] = useState([]);

  /**
   * Indicates whether departments are currently loading.
   */
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  /**
   * Stores the available document access levels.
   */
  const [documentAccessLevels, setDocumentAccessLevels] = useState([]);

  /**
   * Indicates whether categories are currently loading.
   */
  const [loadingCategories, setLoadingCategories] = useState(true);

  /**
   * Indicates whether the upload request is currently running.
   */
  const [uploading, setUploading] = useState(false);

  /**
   * Stores a page-level error message.
   */
  const [error, setError] = useState("");

  /**
   * Stores a success message after a successful upload.
   */
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * Stores the selected file.
   */
  const [selectedFile, setSelectedFile] = useState(null);

  /**
   * Stores the list of document types for selection.
   */
  const [documentTypes, setDocumentTypes] = useState([]);

  /**
   * Stores the current search term for client lookup and the resulting options.
   */
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [clientOptions, setClientOptions] = useState([]);
  const [searchingClients, setSearchingClients] = useState(false);

  /*
   * Tracks whether the user has performed a client search to conditionally
   */
  const [hasSearchedClients, setHasSearchedClients] = useState(false);

  /**
   * Stores the upload form values.
   */
  const [form, setForm] = useState({
    categoryId: "",
    documentTypeId: "",
    expirationDate: "",
    expirationDatePendingDefinition: false,
    accessLevelId: "",
    departmentIds: [],
    clientId: "",
  });

  /**
   * Retrieves the currently selected access level object.
   */
  const selectedAccessLevel = documentAccessLevels.find(
    (level) => String(level.id) === String(form.accessLevelId),
  );

  /**
   * Returns true when the selected access level requires departments.
   */
  const isDepartmentOnly = selectedAccessLevel?.code === "DEPARTMENT_ONLY";

  /**
   * Loads active document types for the upload form.
   */
  useEffect(() => {
    async function loadDocumentTypes() {
      try {
        const data = await getDocumentTypes();

        const normalizedDocumentTypes = Array.isArray(data)
          ? data
          : data.documentTypes || data.items || [];

        const activeDocumentTypes = normalizedDocumentTypes.filter(
          (type) => type.isActive !== false,
        );

        setDocumentTypes(activeDocumentTypes);
      } catch (err) {
        console.error("Failed to load document types:", err);
      }
    }

    loadDocumentTypes();
  }, []);

  /**
   * Loads active document access levels for the upload form.
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
   * Loads active categories for the upload form.
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
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              t("uploadDocument.messages.loadCategoriesError"),
          );
        } else {
          setError(t("uploadDocument.messages.unexpected"));
        }
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  /**
   * Loads active departments for the upload form.
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
      } finally {
        setLoadingDepartments(false);
      }
    }

    loadDepartments();
  }, []);

  /**
   * Clears selected departments when the selected access level
   * changes to one that is not department-based.
   */
  useEffect(() => {
    if (!isDepartmentOnly && form.departmentIds.length > 0) {
      setForm((prev) => ({
        ...prev,
        departmentIds: [],
      }));
    }
  }, [isDepartmentOnly, form.departmentIds.length]);

  /*
   * Performs a debounced search for clients when the search term changes.
   */
  useEffect(() => {
    if (!clientSearchTerm.trim()) {
      setClientOptions([]);
      setHasSearchedClients(false);
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
        setHasSearchedClients(true);
      } catch (error) {
        console.error("Failed to search clients:", error);
        setClientOptions([]);
        setHasSearchedClients(true);
      } finally {
        setSearchingClients(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [clientSearchTerm]);

  /**
   * Updates form state when a standard input changes.
   */
  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  /**
   * Toggles a department ID in the form state.
   */
  function handleDepartmentToggle(departmentId) {
    setForm((prev) => {
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
   * Validates and stores the selected file.
   */
  function handleFileChange(event) {
    setError("");
    setSuccessMessage("");

    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setError(t("uploadDocument.messages.onlyPdf"));
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(t("uploadDocument.messages.fileTooLarge"));
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  /**
   * Resets the upload form to its initial state.
   */
  function resetForm() {
    setSelectedFile(null);
    setClientSearchTerm("");
    setForm({
      categoryId: "",
      documentTypeId: "",
      expirationDate: "",
      expirationDatePendingDefinition: false,
      accessLevelId: "",
      departmentIds: [],
      clientId: "",
    });
  }

  /**
   * Handles document upload form submission.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!selectedFile) {
      setError(t("uploadDocument.messages.selectFile"));
      return;
    }

    if (!form.categoryId) {
      setError(t("uploadDocument.messages.selectCategory"));
      return;
    }

    if (!form.clientId) {
      setError(t("uploadDocument.messages.selectClient"));
      return;
    }

    if (!form.documentTypeId) {
      setError(t("uploadDocument.messages.selectType"));
      return;
    }

    if (!form.accessLevelId) {
      setError(t("uploadDocument.messages.selectAccess"));
      return;
    }

    if (!form.expirationDatePendingDefinition && !form.expirationDate) {
      setError(t("uploadDocument.messages.expirationRequired"));
      return;
    }

    if (isDepartmentOnly && form.departmentIds.length === 0) {
      setError(t("uploadDocument.messages.selectDepartments"));
      return;
    }

    setUploading(true);

    try {
      const payload = {
        file: selectedFile,
        categoryId: form.categoryId,
        documentTypeId: form.documentTypeId,
        expirationDate: form.expirationDate || null,
        expirationDatePendingDefinition: form.expirationDatePendingDefinition,
        accessLevelId: form.accessLevelId,
        departmentIds: isDepartmentOnly ? form.departmentIds : [],
        clientId: form.clientId,
      };

      await uploadDocument(payload);

      setSuccessMessage(t("uploadDocument.messages.success"));
      resetForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          getApiErrorMessage(err, t("uploadDocument.messages.uploadError")),
        );
      } else {
        setError(t("uploadDocument.messages.unexpected"));
      }
    } finally {
      setUploading(false);
    }
  }

  return {
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
    hasSearchedClients,
  };
}
