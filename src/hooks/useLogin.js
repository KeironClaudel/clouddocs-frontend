import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { t } from "../i18n";
import { validateLoginForm } from "../validators/loginValidators";
import { buildLoginPayload } from "../mappers/authMappers";

/**
 * Encapsulates all LoginPage state and handlers.
 */
export function useLogin() {
  /**
   * Stores the current email input value.
   */
  const [email, setEmail] = useState("");

  /**
   * Stores the current password input value.
   */
  const [password, setPassword] = useState("");

  /**
   * Indicates whether the login request is currently running.
   */
  const [loading, setLoading] = useState(false);

  /**
   * Stores an error message when login fails.
   */
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Handles the login form submission.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const validationError = validateLoginForm({
      email,
      password,
      t,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = buildLoginPayload({
        email,
        password,
      });

      const data = await loginUser(payload);

      login(data);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || t("login.messages.error"));
      } else {
        setError(t("login.messages.unexpected"));
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
    password,
    setEmail,
    setPassword,
  };
}
