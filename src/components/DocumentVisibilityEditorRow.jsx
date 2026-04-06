import { t } from "../i18n";

/**
 * Renders an inline editor row for document visibility settings.
 */
function DocumentVisibilityEditorRow({
  colSpan,
  departments,
  documentAccessLevels,
  documentId,
  handleCancelEditVisibility,
  handleSaveVisibility,
  handleVisibilityDepartmentToggle,
  isVisibilityDepartmentOnly,
  setVisibilityForm,
  updatingVisibility,
  visibilityForm,
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="bg-gray-50 px-6 py-4">
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("documents.visibility.accessLevel")}
            </label>

            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={visibilityForm.accessLevelId}
              onChange={(e) =>
                setVisibilityForm((prev) => ({
                  ...prev,
                  accessLevelId: e.target.value,
                  departmentIds: [],
                }))
              }
              disabled={updatingVisibility}
            >
              <option value="">
                {t("documents.visibility.selectAccessLevel")}
              </option>

              {documentAccessLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {isVisibilityDepartmentOnly && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("documents.visibility.visibleDepartments")}
              </label>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {departments.map((department) => (
                  <label
                    key={department.id}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={visibilityForm.departmentIds.includes(
                        department.id,
                      )}
                      onChange={() =>
                        handleVisibilityDepartmentToggle(department.id)
                      }
                      disabled={updatingVisibility}
                      className="h-4 w-4"
                    />
                    <span>{department.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
              onClick={() => handleSaveVisibility(documentId)}
              disabled={updatingVisibility}
            >
              {updatingVisibility
                ? t("documents.buttons.savingVisibility")
                : t("documents.buttons.saveVisibility")}
            </button>

            <button
              type="button"
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
              onClick={handleCancelEditVisibility}
              disabled={updatingVisibility}
            >
              {t("documents.buttons.cancel")}
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default DocumentVisibilityEditorRow;
