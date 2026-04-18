/**
 * Builds the login payload expected by the API.
 */
export function buildLoginPayload({ email, password }) {
  return {
    email: email.trim(),
    password,
  };
}
