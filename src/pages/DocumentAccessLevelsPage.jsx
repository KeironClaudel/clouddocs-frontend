import { formatLocalDateForDisplay } from "../utils/dateUtils";
import DataTable from "../components/DataTable";
import { t } from "../i18n";
import { useDocumentAccessLevelsPage } from "../hooks/useDocumentAccessLevels";

function DocumentAccessLevelsPage() {
  const {
    actionMessage,
    documentAccessLevels,
    editForm,
    error,
    handleDeactivateDocumentAccessLevel,
    handleEditFormChange,
    handleOpenEditForm,
    handleReactivateDocumentAccessLevel,
    handleUpdateDocumentAccessLevel,
    loading,
    resetEditForm,
    showEditForm,
    updatingDocumentAccessLevel,
    deactivatingDocumentAccessLevelId,
    reactivatingDocumentAccessLevelId,
  } = useDocumentAccessLevelsPage();

  const columns = [
    { key: "name", label: t("documentAccessLevels.table.name") },
    { key: "description", label: t("documentAccessLevels.table.description") },
    { key: "status", label: t("documentAccessLevels.table.status") },
    { key: "createdAt", label: t("documentAccessLevels.table.created") },
    { key: "actions", label: t("documentAccessLevels.table.actions") },
  ];

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          {t("documentAccessLevels.title")}
        </h1>

        {actionMessage && <div className="mt-4">{actionMessage}</div>}

        {showEditForm && (
          <form onSubmit={handleUpdateDocumentAccessLevel}>
            <input
              name="name"
              value={editForm.name}
              onChange={handleEditFormChange}
            />
            <input
              name="description"
              value={editForm.description}
              onChange={handleEditFormChange}
            />

            <button disabled={updatingDocumentAccessLevel}>
              {t("documentAccessLevels.buttons.save")}
            </button>

            <button type="button" onClick={resetEditForm}>
              {t("documentAccessLevels.buttons.cancel")}
            </button>
          </form>
        )}

        {loading && <p>{t("documentAccessLevels.messages.loading")}</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <DataTable columns={columns} hasData={true}>
            {documentAccessLevels.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.isActive ? "Active" : "Inactive"}</td>
                <td>{formatLocalDateForDisplay(item.createdAt)}</td>
                <td>
                  <button onClick={() => handleOpenEditForm(item)}>Edit</button>

                  {item.isActive ? (
                    <button
                      onClick={() =>
                        handleDeactivateDocumentAccessLevel(item.id)
                      }
                      disabled={deactivatingDocumentAccessLevelId === item.id}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleReactivateDocumentAccessLevel(item.id)
                      }
                      disabled={reactivatingDocumentAccessLevelId === item.id}
                    >
                      Reactivate
                    </button>
                  )}
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
