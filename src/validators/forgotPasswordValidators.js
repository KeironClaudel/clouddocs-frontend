/**
 * Checks whether the given email has a valid format.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates the forgot password form values.
 * Returns an error message string or null if valid.
 */
export function validateForgotPasswordForm({ email, t }) {
  if (!email.trim()) {
    return t("forgotPassword.messages.emailRequired");
  }

  if (!isValidEmail(email.trim())) {
    return t("forgotPassword.messages.invalidEmail");
  }

  return null;
}
