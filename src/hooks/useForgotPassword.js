import { useState } from "react";
import axios from "axios";
import { forgotPassword } from "../services/authService";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";
import { useNavigate } from "react-router-dom";
import { validateForgotPasswordForm } from "../validators/forgotPasswordValidators";
import { buildForgotPasswordPayload } from "../mappers/authMappers";

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

  const navigate = useNavigate();

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
      // DEMO MODE
      setSuccessMessage(
        "Demo: El flujo del cambio de contraseña está en desarrollo. Redirigiendo...",
      );

      setTimeout(() => {
        navigate("/under-construction");
      }, 1200);

      // REAL MODE (leave ready for later)
      // const payload = buildForgotPasswordPayload({ email });
      // const data = await forgotPassword(payload);
      // setSuccessMessage(
      //   data?.message || t("forgotPassword.messages.success"),
      // );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(getApiErrorMessage(err, t("forgotPassword.messages.error")));
      } else {
        setError(t("forgotPassword.messages.unexpected"));
      }
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
