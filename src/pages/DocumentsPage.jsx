import { useEffect, useState } from "react";
import axios from "axios";
import {
  getDocuments,
  previewDocument,
  downloadDocument,
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

        /**
         * Adjust this assignment if the API wraps the list
         * inside a property such as "items" or "documents".
         */
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
                    {documents.map((document) => (
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
                            <select defaultValue="">
                              <option value="">Current</option>
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
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default DocumentsPage;
