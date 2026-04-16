import { useState } from "react";
import axios from "axios";
import { forgotPassword } from "../services/authService";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";
import { useNavigate } from "react-router-dom";

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
  // async function handleSubmit(event) {
  //   event.preventDefault();

  //   resetMessages();
  //   setLoading(true);

  //   try {
  //     const data = await forgotPassword(email);

  //     setSuccessMessage(data?.message || t("forgotPassword.messages.success"));
  //   } catch (err) {
  //     if (axios.isAxiosError(err)) {
  //       setError(getApiErrorMessage(err, t("forgotPassword.messages.error")));
  //     } else {
  //       setError(t("forgotPassword.messages.unexpected"));
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setSuccessMessage(
      "Demo: El flujo del cambio de contraseña está en desarrollo. Redirigiendo...",
    );

    setTimeout(() => {
      navigate("/under-construction");
    }, 1200);
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
