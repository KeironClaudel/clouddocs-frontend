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
