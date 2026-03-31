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
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">My Profile</h1>

        {!user ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            User information not available.
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Full Name:</span>{" "}
                {user.fullName}
              </p>

              <p>
                <span className="font-semibold text-gray-900">Email:</span>{" "}
                {user.email}
              </p>

              <p>
                <span className="font-semibold text-gray-900">Role:</span>{" "}
                {user.role}
              </p>
            </div>

            <div className="mt-6">
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                onClick={() => navigate("/change-password")}
              >
                <FontAwesomeIcon icon={faKey} />
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
