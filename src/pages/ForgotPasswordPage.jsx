import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { forgotPassword } from "../services/authService";
import { getApiErrorMessage } from "../utils/errorUtils";

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

      setSuccessMessage(
        data?.message || "Password reset instructions were sent successfully.",
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          getApiErrorMessage(
            err,
            "Failed to process the password reset request.",
          ),
        );
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
                <h1 className="title is-3 mb-2">Forgot Password</h1>
                <p className="subtitle is-6 mb-0">
                  Enter your institutional email to receive a reset link.
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

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={loading}
                      required
                    />
                    <span className="icon is-small is-left">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
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
                      Send Reset Link
                    </button>
                  </div>
                </div>
              </form>

              <hr />

              <div className="has-text-centered">
                <Link to="/login" className="is-size-7">
                  <span className="icon mr-1">
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </span>
                  <span>Back to login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
