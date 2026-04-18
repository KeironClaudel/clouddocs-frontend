/**
 * Builds the login payload expected by the API.
 */
export function buildLoginPayload({ email, password }) {
  return {
    email: email.trim(),
    password,
  };
}

/**
 * Builds the forgot password payload expected by the API.
 */
export function buildForgotPasswordPayload({ email }) {
  return {
    email: email.trim(),
  };
}

/**
 * Builds the change password payload expected by the API.
 */
export function buildChangePasswordPayload({ currentPassword, newPassword }) {
  return {
    currentPassword: currentPassword.trim(),
    newPassword: newPassword.trim(),
  };
}
