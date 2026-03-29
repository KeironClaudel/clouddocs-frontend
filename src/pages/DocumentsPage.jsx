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
} from "../services/documentService";
import { getCategories } from "../services/categoryService";
import { formatLocalDateForDisplay } from "../utils/dateUtils";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { canManageDocuments, isAdmin } from "../utils/permissionUtils";

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
      const blob = await previewDocument(documentId);
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
      const blob = await downloadDocument(documentId);
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
          setError(err.response?.data?.message || "Failed to load documents.");
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
   * Moves directly to a specific page.
   */
  function handleGoToPage(pageNumber) {
    setCurrentPage(pageNumber);
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
      setActionMessage("Document name cannot be empty.");
      return;
    }

    setActionMessage("");

    try {
      await renameDocument(documentId, renameValue.trim());
      updateDocumentNameInState(documentId, renameValue.trim());
      setActionMessage("Document renamed successfully.");
      handleCancelRename();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          err.response?.data?.message || "Failed to rename document.",
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
      setActionMessage("Document deactivated successfully.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          err.response?.data?.message || "Failed to deactivate document.",
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

      setActionMessage("Document reactivated successfully.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          err.response?.data?.message || "Failed to reactivate document.",
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
    <section className="section">
      <div className="container">
        <div className="mb-5">
          <div className="level mb-4">
            <div className="level-left">
              <div>
                <h1 className="title is-2">Documents</h1>
                <p className="subtitle is-6">
                  View available documents and access file actions.
                </p>
              </div>
            </div>

            <div className="level-right">
              <Link to="/documents/upload" className="button is-primary">
                Upload Document
              </Link>
            </div>
          </div>

          <div className="box">
            <h2 className="title is-5">Search & Filters</h2>

            <div className="columns is-multiline">
              <div className="column is-12-mobile is-6-tablet is-4-desktop">
                <div className="field">
                  <label className="label">Search by Name</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="searchTerm"
                      placeholder="Search document name..."
                      value={filters.searchTerm}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>

              <div className="column is-12-mobile is-6-tablet is-4-desktop">
                <div className="field">
                  <label className="label">Category</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        name="categoryId"
                        value={filters.categoryId}
                        onChange={handleFilterChange}
                      >
                        <option value="">All categories</option>
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

              <div className="column is-6-mobile is-3-tablet is-2-desktop">
                <div className="field">
                  <label className="label">Month</label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
                      name="month"
                      min="1"
                      max="12"
                      value={filters.month}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>

              <div className="column is-6-mobile is-3-tablet is-2-desktop">
                <div className="field">
                  <label className="label">Year</label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
                      name="year"
                      value={filters.year}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>

              <div className="column is-12-mobile is-6-tablet is-4-desktop">
                <div className="field">
                  <label className="label">Document Type</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        name="documentType"
                        value={filters.documentType}
                        onChange={handleFilterChange}
                      >
                        <option value="">All types</option>
                        <option value="0">General</option>
                        <option value="1">Contract</option>
                        <option value="2">Permit</option>
                        <option value="3">Policy</option>
                        <option value="4">Legal Document</option>
                        <option value="5">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="column is-12-mobile is-6-tablet is-4-desktop">
                <div className="field">
                  <label className="label">Expiration Pending</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        name="expirationPending"
                        value={filters.expirationPending}
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        <option value="true">Pending definition</option>
                        <option value="false">Defined expiration</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {adminUser && (
                <div className="column is-12-mobile is-6-tablet is-4-desktop">
                  <div className="field">
                    <label className="label">Status</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          name="isActive"
                          value={filters.isActive}
                          onChange={handleFilterChange}
                        >
                          <option value="">All</option>
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="field mt-3">
              <div className="control">
                <button
                  type="button"
                  className="button is-light"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {actionMessage && (
            <article className="message is-info">
              <div className="message-body">{actionMessage}</div>
            </article>
          )}
        </div>

        {loading && (
          <article className="message is-info">
            <div className="message-body">Loading documents...</div>
          </article>
        )}

        {!loading && error && (
          <article className="message is-danger">
            <div className="message-body">{error}</div>
          </article>
        )}

        {!loading && !error && (
          <div className="box">
            {documents.length === 0 ? (
              <p>No documents found.</p>
            ) : (
              <>
                <div className="table-container">
                  <table className="table is-fullwidth is-hoverable is-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Uploaded By</th>
                        <th>Department</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Version</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleDocuments.map((document) => (
                        <tr key={document.id}>
                          <td>
                            {renamingDocumentId === document.id ? (
                              <div className="field has-addons mb-0">
                                <div className="control is-expanded">
                                  <input
                                    className="input is-small"
                                    type="text"
                                    value={renameValue}
                                    onChange={(event) =>
                                      setRenameValue(event.target.value)
                                    }
                                  />
                                </div>

                                <div className="control">
                                  <button
                                    className="button is-link is-light is-small"
                                    onClick={() =>
                                      handleConfirmRename(document.id)
                                    }
                                  >
                                    Save
                                  </button>
                                </div>

                                <div className="control">
                                  <button
                                    className="button is-light is-small"
                                    onClick={handleCancelRename}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              document.originalFileName
                            )}
                          </td>
                          <td>{document.categoryName}</td>
                          <td>{document.uploadedByUserName}</td>
                          <td>{document.department || "N/A"}</td>
                          <td>
                            {formatLocalDateForDisplay(document.createdAt)}
                          </td>
                          <td>
                            {document.isActive ? (
                              <span className="tag is-success is-light">
                                Active
                              </span>
                            ) : (
                              <span className="tag is-danger is-light">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="select is-small">
                              <select
                                value={
                                  selectedVersionByDocumentId[document.id] || ""
                                }
                                onFocus={() => handleLoadVersions(document.id)}
                                onChange={(event) =>
                                  handleVersionChange(
                                    document.id,
                                    event.target.value,
                                  )
                                }
                                disabled={
                                  versionLoadingByDocumentId[document.id]
                                }
                              >
                                <option value="">Current</option>

                                {(versionsByDocumentId[document.id] || []).map(
                                  (version) => (
                                    <option key={version.id} value={version.id}>
                                      {`v${version.versionNumber} - ${formatLocalDateForDisplay(version.createdAt)}`}
                                    </option>
                                  ),
                                )}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div className="buttons are-small">
                              {canManageDocumentActions && (
                                <button
                                  className="button is-link is-light"
                                  onClick={() => handleStartRename(document)}
                                  disabled={
                                    !document.isActive ||
                                    renamingDocumentId === document.id
                                  }
                                >
                                  Rename
                                </button>
                              )}

                              <button
                                className="button is-info is-light"
                                onClick={() => handlePreview(document.id)}
                                disabled={!document.isActive}
                              >
                                Preview
                              </button>

                              <button
                                className="button is-primary is-light"
                                onClick={() =>
                                  handleDownload(
                                    document.id,
                                    document.originalFileName,
                                  )
                                }
                                disabled={!document.isActive}
                              >
                                Download
                              </button>

                              {canManageDocumentActions &&
                                (document.isActive ? (
                                  <button
                                    className="button is-warning is-light"
                                    onClick={() =>
                                      handleDeactivateDocument(document.id)
                                    }
                                    disabled={
                                      deactivatingDocumentId === document.id
                                    }
                                  >
                                    {deactivatingDocumentId === document.id
                                      ? "Processing..."
                                      : "Deactivate"}
                                  </button>
                                ) : (
                                  <button
                                    className="button is-success is-light"
                                    onClick={() =>
                                      handleReactivateDocument(document.id)
                                    }
                                    disabled={
                                      reactivatingDocumentId === document.id
                                    }
                                  >
                                    {reactivatingDocumentId === document.id
                                      ? "Processing..."
                                      : "Reactivate"}
                                  </button>
                                ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mb-3">
                  Showing {visibleDocuments.length} of {totalCount} documents.
                </p>

                <nav
                  className="pagination is-centered mt-5"
                  role="navigation"
                  aria-label="pagination"
                >
                  <button
                    className="pagination-previous"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  <button
                    className="pagination-next"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next page
                  </button>

                  <ul className="pagination-list">
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;

                      return (
                        <li key={pageNumber}>
                          <button
                            className={`pagination-link ${
                              currentPage === pageNumber ? "is-current" : ""
                            }`}
                            onClick={() => handleGoToPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default DocumentsPage;
