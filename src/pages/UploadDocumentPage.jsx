import { useEffect, useState } from "react";
import axios from "axios";
import { getCategories } from "../services/categoryService";
import { uploadDocument } from "../services/documentService";
import { getApiErrorMessage } from "../utils/errorUtils";

const MAX_FILE_SIZE_BYTES = import.meta.env.VITE_MAX_FILE_SIZE_BYTES;

/**
 * Temporary frontend options for document type.
 * Adjust numeric values if your backend enum uses different values.
 */
const documentTypeOptions = [
  { label: "General", value: 0 },
  { label: "Contract", value: 1 },
  { label: "Permit", value: 2 },
  { label: "Policy", value: 3 },
  { label: "Legal Document", value: 4 },
  { label: "Other", value: 5 },
];

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
   * Stores the upload form values.
   */
  const [form, setForm] = useState({
    categoryId: "",
    documentType: "",
    expirationDate: "",
    expirationDatePendingDefinition: false,
    accessLevel: "",
    department: "",
  });

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
          setError(err.response?.data?.message || "Failed to load categories.");
        } else {
          setError("An unexpected error occurred.");
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
      setError("Only PDF files are allowed.");
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("The selected file exceeds the maximum allowed size.");
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
      documentType: "",
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
      setError("Please select a PDF file.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!form.documentType) {
      setError("Please select a document type.");
      return;
    }

    if (!form.accessLevel) {
      setError("Please select an access level.");
      return;
    }

    if (
      !form.expirationDatePendingDefinition &&
      !form.expirationDate &&
      ["1", "2", "3", "4"].includes(String(form.documentType))
    ) {
      setError(
        "Please provide an expiration date or mark it as pending definition.",
      );
      return;
    }

    setUploading(true);

    try {
      const payload = {
        file: selectedFile,
        originalFileName: selectedFile.name,
        contentType: selectedFile.type,
        fileSize: selectedFile.size,
        categoryId: form.categoryId,
        documentType: Number(form.documentType),
        expirationDate: form.expirationDate || null,
        expirationDatePendingDefinition: form.expirationDatePendingDefinition,
        accessLevel: Number(form.accessLevel),
        department: form.department || null,
      };

      await uploadDocument(payload);

      setSuccessMessage("Document uploaded successfully.");
      resetForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(getApiErrorMessage(err, "Failed to upload document."));
      } else {
        setError("An unexpected error occurred.");
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
          <h1 className="text-3xl font-bold text-gray-900">Upload Document</h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload PDF files and register their metadata securely.
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
                PDF File
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
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* CATEGORY */}
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                name="categoryId"
                value={form.categoryid}
                onChange={handleInputChange}
                disabled={loadingCategories || uploading}
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* TYPE */}
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                name="documentType"
                value={form.documentType}
                onChange={handleInputChange}
                disabled={uploading}
                required
              >
                <option value="">Select document type</option>
                {documentTypeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
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
                <option value="">Select access level</option>
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
                placeholder="Department"
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
              Expiration date pending definition
            </label>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition disabled:bg-blue-300"
                disabled={uploading || loadingCategories}
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </button>

              <button
                type="button"
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 transition"
                onClick={resetForm}
                disabled={uploading}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default UploadDocumentPage;
