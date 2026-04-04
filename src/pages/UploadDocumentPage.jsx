import { useEffect, useState } from "react";
import axios from "axios";
import { getCategories } from "../services/categoryService";
import { uploadDocument } from "../services/documentService";
import { getDocumentTypes } from "../services/documentTypeService";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";

const MAX_FILE_SIZE_BYTES = import.meta.env.VITE_MAX_FILE_SIZE_BYTES;

/**
 * Temporary frontend options for document access level.
 * Adjust numeric values if your backend enum uses different values.
 */
const accessLevelOptions = [
  { label: "Public Internal", value: 0 },
  { label: "Private", value: 1 },
  { label: "Admins Only", value: 2 },
  { label: "Owner Only", value: 3 },
  { label: "Department", value: 4 },
];

function UploadDocumentPage() {
  /**
   * Stores the category list available for selection.
   */
  const [categories, setCategories] = useState([]);

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
   * Stores the upload form values.
   */
  const [form, setForm] = useState({
    categoryId: "",
    documentTypeId: "",
    expirationDate: "",
    expirationDatePendingDefinition: false,
    accessLevel: "",
    department: "",
  });

  /**
   * Loads active document types for the upload form.
   */

  useEffect(() => {
    async function loadDocumentTypes() {
      try {
        const data = await getDocumentTypes();

        const activeTypes = Array.isArray(data)
          ? data.filter((x) => x.isActive)
          : [];

        setDocumentTypes(activeTypes);
      } catch (err) {
        console.error("Failed to load document types:", err);
      }
    }

    loadDocumentTypes();
  }, []);

  /**
   * Loads active categories for the upload form.
   */
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        console.log(data);

        const normalizedCategories = Array.isArray(data)
          ? data
          : data.categories || data.items || [];

        const activeCategories = normalizedCategories.filter(
          (category) => category.isActive,
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
   * Updates form state when an input changes.
   */
  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    setForm({
      categoryId: "",
      documentTypeId: "",
      expirationDate: "",
      expirationDatePendingDefinition: false,
      accessLevel: "",
      department: "",
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

    if (!form.documentTypeId) {
      setError(t("uploadDocument.messages.selectType"));
      return;
    }

    if (!form.accessLevel) {
      setError(t("uploadDocument.messages.selectAccess"));
      return;
    }

    if (!form.expirationDatePendingDefinition && !form.expirationDate) {
      setError(t("uploadDocument.messages.expirationRequired"));
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
        accessLevel: Number(form.accessLevel),
        department: form.department || null,
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
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
                name="accessLevel"
                value={form.accessLevel}
                onChange={handleInputChange}
                disabled={uploading}
                required
              >
                <option value="">{t("uploadDocument.form.accessLevel")}</option>
                {accessLevelOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              {/* DEPARTMENT */}
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                type="text"
                name="department"
                placeholder={t("uploadDocument.form.department")}
                value={form.department}
                onChange={handleInputChange}
                disabled={uploading}
              />

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
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition disabled:bg-blue-300"
                disabled={uploading || loadingCategories}
              >
                {uploading
                  ? t("uploadDocument.buttons.uploading")
                  : t("uploadDocument.buttons.submit")}
              </button>

              <button
                type="button"
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 transition"
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
