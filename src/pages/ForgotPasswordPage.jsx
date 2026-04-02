import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { forgotPassword } from "../services/authService";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";

function ForgotPasswordPage() {
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
   * Handles the forgot password form submission.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const data = await forgotPassword(email);

      setSuccessMessage(data?.message || t("forgotPassword.messages.success"));
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

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("forgotPassword.title")}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {t("forgotPassword.subtitle")}
            </p>
          </div>

          {successMessage && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("forgotPassword.form.email")}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              disabled={loading}
            >
              {loading
                ? t("forgotPassword.buttons.loading")
                : t("forgotPassword.buttons.submit")}
            </button>
          </form>

          <div className="my-6 border-t border-gray-200" />

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm text-blue-600 transition hover:text-blue-700 hover:underline"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>{t("forgotPassword.links.backToLogin")}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
