import { useEffect, useState } from "react";
import axios from "axios";
import {
  createDepartment,
  deactivateDepartment,
  getDepartments,
  reactivateDepartment,
  updateDepartment,
} from "../services/departmentService";
import { formatLocalDateForDisplay } from "../utils/dateUtils";
import { getApiErrorMessage } from "../utils/errorUtils";
import DataTable from "../components/DataTable";
import { t } from "../i18n";

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [creatingDepartment, setCreatingDepartment] = useState(false);
  const [updatingDepartment, setUpdatingDepartment] = useState(false);

  const [deactivatingDepartmentId, setDeactivatingDepartmentId] =
    useState(null);
  const [reactivatingDepartmentId, setReactivatingDepartmentId] =
    useState(null);

  const [editingDepartmentId, setEditingDepartmentId] = useState(null);

  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });

  const departmentTableColumns = [
    { key: "name", label: t("departments.table.name") },
    { key: "description", label: t("departments.table.description") },
    { key: "status", label: t("departments.table.status") },
    { key: "createdAt", label: t("departments.table.created") },
    { key: "actions", label: t("departments.table.actions") },
  ];

  useEffect(() => {
    async function loadDepartments() {
      try {
        const data = await getDepartments();

        const normalizedDepartments = Array.isArray(data)
          ? data
          : data.departments || data.items || [];

        setDepartments(normalizedDepartments);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            getApiErrorMessage(err, t("departments.messages.loadError")),
          );
        } else {
          setError(t("departments.messages.unexpected"));
        }
      } finally {
        setLoading(false);
      }
    }

    loadDepartments();
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
    setEditingDepartmentId(null);
    setShowEditForm(false);
  }

  function addDepartmentToState(department) {
    setDepartments((prev) => [department, ...prev]);
  }

  function updateDepartmentInState(updatedDepartment) {
    setDepartments((prev) =>
      prev.map((department) =>
        department.id === updatedDepartment.id ? updatedDepartment : department,
      ),
    );
  }

  function deactivateDepartmentInState(departmentId) {
    setDepartments((prev) =>
      prev.map((department) =>
        department.id === departmentId
          ? { ...department, isActive: false }
          : department,
      ),
    );
  }

  function reactivateDepartmentInState(departmentId) {
    setDepartments((prev) =>
      prev.map((department) =>
        department.id === departmentId
          ? { ...department, isActive: true }
          : department,
      ),
    );
  }

  async function handleCreateDepartment(event) {
    event.preventDefault();

    setActionMessage("");
    setCreatingDepartment(true);

    try {
      const payload = {
        name: createForm.name,
        description: createForm.description || null,
      };

      const createdDepartment = await createDepartment(payload);

      if (createdDepartment?.id) {
        addDepartmentToState(createdDepartment);
      }

      setActionMessage(t("departments.messages.created"));
      resetCreateForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("departments.messages.createError")),
        );
      } else {
        setActionMessage(t("departments.messages.unexpected"));
      }
    } finally {
      setCreatingDepartment(false);
    }
  }

  function handleOpenEditForm(department) {
    setActionMessage("");
    setEditingDepartmentId(department.id);
    setEditForm({
      name: department.name || "",
      description: department.description || "",
    });
    setShowEditForm(true);
  }

  async function handleUpdateDepartment(event) {
    event.preventDefault();

    if (!editingDepartmentId) {
      return;
    }

    setActionMessage("");
    setUpdatingDepartment(true);

    try {
      const payload = {
        name: editForm.name,
        description: editForm.description || null,
      };

      const updatedDepartment = await updateDepartment(
        editingDepartmentId,
        payload,
      );

      if (updatedDepartment?.id) {
        updateDepartmentInState(updatedDepartment);
      }

      setActionMessage(t("departments.messages.updated"));
      resetEditForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("departments.messages.updateError")),
        );
      } else {
        setActionMessage(t("departments.messages.unexpected"));
      }
    } finally {
      setUpdatingDepartment(false);
    }
  }

  async function handleDeactivateDepartment(departmentId) {
    setActionMessage("");
    setDeactivatingDepartmentId(departmentId);

    try {
      await deactivateDepartment(departmentId);
      deactivateDepartmentInState(departmentId);
      setActionMessage(t("departments.messages.deactivated"));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("departments.messages.deactivateError")),
        );
      } else {
        setActionMessage(t("departments.messages.unexpected"));
      }
    } finally {
      setDeactivatingDepartmentId(null);
    }
  }

  async function handleReactivateDepartment(departmentId) {
    setActionMessage("");
    setReactivatingDepartmentId(departmentId);

    try {
      await reactivateDepartment(departmentId);
      reactivateDepartmentInState(departmentId);
      setActionMessage(t("departments.messages.reactivated"));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          getApiErrorMessage(err, t("departments.messages.reactivateError")),
        );
      } else {
        setActionMessage(t("departments.messages.unexpected"));
      }
    } finally {
      setReactivatingDepartmentId(null);
    }
  }

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("departments.title")}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {t("departments.subtitle")}
          </p>

          <div className="mt-4">
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              onClick={() => setShowCreateForm((prev) => !prev)}
            >
              {showCreateForm
                ? t("departments.buttons.cancel")
                : t("departments.buttons.create")}
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
              {t("departments.form.createTitle")}
            </h2>

            <form onSubmit={handleCreateDepartment} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("departments.form.name")}
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
                    {t("departments.form.description")}
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
                  disabled={creatingDepartment}
                >
                  {creatingDepartment
                    ? t("departments.buttons.creating")
                    : t("departments.buttons.create")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-300"
                  onClick={resetCreateForm}
                  disabled={creatingDepartment}
                >
                  {t("departments.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {showEditForm && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t("departments.form.editTitle")}
            </h2>

            <form onSubmit={handleUpdateDepartment} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("departments.form.name")}
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
                    {t("departments.form.description")}
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
                  disabled={updatingDepartment}
                >
                  {updatingDepartment
                    ? t("departments.buttons.saving")
                    : t("departments.buttons.save")}
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-300"
                  onClick={resetEditForm}
                  disabled={updatingDepartment}
                >
                  {t("departments.buttons.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {t("departments.messages.loading")}
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <DataTable
            columns={departmentTableColumns}
            hasData={departments.length > 0}
            emptyMessage={t("departments.table.noData")}
          >
            {departments.map((department) => (
              <tr
                key={department.id}
                className="transition hover:bg-gray-50/80"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {department.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {department.description ||
                    t("departments.table.noDescription")}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      department.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {department.isActive
                      ? t("departments.table.active")
                      : t("departments.table.inactive")}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatLocalDateForDisplay(department.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      onClick={() => handleOpenEditForm(department)}
                      disabled={!department.isActive}
                    >
                      {t("departments.buttons.edit")}
                    </button>

                    {department.isActive ? (
                      <button
                        className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                        onClick={() =>
                          handleDeactivateDepartment(department.id)
                        }
                        disabled={deactivatingDepartmentId === department.id}
                      >
                        {deactivatingDepartmentId === department.id
                          ? t("departments.buttons.processing")
                          : t("departments.buttons.deactivate")}
                      </button>
                    ) : (
                      <button
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                        onClick={() =>
                          handleReactivateDepartment(department.id)
                        }
                        disabled={reactivatingDepartmentId === department.id}
                      >
                        {reactivatingDepartmentId === department.id
                          ? t("departments.buttons.processing")
                          : t("departments.buttons.reactivate")}
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

export default DepartmentsPage;
