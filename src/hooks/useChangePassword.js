import { useState } from "react";
import axios from "axios";
import { changePassword } from "../services/authService";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";

/**
 * Encapsulates all ChangePasswordPage state and handlers.
 */
export function useChangePassword() {
  /**
   * Stores the current password input value.
   */
  const [currentPassword, setCurrentPassword] = useState("");

  /**
   * Stores the new password input value.
   */
  const [newPassword, setNewPassword] = useState("");

  /**
   * Stores the confirmation password input value.
   */
  const [confirmPassword, setConfirmPassword] = useState("");

  /**
   * Indicates whether the change password request is currently running.
   */
  const [loading, setLoading] = useState(false);

  /**
   * Stores a success message after a successful password change.
   */
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * Stores an error message when the request fails.
   */
  const [error, setError] = useState("");

  /**
   * Resets the form fields to their initial state.
   */
  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  /**
   * Handles the change password form submission.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError(t("changePassword.messages.mismatch"));
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setSuccessMessage(t("changePassword.messages.success"));
      resetForm();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(getApiErrorMessage(err, t("changePassword.messages.error")));
      } else {
        setError(t("changePassword.messages.unexpected"));
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    confirmPassword,
    currentPassword,
    error,
    handleSubmit,
    loading,
    newPassword,
    setConfirmPassword,
    setCurrentPassword,
    setNewPassword,
    successMessage,
  };
}
