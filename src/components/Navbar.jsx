import { Link, useNavigate } from "react-router-dom";

/**
 * Displays the main navigation bar for authenticated pages.
 * Provides navigation links and a logout action.
 */

/**
 * Retrieves userData from localstorage for further usage.
 */
const userData = JSON.parse(localStorage.getItem("user") || "{}");

function Navbar() {
  const navigate = useNavigate();

  /**
   * Clears persisted authentication data and redirects the user to the login page.
   */
  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav>
      <h1>CloudDocs</h1>

      <div>
        {userData && <span>Welcome, {userData.fullName}</span>}

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/documents">Documents</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
