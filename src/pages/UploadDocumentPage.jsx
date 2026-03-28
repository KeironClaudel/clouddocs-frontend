import { useEffect, useState } from "react";
import axios from "axios";
import { getCategories } from "../services/categoryService";
import { uploadDocument } from "../services/documentService";

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
        setError(err.response?.data?.message || "Failed to upload document.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="section app-section">
      <div className="container">
        <div className="mb-5">
          <h1 className="title is-2">Upload Document</h1>
          <p className="subtitle is-6">
            Upload PDF files and register their metadata securely.
          </p>
        </div>

        {successMessage && (
          <article className="message is-success">
            <div className="message-body">{successMessage}</div>
          </article>
        )}

        {error && (
          <article className="message is-danger">
            <div className="message-body">{error}</div>
          </article>
        )}

        <div className="box">
          <form onSubmit={handleSubmit}>
            <div className="columns is-multiline">
              <div className="column is-12">
                <div className="field">
                  <label className="label">PDF File</label>
                  <div className="control">
                    <input
                      className="input"
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                      disabled={uploading}
                      required
                    />
                  </div>
                  {selectedFile && (
                    <p className="help is-success mt-2">
                      Selected file: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="column is-6">
                <div className="field">
                  <label className="label">Category</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        name="categoryId"
                        value={form.categoryid}
                        onChange={handleInputChange}
                        disabled={loadingCategories || uploading}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="column is-6">
                <div className="field">
                  <label className="label">Document Type</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        name="documentType"
                        value={form.documentType}
                        onChange={handleInputChange}
                        disabled={uploading}
                        required
                      >
                        <option value="">Select document type</option>
                        {documentTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="column is-6">
                <div className="field">
                  <label className="label">Access Level</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        name="accessLevel"
                        value={form.accessLevel}
                        onChange={handleInputChange}
                        disabled={uploading}
                        required
                      >
                        <option value="">Select access level</option>
                        {accessLevelOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="column is-6">
                <div className="field">
                  <label className="label">Department</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="department"
                      value={form.department}
                      onChange={handleInputChange}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              <div className="column is-6">
                <div className="field">
                  <label className="label">Expiration Date</label>
                  <div className="control">
                    <input
                      className="input"
                      type="date"
                      name="expirationDate"
                      value={form.expirationDate}
                      onChange={handleInputChange}
                      disabled={
                        uploading || form.expirationDatePendingDefinition
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="column is-6">
                <div className="field mt-5">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name="expirationDatePendingDefinition"
                      checked={form.expirationDatePendingDefinition}
                      onChange={handleInputChange}
                      disabled={uploading}
                    />{" "}
                    Expiration date pending definition
                  </label>
                </div>
              </div>
            </div>

            <div className="field is-grouped mt-5">
              <div className="control">
                <button
                  type="submit"
                  className={`button is-primary ${
                    uploading ? "is-loading" : ""
                  }`}
                  disabled={uploading || loadingCategories}
                >
                  Upload Document
                </button>
              </div>

              <div className="control">
                <button
                  type="button"
                  className="button is-light"
                  onClick={resetForm}
                  disabled={uploading}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default UploadDocumentPage;
