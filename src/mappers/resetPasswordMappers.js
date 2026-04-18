/**
 * Builds the reset password payload expected by the API.
 */
export function buildResetPasswordPayload({ token, newPassword }) {
  return {
    token,
    newPassword: newPassword.trim(),
  };
}
