import { useState } from "react";
import { forgotPassword } from "../services/authService";
import { t } from "../i18n";
import { validateForgotPasswordForm } from "../validators/forgotPasswordValidators";
import { buildForgotPasswordPayload } from "../mappers/authMappers";
import { resolveApiErrorMessage } from "../utils/apiErrorHandler";

/**
 * Encapsulates all ForgotPasswordPage state and handlers.
 */
export function useForgotPassword() {
  /**
   * Stores the current email input value.
   */
  const [email, setEmail] = useState("");

  /**
   * Indicates whether the forgot password request is currently running.
   */
  const [loading, setLoading] = useState(false);

  /**
   * Stores a success message returned by the backend.
   */
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * Stores an error message when the request fails.
   */
  const [error, setError] = useState("");

  /**
   * Resets transient feedback messages.
   */
  function resetMessages() {
    setError("");
    setSuccessMessage("");
  }

  /**
   * Handles the forgot password form submission.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    resetMessages();

    const validationError = validateForgotPasswordForm({
      email,
      t,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = buildForgotPasswordPayload({ email });
      const data = await forgotPassword(payload);

      setSuccessMessage(data?.message || t("forgotPassword.messages.success"));
    } catch (err) {
      setError(resolveApiErrorMessage(err, t("forgotPassword.messages.error")));
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    error,
    handleSubmit,
    loading,
    setEmail,
    successMessage,
  };
}
