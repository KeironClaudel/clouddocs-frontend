/**
 * Checks whether the given email has a valid format.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates the login form values.
 * Returns an error message string or null if valid.
 */
export function validateLoginForm({ email, password, t }) {
  if (!email.trim()) {
    return t("login.messages.emailRequired");
  }

  if (!isValidEmail(email.trim())) {
    return t("login.messages.invalidEmail");
  }

  if (!password.trim()) {
    return t("login.messages.passwordRequired");
  }

  return null;
}
