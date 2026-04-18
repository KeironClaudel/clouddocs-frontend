import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import { isAdmin } from "../utils/permissionUtils";
import { getInitialDashboardStats } from "../mappers/dashboardMappers";
import { t } from "../i18n";
import { resolveApiErrorMessage } from "../utils/apiErrorHandler";

/**
 * Encapsulates all DashboardPage state and handlers.
 */
export function useDashboard(user) {
  /**
   * Stores the dashboard statistics displayed in the cards.
   */
  const [stats, setStats] = useState(getInitialDashboardStats());

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
        setLoading(true);
        setError("");

        const data = await getDashboardStats(isAdmin(user));
        setStats(data);
      } catch (err) {
        setError(resolveApiErrorMessage(err, t("dashboard.loadError")));
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user?.role]);

  return {
    error,
    loading,
    stats,
  };
}
