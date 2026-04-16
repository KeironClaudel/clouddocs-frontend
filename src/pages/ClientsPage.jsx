import { formatLocalDateForDisplay } from "../utils/dateUtils";
import DataTable from "../components/DataTable";
import { t } from "../i18n";
import { useClientsPage } from "../hooks/useClient";

function ClientsPage() {
  const {
    actionMessage,
    clients,
    createForm,
    creatingClient,
    deactivatingClientId,
    editForm,
    error,
    handleCreateClient,
    handleCreateFormChange,
    handleDeactivateClient,
    handleEditFormChange,
    handleOpenEditForm,
    handleReactivateClient,
    handleUpdateClient,
    loading,
    reactivatingClientId,
    resetCreateForm,
    resetEditForm,
    setShowCreateForm,
    showCreateForm,
    showEditForm,
    updatingClient,
  } = useClientsPage();

  const clientTableColumns = [
    { key: "name", label: t("clients.table.name") },
    { key: "identification", label: t("clients.table.identification") },
    { key: "email", label: t("clients.table.email") },
    { key: "phone", label: t("clients.table.phone") },
    { key: "status", label: t("clients.table.status") },
    { key: "createdAt", label: t("clients.table.created") },
    { key: "updatedAt", label: t("clients.table.updated") },
    { key: "actions", label: t("clients.table.actions") },
  ];

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("clients.title")}
          </h1>

          <p className="mt-2 text-sm text-gray-600">{t("clients.subtitle")}</p>

          <div className="mt-4">
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              onClick={() => setShowCreateForm((prev) => !prev)}
            >
              {showCreateForm
                ? t("clients.buttons.cancel")
                : t("clients.buttons.create")}
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
              {t("clients.form.createTitle")}
            </h2>

            <form onSubmit={handleCreateClient} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("clients.form.name")}
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
                    {t("clients.form.legalName")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="legalName"
                    value={createForm.legalName}
                    onChange={handleCreateFormChange}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("clients.form.identification")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="identification"
                    value={createForm.identification}
                    onChange={handleCreateFormChange}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("clients.form.email")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="email"
                    name="email"
                    value={createForm.email}
                    onChange={handleCreateFormChange}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("clients.form.phone")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="phone"
                    value={createForm.phone}
                    onChange={handleCreateFormChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("clients.form.notes")}
                  </label>
                  <textarea
                    className="min-h-[110px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    name="notes"
                    value={createForm.notes}
                    onChange={handleCreateFormChange}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:opacity-70"
                  disabled={creatingClient}
                >
                  {creatingClient
                    ? t("clients.buttons.creating")
                    : t("clients.buttons.create")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-300"
                  onClick={resetCreateForm}
                  disabled={creatingClient}
                >
                  {t("clients.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {showEditForm && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t("clients.form.editTitle")}
            </h2>

            <form onSubmit={handleUpdateClient} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("clients.form.name")}
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
                    {t("clients.form.legalName")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="legalName"
                    value={editForm.legalName}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("clients.form.identification")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="identification"
                    value={editForm.identification}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("clients.form.email")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("clients.form.phone")}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("clients.form.notes")}
                  </label>
                  <textarea
                    className="min-h-[110px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    name="notes"
                    value={editForm.notes}
                    onChange={handleEditFormChange}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-700"
                  disabled={updatingClient}
                >
                  {updatingClient
                    ? t("clients.buttons.saving")
                    : t("clients.buttons.save")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-300"
                  onClick={resetEditForm}
                  disabled={updatingClient}
                >
                  {t("clients.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {t("clients.messages.loading")}
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <DataTable
            columns={clientTableColumns}
            hasData={clients.length > 0}
            emptyMessage={t("clients.table.noData")}
          >
            {clients.map((client) => (
              <tr key={client.id} className="transition hover:bg-gray-50/80">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {client.name}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {client.identification || t("clients.table.notAvailable")}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {client.email || t("clients.table.notAvailable")}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {client.phone || t("clients.table.notAvailable")}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      client.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {client.isActive
                      ? t("clients.table.active")
                      : t("clients.table.inactive")}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatLocalDateForDisplay(client.createdAt)}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {client.updatedAt
                    ? formatLocalDateForDisplay(client.updatedAt)
                    : t("clients.table.notAvailable")}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                      onClick={() => handleOpenEditForm(client)}
                      disabled={!client.isActive}
                    >
                      {t("clients.buttons.edit")}
                    </button>

                    {client.isActive ? (
                      <button
                        className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 transition hover:bg-yellow-100"
                        onClick={() => handleDeactivateClient(client.id)}
                        disabled={deactivatingClientId === client.id}
                      >
                        {deactivatingClientId === client.id
                          ? t("clients.buttons.processing")
                          : t("clients.buttons.deactivate")}
                      </button>
                    ) : (
                      <button
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
                        onClick={() => handleReactivateClient(client.id)}
                        disabled={reactivatingClientId === client.id}
                      >
                        {reactivatingClientId === client.id
                          ? t("clients.buttons.processing")
                          : t("clients.buttons.reactivate")}
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

export default ClientsPage;
