import { useEffect, useState } from "react";
import axios from "axios";
import {
  createDocumentAccessLevel,
  deactivateDocumentAccessLevel,
  getDocumentAccessLevels,
  reactivateDocumentAccessLevel,
  updateDocumentAccessLevel,
} from "../services/documentAccessLevelService";
import { formatLocalDateForDisplay } from "../utils/dateUtils";
import { getApiErrorMessage } from "../utils/errorUtils";
import DataTable from "../components/DataTable";
import { t } from "../i18n";

function DocumentAccessLevelsPage() {
  const [documentAccessLevels, setDocumentAccessLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [creatingDocumentAccessLevel, setCreatingDocumentAccessLevel] =
    useState(false);
  const [updatingDocumentAccessLevel, setUpdatingDocumentAccessLevel] =
    useState(false);

  const [
    deactivatingDocumentAccessLevelId,
    setDeactivatingDocumentAccessLevelId,
  ] = useState(null);

  const [
    reactivatingDocumentAccessLevelId,
    setReactivatingDocumentAccessLevelId,
  ] = useState(null);

  const [editingDocumentAccessLevelId, setEditingDocumentAccessLevelId] =
    useState(null);

  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });

  const documentAccessLevelTableColumns = [
    { key: "name", label: t("documentAccessLevels.table.name") },
    { key: "description", label: t("documentAccessLevels.table.description") },
    { key: "status", label: t("documentAccessLevels.table.status") },
    { key: "createdAt", label: t("documentAccessLevels.table.created") },
    { key: "actions", label: t("documentAccessLevels.table.actions") },
  ];

  useEffect(() => {
    async function loadDocumentAccessLevels() {
      try {
        const data = await getDocumentAccessLevels();

        const normalized = Array.isArray(data)
          ? data
          : data.documentAccessLevels || data.items || [];

        setDocumentAccessLevels(normalized);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            getApiErrorMessage(
              err,
              t("documentAccessLevels.messages.loadError"),
            ),
          );
        } else {
          setError(t("documentAccessLevels.messages.unexpected"));
        }
      } finally {
        setLoading(false);
      }
    }

    loadDocumentAccessLevels();
  }, []);

  function handleCreateFormChange(event) {
    const { name, value } = event.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEditFormChange(event) {
    const { name, value } = event.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetCreateForm() {
    setCreateForm({
      name: "",
      description: "",
    });
    setShowCreateForm(false);
  }

  function resetEditForm() {
    setEditForm({
      name: "",
      description: "",
    });
    setEditingDocumentAccessLevelId(null);
    setShowEditForm(false);
  }

  function addDocumentAccessLevelToState(documentAccessLevel) {
    setDocumentAccessLevels((prev) => [documentAccessLevel, ...prev]);
  }

  function updateDocumentAccessLevelInState(updatedDocumentAccessLevel) {
    setDocumentAccessLevels((prev) =>
      prev.map((documentAccessLevel) =>
        documentAccessLevel.id === updatedDocumentAccessLevel.id
          ? updatedDocumentAccessLevel
          : documentAccessLevel,
      ),
    );
  }

  function deactivateDocumentAccessLevelInState(documentAccessLevelId) {
    setDocumentAccessLevels((prev) =>
      prev.map((documentAccessLevel) =>
        documentAccessLevel.id === documentAccessLevelId
          ? { ...documentAccessLevel, isActive: false }
          : documentAccessLevel,
      ),
    );
  }

  function reactivateDocumentAccessLevelInState(documentAccessLevelId) {
    setDocumentAccessLevels((prev) =>
      prev.map((documentAccessLevel) =>
        documentAccessLevel.id === documentAccessLevelId
          ? { ...documentAccessLevel, isActive: true }
          : documentAccessLevel,
      ),
    );
  }

  async function handleCreateDocumentAccessLevel(event) {
    event.preventDefault();

    setActionMessage("");
    setCreatingDocumentAccessLevel(true);

    try {
      const payload = {
        name: createForm.name,
        description: createForm.description || null,
      };

      const createdDocumentAccessLevel =
        await createDocumentAccessLevel(payload);

      if (createdDocumentAccessLevel?.id) {
        addDocumentAccessLevelToState(createdDocumentAccessLevel);
      }

      setActionMessage(t("documentAccessLevels.messages.created"));
      resetCreateForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(
            err,
            t("documentAccessLevels.messages.createError"),
          ),
        );
      } else {
        setActionMessage(t("documentAccessLevels.messages.unexpected"));
      }
    } finally {
      setCreatingDocumentAccessLevel(false);
    }
  }

  function handleOpenEditForm(documentAccessLevel) {
    setActionMessage("");
    setEditingDocumentAccessLevelId(documentAccessLevel.id);
    setEditForm({
      name: documentAccessLevel.name || "",
      description: documentAccessLevel.description || "",
    });
    setShowEditForm(true);
  }

  async function handleUpdateDocumentAccessLevel(event) {
    event.preventDefault();

    if (!editingDocumentAccessLevelId) {
      return;
    }

    setActionMessage("");
    setUpdatingDocumentAccessLevel(true);

    try {
      const payload = {
        name: editForm.name,
        description: editForm.description || null,
      };

      const updatedDocumentAccessLevel = await updateDocumentAccessLevel(
        editingDocumentAccessLevelId,
        payload,
      );

      if (updatedDocumentAccessLevel?.id) {
        updateDocumentAccessLevelInState(updatedDocumentAccessLevel);
      }

      setActionMessage(t("documentAccessLevels.messages.updated"));
      resetEditForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(
            err,
            t("documentAccessLevels.messages.updateError"),
          ),
        );
      } else {
        setActionMessage(t("documentAccessLevels.messages.unexpected"));
      }
    } finally {
      setUpdatingDocumentAccessLevel(false);
    }
  }

  async function handleDeactivateDocumentAccessLevel(documentAccessLevelId) {
    setActionMessage("");
    setDeactivatingDocumentAccessLevelId(documentAccessLevelId);

    try {
      await deactivateDocumentAccessLevel(documentAccessLevelId);
      deactivateDocumentAccessLevelInState(documentAccessLevelId);
      setActionMessage(t("documentAccessLevels.messages.deactivated"));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(
            err,
            t("documentAccessLevels.messages.deactivateError"),
          ),
        );
      } else {
        setActionMessage(t("documentAccessLevels.messages.unexpected"));
      }
    } finally {
      setDeactivatingDocumentAccessLevelId(null);
    }
  }

  async function handleReactivateDocumentAccessLevel(documentAccessLevelId) {
    setActionMessage("");
    setReactivatingDocumentAccessLevelId(documentAccessLevelId);

    try {
      await reactivateDocumentAccessLevel(documentAccessLevelId);
      reactivateDocumentAccessLevelInState(documentAccessLevelId);
      setActionMessage(t("documentAccessLevels.messages.reactivated"));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(
            err,
            t("documentAccessLevels.messages.reactivateError"),
          ),
        );
      } else {
        setActionMessage(t("documentAccessLevels.messages.unexpected"));
      }
    } finally {
      setReactivatingDocumentAccessLevelId(null);
    }
  }

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("documentAccessLevels.title")}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {t("documentAccessLevels.subtitle")}
          </p>

          <div className="mt-4">
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              onClick={() => setShowCreateForm((prev) => !prev)}
            >
              {showCreateForm
                ? t("documentAccessLevels.buttons.cancel")
                : t("documentAccessLevels.buttons.create")}
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {actionMessage}
          </div>
        )}

        {showCreateForm && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t("documentAccessLevels.form.createTitle")}
            </h2>

            <form
              onSubmit={handleCreateDocumentAccessLevel}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("documentAccessLevels.form.name")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="name"
                    value={createForm.name}
                    onChange={handleCreateFormChange}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("documentAccessLevels.form.description")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="description"
                    value={createForm.description}
                    onChange={handleCreateFormChange}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:opacity-70"
                  disabled={creatingDocumentAccessLevel}
                >
                  {creatingDocumentAccessLevel
                    ? t("documentAccessLevels.buttons.creating")
                    : t("documentAccessLevels.buttons.create")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-300"
                  onClick={resetCreateForm}
                  disabled={creatingDocumentAccessLevel}
                >
                  {t("documentAccessLevels.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {showEditForm && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t("documentAccessLevels.form.editTitle")}
            </h2>

            <form
              onSubmit={handleUpdateDocumentAccessLevel}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("documentAccessLevels.form.name")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("documentAccessLevels.form.description")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditFormChange}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-700"
                  disabled={updatingDocumentAccessLevel}
                >
                  {updatingDocumentAccessLevel
                    ? t("documentAccessLevels.buttons.saving")
                    : t("documentAccessLevels.buttons.save")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-300"
                  onClick={resetEditForm}
                  disabled={updatingDocumentAccessLevel}
                >
                  {t("documentAccessLevels.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {t("documentAccessLevels.messages.loading")}
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <DataTable
            columns={documentAccessLevelTableColumns}
            hasData={documentAccessLevels.length > 0}
            emptyMessage={t("documentAccessLevels.table.noData")}
          >
            {documentAccessLevels.map((documentAccessLevel) => (
              <tr
                key={documentAccessLevel.id}
                className="transition hover:bg-gray-50/80"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {documentAccessLevel.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {documentAccessLevel.description ||
                    t("documentAccessLevels.table.noDescription")}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      documentAccessLevel.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {documentAccessLevel.isActive
                      ? t("documentAccessLevels.table.active")
                      : t("documentAccessLevels.table.inactive")}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatLocalDateForDisplay(documentAccessLevel.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      onClick={() => handleOpenEditForm(documentAccessLevel)}
                      disabled={!documentAccessLevel.isActive}
                    >
                      {t("documentAccessLevels.buttons.edit")}
                    </button>

                    {documentAccessLevel.isActive ? (
                      <button
                        className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                        onClick={() =>
                          handleDeactivateDocumentAccessLevel(
                            documentAccessLevel.id,
                          )
                        }
                        disabled={
                          deactivatingDocumentAccessLevelId ===
                          documentAccessLevel.id
                        }
                      >
                        {deactivatingDocumentAccessLevelId ===
                        documentAccessLevel.id
                          ? t("documentAccessLevels.buttons.processing")
                          : t("documentAccessLevels.buttons.deactivate")}
                      </button>
                    ) : (
                      <button
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                        onClick={() =>
                          handleReactivateDocumentAccessLevel(
                            documentAccessLevel.id,
                          )
                        }
                        disabled={
                          reactivatingDocumentAccessLevelId ===
                          documentAccessLevel.id
                        }
                      >
                        {reactivatingDocumentAccessLevelId ===
                        documentAccessLevel.id
                          ? t("documentAccessLevels.buttons.processing")
                          : t("documentAccessLevels.buttons.reactivate")}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </div>
    </section>
  );
}

export default DocumentAccessLevelsPage;
