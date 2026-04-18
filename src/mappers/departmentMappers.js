/**
 * Returns initial create form state.
 */
export function getInitialCreateDepartmentForm() {
  return {
    name: "",
    description: "",
  };
}

/**
 * Returns initial edit form state.
 */
export function getInitialEditDepartmentForm() {
  return {
    name: "",
    description: "",
  };
}

/**
 * Maps API department to edit form.
 */
export function mapDepartmentToForm(department) {
  return {
    name: department.name || "",
    description: department.description || "",
  };
}

/**
 * Builds payload for creating department.
 */
export function buildCreateDepartmentPayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim() || null,
  };
}

/**
 * Builds payload for updating department.
 */
export function buildUpdateDepartmentPayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim() || null,
  };
}
