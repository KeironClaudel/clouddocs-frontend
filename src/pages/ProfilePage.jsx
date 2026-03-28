import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

function ProfilePage() {
  const navigate = useNavigate();

  /**
   * Retrieves the stored user from localStorage.
   */
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-3">My Profile</h1>

        {!user ? (
          <article className="message is-danger">
            <div className="message-body">User information not available.</div>
          </article>
        ) : (
          <div className="box">
            <div className="content">
              <p>
                <strong>Full Name:</strong> {user.fullName}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>
            <div className="mt-4">
              <button
                className="button is-primary is-light"
                onClick={() => navigate("/change-password")}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faKey} />
                </span>
                <span>Change Password</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProfilePage;
