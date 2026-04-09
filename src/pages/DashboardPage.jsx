import { t } from "../i18n";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../hooks/useDashboard";
import { canManageAdminPanels } from "../utils/permissionUtils";

function DashboardPage() {
  const { user } = useAuth();
  const { error, loading, summary } = useDashboard();

  const canManage = canManageAdminPanels(user);

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("dashboard.title")}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t("dashboard.welcome")}{" "}
            {user?.fullName || t("dashboard.defaultUser")}
          </p>
        </div>

        {loading && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {t("dashboard.messages.loading")}
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && summary && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  {t("dashboard.cards.documents")}
                </p>
                <p className="mt-3 text-3xl font-bold text-gray-900">
                  {summary.totalDocuments ?? 0}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  {t("dashboard.cards.users")}
                </p>
                <p className="mt-3 text-3xl font-bold text-gray-900">
                  {summary.totalUsers ?? 0}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  {t("dashboard.cards.categories")}
                </p>
                <p className="mt-3 text-3xl font-bold text-gray-900">
                  {summary.totalCategories ?? 0}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  {t("dashboard.cards.documentTypes")}
                </p>
                <p className="mt-3 text-3xl font-bold text-gray-900">
                  {summary.totalDocumentTypes ?? 0}
                </p>
              </div>
            </div>

            {canManage && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("dashboard.sections.adminOverview")}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {t("dashboard.sections.adminOverviewDescription")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default DashboardPage;
