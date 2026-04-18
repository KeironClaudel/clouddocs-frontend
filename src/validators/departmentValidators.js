/**
 * Validates department create form.
 */
export function validateCreateDepartment(form, t) {
  if (!form.name.trim()) {
    return t("departments.messages.nameRequired");
  }

  return null;
}

/**
 * Validates department update form.
 */
export function validateUpdateDepartment(form, t) {
  if (!form.name.trim()) {
    return t("departments.messages.nameRequired");
  }

  return null;
}
