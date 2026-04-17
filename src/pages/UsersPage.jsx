import { formatLocalDateForDisplay } from "../utils/dateUtils";
import { roleOptions } from "../utils/roleOptions";
import DataTable from "../components/DataTable";
import { t } from "../i18n";
import { useUsersPage } from "../hooks/useUsers";

function UsersPage() {
  const {
    users,
    departments,
    loading,
    error,
    actionMessage,

    showCreateForm,
    setShowCreateForm,
    createForm,
    creatingUser,
    handleCreateFormChange,
    handleCreateUser,
    resetCreateForm,
    showEditForm,
    editForm,
    loadingEditUser,
    updatingUser,
    handleEditFormChange,
    handleOpenEditForm,
    handleUpdateUser,
    resetEditForm,

    updatingUserId,
    handleDeactivate,
    handleReactivate,
  } = useUsersPage();

  const userTableColumns = [
    { key: "fullName", label: t("users.table.fullName") },
    { key: "email", label: t("users.table.email") },
    { key: "department", label: t("users.table.department") },
    { key: "role", label: t("users.table.role") },
    { key: "status", label: t("users.table.status") },
    { key: "createdAt", label: t("users.table.created") },
    { key: "actions", label: t("users.table.actions") },
  ];

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("users.title")}
          </h1>
          <p className="mt-2 text-sm text-gray-600">{t("users.subtitle")}</p>

          {actionMessage && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {actionMessage}
            </div>
          )}

          <div className="mt-4">
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              onClick={() => setShowCreateForm((prev) => !prev)}
            >
              {showCreateForm
                ? t("users.buttons.cancel")
                : t("users.buttons.create")}
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t("users.form.createTitle")}
            </h2>

            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="text"
                  name="fullName"
                  value={createForm.fullName}
                  onChange={handleCreateFormChange}
                  placeholder={t("users.form.fullName")}
                  required
                />

                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="email"
                  name="email"
                  value={createForm.email}
                  onChange={handleCreateFormChange}
                  placeholder={t("users.form.email")}
                  required
                />

                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  type="password"
                  name="password"
                  value={createForm.password}
                  onChange={handleCreateFormChange}
                  placeholder={t("users.form.password")}
                  required
                />

                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  name="departmentId"
                  value={createForm.departmentId}
                  onChange={handleCreateFormChange}
                  required
                >
                  <option value="">
                    {t("users.form.selectDepartment") ||
                      "Seleccionar departamento"}
                  </option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  name="roleId"
                  value={createForm.roleId}
                  onChange={handleCreateFormChange}
                  required
                >
                  <option value="">{t("users.form.selectRole")}</option>
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  disabled={creatingUser}
                >
                  {creatingUser
                    ? t("users.buttons.creating")
                    : t("users.buttons.create")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                  onClick={() => {
                    resetCreateForm();
                    setShowCreateForm(false);
                  }}
                >
                  {t("users.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {showEditForm && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t("users.form.editTitle")}
            </h2>

            {loadingEditUser ? (
              <p className="text-sm text-gray-600">
                {t("users.messages.loadingUserDetails")}
              </p>
            ) : (
              <form onSubmit={handleUpdateUser} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleEditFormChange}
                    required
                  />

                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditFormChange}
                    required
                  />

                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    type="password"
                    name="password"
                    value={editForm.password}
                    onChange={handleEditFormChange}
                    placeholder={t("users.form.newPassword")}
                  />

                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    name="departmentId"
                    value={editForm.departmentId}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="">
                      {t("users.form.selectDepartment") ||
                        "Seleccionar departamento"}
                    </option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    name="roleId"
                    value={editForm.roleId}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="">{t("users.form.selectRole")}</option>
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                    disabled={updatingUser}
                  >
                    {updatingUser
                      ? t("users.buttons.processing")
                      : t("users.buttons.save")}
                  </button>

                  <button
                    type="button"
                    className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                    onClick={resetEditForm}
                    disabled={updatingUser}
                  >
                    {t("users.buttons.cancel")}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {loading && (
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {t("users.messages.loading")}
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <DataTable
            columns={userTableColumns}
            hasData={users.length > 0}
            emptyMessage={t("users.table.noData")}
          >
            {users.map((userItem) => (
              <tr key={userItem.id} className="transition hover:bg-gray-50/80">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {userItem.fullName}
                </td>

                <td className="px-6 py-4 text-gray-700">{userItem.email}</td>

                <td className="px-6 py-4 text-gray-600">
                  {userItem.departmentId
                    ? departments.find((d) => d.id === userItem.departmentId)
                        ?.name || "N/A"
                    : "N/A"}
                </td>

                <td className="px-6 py-4 text-gray-700">{userItem.role}</td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      userItem.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {userItem.isActive
                      ? t("users.table.active")
                      : t("users.table.inactive")}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatLocalDateForDisplay(userItem.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      onClick={() => handleOpenEditForm(userItem.id)}
                      disabled={
                        loadingEditUser || updatingUserId === userItem.id
                      }
                    >
                      {t("users.buttons.edit")}
                    </button>

                    {userItem.isActive ? (
                      <button
                        className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                        onClick={() => handleDeactivate(userItem.id)}
                        disabled={updatingUserId === userItem.id}
                      >
                        {updatingUserId === userItem.id
                          ? t("users.buttons.processing")
                          : t("users.buttons.deactivate")}
                      </button>
                    ) : (
                      <button
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                        onClick={() => handleReactivate(userItem.id)}
                        disabled={updatingUserId === userItem.id}
                      >
                        {updatingUserId === userItem.id
                          ? t("users.buttons.processing")
                          : t("users.buttons.reactivate")}
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

export default UsersPage;
