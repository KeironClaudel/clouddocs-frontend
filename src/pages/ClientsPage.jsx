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
    { key: "name", label: "Nombre" },
    { key: "description", label: "Descripción" },
    { key: "status", label: "Estado" },
    { key: "createdAt", label: "Creado" },
    { key: "actions", label: "Acciones" },
  ];

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestiona los clientes disponibles en el sistema.
          </p>

          <div className="mt-4">
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              onClick={() => setShowCreateForm((prev) => !prev)}
            >
              {showCreateForm ? "Cancelar" : "Crear cliente"}
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
              Crear cliente
            </h2>

            <form onSubmit={handleCreateClient} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateFormChange}
                  placeholder="Nombre"
                  required
                />

                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="text"
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateFormChange}
                  placeholder="Descripción"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:opacity-70"
                  disabled={creatingClient}
                >
                  {creatingClient ? "Creando..." : "Crear cliente"}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-300"
                  onClick={resetCreateForm}
                  disabled={creatingClient}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {showEditForm && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Editar cliente
            </h2>

            <form onSubmit={handleUpdateClient} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  required
                />

                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="text"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-700"
                  disabled={updatingClient}
                >
                  {updatingClient ? "Guardando..." : "Guardar"}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-300"
                  onClick={resetEditForm}
                  disabled={updatingClient}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Cargando clientes...
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
            emptyMessage="No se encontraron clientes."
          >
            {clients.map((client) => (
              <tr key={client.id} className="transition hover:bg-gray-50/80">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {client.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {client.description || "N/A"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      client.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {client.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatLocalDateForDisplay(client.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                      onClick={() => handleOpenEditForm(client)}
                      disabled={!client.isActive}
                    >
                      Editar
                    </button>

                    {client.isActive ? (
                      <button
                        className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 transition hover:bg-yellow-100"
                        onClick={() => handleDeactivateClient(client.id)}
                        disabled={deactivatingClientId === client.id}
                      >
                        {deactivatingClientId === client.id
                          ? "Procesando..."
                          : "Desactivar"}
                      </button>
                    ) : (
                      <button
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
                        onClick={() => handleReactivateClient(client.id)}
                        disabled={reactivatingClientId === client.id}
                      >
                        {reactivatingClientId === client.id
                          ? "Procesando..."
                          : "Reactivar"}
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
