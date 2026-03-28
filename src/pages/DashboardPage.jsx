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
        const data = await getDashboardStats(user?.role === "Admin");
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
    <section className="section app-section">
      <div className="container">
        <div className="mb-5">
          <h1 className="title is-2">Dashboard</h1>
          <p className="subtitle is-6">
            Welcome back, {user?.fullName || "User"}.
          </p>
        </div>

        {loading && (
          <article className="message is-info">
            <div className="message-body">Loading dashboard data...</div>
          </article>
        )}

        {!loading && error && (
          <article className="message is-danger">
            <div className="message-body">{error}</div>
          </article>
        )}

        {!loading && !error && (
          <>
            <div className="columns is-multiline">
              <div className="column is-12-mobile is-6-tablet is-3-desktop">
                <div className="box dashboard-stat">
                  <div className="is-flex is-align-items-center is-justify-content-space-between mb-3">
                    <h2 className="title is-5 mb-0">Documents</h2>
                    <span className="icon is-medium has-text-danger">
                      <FontAwesomeIcon icon={faFilePdf} size="lg" />
                    </span>
                  </div>
                  <p className="is-size-3 has-text-weight-bold">
                    {stats.totalDocuments}
                  </p>
                  <p className="has-text-grey is-size-7">
                    Total registered documents
                  </p>
                </div>
              </div>

              {user?.role === "Admin" && (
                <>
                  <div className="column is-12-mobile is-6-tablet is-3-desktop">
                    <div className="box dashboard-stat">
                      <div className="is-flex is-align-items-center is-justify-content-space-between mb-3">
                        <h2 className="title is-5 mb-0">Users</h2>
                        <span className="icon is-medium has-text-link">
                          <FontAwesomeIcon icon={faUsers} size="lg" />
                        </span>
                      </div>
                      <p className="is-size-3 has-text-weight-bold">
                        {stats.totalUsers ?? 0}
                      </p>
                      <p className="has-text-grey is-size-7">
                        Total registered users
                      </p>
                    </div>
                  </div>

                  <div className="column is-12-mobile is-6-tablet is-3-desktop">
                    <div className="box dashboard-stat">
                      <div className="is-flex is-align-items-center is-justify-content-space-between mb-3">
                        <h2 className="title is-5 mb-0">Active Users</h2>
                        <span className="icon is-medium has-text-success">
                          <FontAwesomeIcon icon={faUserCheck} size="lg" />
                        </span>
                      </div>
                      <p className="is-size-3 has-text-weight-bold">
                        {stats.activeUsers ?? 0}
                      </p>
                      <p className="has-text-grey is-size-7">
                        Accounts currently active
                      </p>
                    </div>
                  </div>

                  <div className="column is-12-mobile is-6-tablet is-3-desktop">
                    <div className="box dashboard-stat">
                      <div className="is-flex is-align-items-center is-justify-content-space-between mb-3">
                        <h2 className="title is-5 mb-0">Inactive Users</h2>
                        <span className="icon is-medium has-text-warning">
                          <FontAwesomeIcon icon={faUserSlash} size="lg" />
                        </span>
                      </div>
                      <p className="is-size-3 has-text-weight-bold">
                        {stats.inactiveUsers ?? 0}
                      </p>
                      <p className="has-text-grey is-size-7">
                        Accounts currently inactive
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="box mt-5">
              <h2 className="title is-4">Quick Access</h2>

              <div className="buttons mt-4">
                <Link to="/documents" className="button is-link is-light">
                  <span className="icon">
                    <FontAwesomeIcon icon={faFolderOpen} />
                  </span>
                  <span>Documents</span>
                </Link>

                <Link to="/profile" className="button is-info is-light">
                  <span className="icon">
                    <FontAwesomeIcon icon={faAddressCard} />
                  </span>
                  <span>Profile</span>
                </Link>

                {user?.role === "Admin" && (
                  <Link to="/users" className="button is-primary is-light">
                    <span className="icon">
                      <FontAwesomeIcon icon={faUsers} />
                    </span>
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
