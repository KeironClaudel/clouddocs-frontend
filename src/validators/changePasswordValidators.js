/**
 * Validates the change password form values.
 * Returns an error message string or null if valid.
 */
export function validateChangePasswordForm({
  currentPassword,
  newPassword,
  confirmPassword,
  t,
}) {
  if (!currentPassword.trim()) {
    return t("changePassword.messages.currentPasswordRequired");
  }

  if (!newPassword.trim()) {
    return t("changePassword.messages.newPasswordRequired");
  }

  if (!confirmPassword.trim()) {
    return t("changePassword.messages.confirmPasswordRequired");
  }

  if (newPassword !== confirmPassword) {
    return t("changePassword.messages.mismatch");
  }

  if (newPassword.trim().length < 8) {
    return t("changePassword.messages.passwordTooShort");
  }

  return null;
}
