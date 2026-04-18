/**
 * Returns the initial create user form state.
 */
export function getInitialCreateUserForm() {
  return {
    fullName: "",
    email: "",
    password: "",
    departmentId: "",
    roleId: "",
  };
}

/**
 * Returns the initial edit user form state.
 */
export function getInitialEditUserForm() {
  return {
    fullName: "",
    email: "",
    password: "",
    departmentId: "",
    roleId: "",
  };
}

/**
 * Builds the create user payload expected by the API.
 */
export function buildCreateUserPayload(form) {
  return {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    password: form.password.trim(),
    departmentId: form.departmentId || null,
    roleId: form.roleId,
  };
}

/**
 * Builds the update user payload expected by the API.
 */
export function buildUpdateUserPayload(form) {
  return {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    password: form.password.trim() || null,
    departmentId: form.departmentId || null,
    roleId: form.roleId,
  };
}

/**
 * Maps a user returned by the API to the edit form shape.
 */
export function mapUserToEditForm(userData, matchedRole) {
  return {
    fullName: userData.fullName || "",
    email: userData.email || "",
    password: "",
    departmentId: userData.departmentId ? String(userData.departmentId) : "",
    roleId: userData.roleId || matchedRole?.value || "",
  };
}
