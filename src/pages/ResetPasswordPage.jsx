import { useMemo, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";
import { getApiErrorMessage } from "../utils/errorUtils";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  /**
   * Extracts the reset token from the URL query string.
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
   * Stores a success message after a successful password reset.
   */
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * Stores an error message when the request fails.
   */
  const [error, setError] = useState("");

  /**
   * Handles the reset password form submission.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!token) {
      setError("The reset token is missing or invalid.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new password and confirmation password do not match.");
      return;
    }

    setLoading(true);

    try {
      /**
       * Adjust the payload keys if your backend uses different property names.
       */
      await resetPassword({
        token,
        newPassword,
      });

      setSuccessMessage("Your password has been reset successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(getApiErrorMessage(err, "Failed to reset password."));
      } else {
        setError("An unexpected error occurred.");
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
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password to restore access to your account.
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

          {!token ? (
            <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
              The reset link is invalid or incomplete.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="my-6 border-t border-gray-200" />

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-blue-600 transition hover:text-blue-700 hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResetPasswordPage;
