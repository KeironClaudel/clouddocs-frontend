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
    <section className="login-page section is-flex is-align-items-center is-justify-content-center">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-11-mobile is-8-tablet is-5-desktop is-4-widescreen">
            <div className="box login-box">
              <div className="has-text-centered mb-5">
                <h1 className="title is-3 mb-2">Reset Password</h1>
                <p className="subtitle is-6 mb-0">
                  Enter your new password to restore access to your account.
                </p>
              </div>

              {successMessage && (
                <article className="message is-success">
                  <div className="message-body">{successMessage}</div>
                </article>
              )}

              {error && (
                <article className="message is-danger">
                  <div className="message-body">{error}</div>
                </article>
              )}

              {!token ? (
                <article className="message is-warning">
                  <div className="message-body">
                    The reset link is invalid or incomplete.
                  </div>
                </article>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label">New Password</label>
                    <div className="control">
                      <input
                        className="input"
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Confirm New Password</label>
                    <div className="control">
                      <input
                        className="input"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="field mt-5">
                    <div className="control">
                      <button
                        type="submit"
                        className={`button is-primary is-fullwidth ${
                          loading ? "is-loading" : ""
                        }`}
                        disabled={loading}
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <hr />

              <div className="has-text-centered">
                <Link to="/login" className="is-size-7">
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResetPasswordPage;
