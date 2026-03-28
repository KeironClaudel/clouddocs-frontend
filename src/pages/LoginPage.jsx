import { useState } from "react";
import axios from "axios";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();

  /**
   * Stores the current email input value
   */
  const [email, setEmail] = useState("");

  /**
   * Stores the current password input value
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

  /**
   * Handles the form submission and sends credentials to the backend.
   */
  async function handleSubmit(e) {
    e.preventDefault();

    /**
     * Clears any previous error before starting a new request.
     */
    setError("");

    /**
     * Activates the loading state to disable inputs and prevent duplicate submissions.
     */
    setLoading(true);

    try {
      const credentials = {
        email,
        password,
      };

      /**
       * Calls the authentication service to perform login request
       */
      const data = await loginUser(credentials);
      console.log("Logging Succesful: ", data);

      /**
       * Persists the JWT locally for future authenticated requests.
       */
      const userData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      };
      login(userData);

      /**
       * Redirects the user to the dashboard after successful authentication.
       */
      navigate("/dashboard");
    } catch (err) {
      /**
       * Handles known Axios errors and provides a readable message for the UI.
       */
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      /**
       * Ends the loading state regardless of the request result.
       */
      setLoading(false);
    }
  }

  return (
    <div>
      <h2> Login </h2>
      <p>Enter your credentials to access CloudDocs.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default LoginPage;
