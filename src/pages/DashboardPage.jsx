import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faFilePdf,
  faFolderOpen,
  faUsers,
  faUserCheck,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats } from "../services/dashboardService";
import { isAdmin } from "../utils/permissionUtils";

function DashboardPage() {
  const { user } = useAuth();

  /**
   * Stores the dashboard statistics displayed in the cards.
   */
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalUsers: null,
    activeUsers: null,
    inactiveUsers: null,
  });

  /**
   * Indicates whether dashboard data is currently loading.
   */
  const [loading, setLoading] = useState(true);

  /**
   * Stores a dashboard error message when loading fails.
   */
  const [error, setError] = useState("");

  /**
   * Loads dashboard metrics when the page is rendered.
   */
  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboardStats(isAdmin(user));
        setStats(data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load dashboard.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user?.role]);

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back, {user?.fullName || "User"}.
          </p>
        </div>

        {loading && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Loading dashboard data...
          </div>
        )}

        {!loading && error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Documents
                  </h2>
                  <span className="text-red-500">
                    <FontAwesomeIcon icon={faFilePdf} size="lg" />
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalDocuments}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Total registered documents
                </p>
              </div>

              {user?.role === "Admin" && (
                <>
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Users
                      </h2>
                      <span className="text-blue-500">
                        <FontAwesomeIcon icon={faUsers} size="lg" />
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalUsers ?? 0}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Total registered users
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Active Users
                      </h2>
                      <span className="text-green-500">
                        <FontAwesomeIcon icon={faUserCheck} size="lg" />
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.activeUsers ?? 0}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Accounts currently active
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Inactive Users
                      </h2>
                      <span className="text-amber-500">
                        <FontAwesomeIcon icon={faUserSlash} size="lg" />
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.inactiveUsers ?? 0}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Accounts currently inactive
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                Quick Access
              </h2>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/documents"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  <FontAwesomeIcon icon={faFolderOpen} />
                  <span>Documents</span>
                </Link>

                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-50 px-4 py-2.5 text-sm font-medium text-cyan-700 transition hover:bg-cyan-100"
                >
                  <FontAwesomeIcon icon={faAddressCard} />
                  <span>Profile</span>
                </Link>

                {user?.role === "Admin" && (
                  <Link
                    to="/users"
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Users</span>
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default DashboardPage;
