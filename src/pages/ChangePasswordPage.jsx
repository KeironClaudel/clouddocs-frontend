import { useState } from "react";
import axios from "axios";
import { changePassword } from "../services/authService";
import { getApiErrorMessage } from "../utils/errorUtils";

function ChangePasswordPage() {
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
   * Handles the change password form submission.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("The new password and confirmation password do not match.");
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setSuccessMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(getApiErrorMessage(err, "Failed to change password."));
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section app-section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-12-mobile is-8-tablet is-6-desktop">
            <div className="box">
              <h1 className="title is-3">Change Password</h1>
              <p className="subtitle is-6">
                Update your current password securely.
              </p>

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

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">Current Password</label>
                  <div className="control">
                    <input
                      className="input"
                      type="password"
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(event.target.value)
                      }
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

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
                      className={`button is-primary ${
                        loading ? "is-loading" : ""
                      }`}
                      disabled={loading}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChangePasswordPage;
