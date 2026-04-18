/**
 * Validates the reset password form.
 * Returns an error message string or null if valid.
 */
export function validateResetPasswordForm({
  token,
  newPassword,
  confirmPassword,
  t,
}) {
  if (!token) {
    return t("resetPassword.messages.invalidToken");
  }

  if (!newPassword.trim()) {
    return t("resetPassword.messages.passwordRequired");
  }

  if (!confirmPassword.trim()) {
    return t("resetPassword.messages.confirmPasswordRequired");
  }

  if (newPassword !== confirmPassword) {
    return t("resetPassword.messages.mismatch");
  }

  if (newPassword.trim().length < 8) {
    return t("resetPassword.messages.passwordTooShort");
  }

  return null;
}
