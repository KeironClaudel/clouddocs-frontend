import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { resetPassword } from "../services/authService";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";
import { validateResetPasswordForm } from "../validators/resetPasswordValidators";
import { buildResetPasswordPayload } from "../mappers/resetPasswordMappers";

/**
 * Encapsulates all ResetPasswordPage state and handlers.
 */
export function useResetPassword() {
  /**
   * Provides access to URL query parameters.
   */
  const [searchParams] = useSearchParams();

  /**
   * Extracts the reset token from the query string.
   */
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  /**
   * Stores the new password input value.
   */
  const [newPassword, setNewPassword] = useState("");

  /**
   * Stores the confirmation password input value.
   */
  const [confirmPassword, setConfirmPassword] = useState("");

  /**
   * Indicates whether the reset password request is currently running.
   */
  const [loading, setLoading] = useState(false);

  /**
   * Stores a success message after a successful reset.
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
   * Resets the form fields to their initial state.
   */
  function resetForm() {
    setNewPassword("");
    setConfirmPassword("");
  }

  /**
   * Handles the reset password form submission.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    resetMessages();

    const validationError = validateResetPasswordForm({
      token,
      newPassword,
      confirmPassword,
      t,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = buildResetPasswordPayload({
        token,
        newPassword,
      });

      await resetPassword(payload);

      setSuccessMessage(t("resetPassword.messages.success"));
      resetForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(getApiErrorMessage(err, t("resetPassword.messages.error")));
      } else {
        setError(t("resetPassword.messages.unexpected"));
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    confirmPassword,
    error,
    handleSubmit,
    loading,
    newPassword,
    setConfirmPassword,
    setNewPassword,
    successMessage,
    token,
  };
}
