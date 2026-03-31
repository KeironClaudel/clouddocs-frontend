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
    <section className="min-h-screen bg-gray-100 px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">CloudDocs</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your document management panel.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 transition hover:text-blue-700 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              disabled={loading}
            >
              <span className={loading ? "hidden" : "inline-flex items-center"}>
                <FontAwesomeIcon icon={faRightToBracket} />
              </span>
              <span>{loading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>

          <div className="my-6 border-t border-gray-200" />

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Secure internal access for authorized users only.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
