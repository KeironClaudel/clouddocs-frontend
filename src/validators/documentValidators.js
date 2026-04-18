/**
 * Validates rename document action.
 */
export function validateRename(name, t) {
  if (!name.trim()) {
    return t("documents.messages.emptyName");
  }

  return null;
}

/**
 * Validates visibility form.
 */
export function validateVisibilityForm({
  visibilityForm,
  isDepartmentOnly,
  t,
}) {
  if (!visibilityForm.accessLevelId) {
    return t("documents.messages.selectAccessLevel");
  }

  if (isDepartmentOnly && visibilityForm.departmentIds.length === 0) {
    return t("documents.messages.selectDepartments");
  }

  return null;
}

/**
 * Validates upload version file.
 */
export function validateUploadVersion(file, t) {
  if (!file) {
    return t("documents.messages.selectFile");
  }

  if (file.type !== "application/pdf") {
    return t("documents.messages.onlyPdf");
  }

  return null;
}
