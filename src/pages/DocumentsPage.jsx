import { useEffect, useState } from "react";
import axios from "axios";
import {
  getDocuments,
  previewDocument,
  downloadDocument,
  getDocumentVersions,
} from "../services/documentService";

function DocumentsPage() {
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
   * Stores the current page number shown in the table.
   */
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Defines how many documents are shown per page.
   */
  const [pageSize] = useState(5);

  /**
   * Calculates the total number of pages based on the document count.
   */
  const totalPages = Math.ceil(documents.length / pageSize);

  /**
   * Determines the first and last index of the current page slice.
   */
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  /**
   * Extracts only the documents that should be displayed on the current page.
   */
  const paginatedDocuments = documents.slice(startIndex, endIndex);

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
      try {
        const data = await getDocuments();

        const normalizedDocuments = Array.isArray(data)
          ? data
          : data.documents || data.items || [];

        setDocuments(normalizedDocuments);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load documents.");
        } else {
          setError(err.message || "An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

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

  return (
    <section className="section">
      <div className="container">
        <div className="mb-5">
          <h1 className="title is-2">Documents</h1>
          <p className="subtitle is-6">
            View available documents and access file actions.
          </p>
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
                        <th>Version</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedDocuments.map((document) => (
                        <tr key={document.id}>
                          <td>{document.originalFileName}</td>
                          <td>{document.categoryName}</td>
                          <td>{document.uploadedByUserName}</td>
                          <td>{document.department || "N/A"}</td>
                          <td>
                            {new Date(document.createdAt).toLocaleDateString()}
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
                                      {`v${version.versionNumber} - ${new Date(
                                        version.createdAt,
                                      ).toLocaleDateString()}`}
                                    </option>
                                  ),
                                )}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div className="buttons are-small">
                              <button
                                className="button is-info is-light"
                                onClick={() => handlePreview(document.id)}
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
                              >
                                Download
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mb-3">
                  Showing {paginatedDocuments.length} of {documents.length}{" "}
                  documents.
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
