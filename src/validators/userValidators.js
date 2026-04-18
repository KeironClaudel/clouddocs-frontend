/**
 * Checks whether the given email has a valid format.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates the create user form.
 * Returns an error message string or null if valid.
 */
export function validateCreateUserForm(form, t) {
  if (!form.fullName.trim()) {
    return t("users.messages.fullNameRequired");
  }

  if (!form.email.trim()) {
    return t("users.messages.emailRequired");
  }

  if (!isValidEmail(form.email.trim())) {
    return t("users.messages.invalidEmail");
  }

  if (!form.password.trim()) {
    return t("users.messages.passwordRequired");
  }

  if (form.password.trim().length < 8) {
    return t("users.messages.passwordTooShort");
  }

  if (!form.departmentId) {
    return t("users.messages.departmentRequired");
  }

  if (!form.roleId) {
    return t("users.messages.roleRequired");
  }

  return null;
}

/**
 * Validates the update user form.
 * Returns an error message string or null if valid.
 */
export function validateUpdateUserForm(form, t) {
  if (!form.fullName.trim()) {
    return t("users.messages.fullNameRequired");
  }

  if (!form.email.trim()) {
    return t("users.messages.emailRequired");
  }

  if (!isValidEmail(form.email.trim())) {
    return t("users.messages.invalidEmail");
  }

  if (form.password.trim() && form.password.trim().length < 8) {
    return t("users.messages.passwordTooShort");
  }

  if (!form.departmentId) {
    return t("users.messages.departmentRequired");
  }

  if (!form.roleId) {
    return t("users.messages.roleRequired");
  }

  return null;
}
