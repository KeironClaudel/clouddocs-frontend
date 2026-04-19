import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faFilePdf,
  faFolderOpen,
  faUsers,
  faUserCheck,
  faUserSlash,
  faBuilding,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { isAdmin } from "../utils/permissionUtils";
import { t } from "../i18n";
import { useDashboard } from "../hooks/useDashboard";

function DashboardPage() {
  const { user } = useAuth();
  const { error, loading, stats } = useDashboard(user);

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("dashboard.title")}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t("dashboard.welcome")},{" "}
            {user?.fullName || t("dashboard.defaultUser")}.
          </p>
        </div>

        {loading && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {t("dashboard.loading")}
          </div>
        )}

        {!loading && error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("dashboard.cards.documents")}
                  </h2>
                  <span className="text-red-500">
                    <FontAwesomeIcon icon={faFilePdf} size="lg" />
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalDocuments}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {t("dashboard.cards.totalDocuments")}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("dashboard.cards.clients")}
                  </h2>
                  <span className="text-cyan-500">
                    <FontAwesomeIcon icon={faBuilding} size="lg" />
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalClients ?? 0}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {t("dashboard.cards.totalClients")}
                </p>
              </div>

              {isAdmin(user) && (
                <>
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {t("dashboard.cards.users")}
                      </h2>
                      <span className="text-blue-500">
                        <FontAwesomeIcon icon={faUsers} size="lg" />
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalUsers ?? 0}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {t("dashboard.cards.totalUsers")}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {t("dashboard.cards.activeUsers")}
                      </h2>
                      <span className="text-green-500">
                        <FontAwesomeIcon icon={faUserCheck} size="lg" />
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.activeUsers ?? 0}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {t("dashboard.cards.activeUsersDesc")}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {t("dashboard.cards.inactiveUsers")}
                      </h2>
                      <span className="text-amber-500">
                        <FontAwesomeIcon icon={faUserSlash} size="lg" />
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.inactiveUsers ?? 0}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {t("dashboard.cards.inactiveUsersDesc")}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {t("dashboard.cards.activeClients")}
                      </h2>
                      <span className="text-green-500">
                        <FontAwesomeIcon icon={faUserTie} size="lg" />
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.activeClients ?? 0}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {t("dashboard.cards.activeClientsDesc")}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {t("dashboard.cards.inactiveClients")}
                      </h2>
                      <span className="text-amber-500">
                        <FontAwesomeIcon icon={faUserSlash} size="lg" />
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.inactiveClients ?? 0}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {t("dashboard.cards.inactiveClientsDesc")}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                {t("dashboard.quickAccess.title")}
              </h2>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/documents"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  <FontAwesomeIcon icon={faFolderOpen} />
                  <span>{t("dashboard.quickAccess.documents")}</span>
                </Link>

                <Link
                  to="/clients"
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-50 px-4 py-2.5 text-sm font-medium text-teal-700 transition hover:bg-teal-100"
                >
                  <FontAwesomeIcon icon={faBuilding} />
                  <span>{t("dashboard.quickAccess.clients")}</span>
                </Link>

                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-50 px-4 py-2.5 text-sm font-medium text-cyan-700 transition hover:bg-cyan-100"
                >
                  <FontAwesomeIcon icon={faAddressCard} />
                  <span>{t("dashboard.quickAccess.profile")}</span>
                </Link>

                {isAdmin(user) && (
                  <Link
                    to="/users"
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    <span>{t("dashboard.quickAccess.users")}</span>
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
