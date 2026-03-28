import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";

function LoginPage() {
  /**
   * Stores the current email input value.
   */
  const [email, setEmail] = useState("");

  /**
   * Stores the current password input value.
   */
  const [password, setPassword] = useState("");

  /**
   * Indicates whether the login request is currently in progress.
   */
  const [loading, setLoading] = useState(false);

  /**
   * Stores an error message to display when login fails.
   */
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Handles the form submission and signs in the user.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      const userData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      };

      login(userData);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed.");
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
                <h1 className="title is-3 mb-2">CloudDocs</h1>
                <p className="subtitle is-6 mb-0">
                  Sign in to access your document management panel.
                </p>
              </div>

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

                <div className="field">
                  <label className="label">Password</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={loading}
                      required
                    />
                    <span className="icon is-small is-left">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                  </div>
                </div>

                <div className="field is-grouped is-grouped-right mb-4">
                  <div className="control">
                    <Link to="/forgot-password" className="is-size-7">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div className="field">
                  <div className="control">
                    <button
                      type="submit"
                      className={`button is-primary is-fullwidth ${
                        loading ? "is-loading" : ""
                      }`}
                      disabled={loading}
                    >
                      <span className="icon">
                        <FontAwesomeIcon icon={faRightToBracket} />
                      </span>
                      <span>Sign In</span>
                    </button>
                  </div>
                </div>
              </form>

              <hr />

              <div className="has-text-centered">
                <p className="is-size-7 has-text-grey">
                  Secure internal access for authorized users only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
