import { useEffect, useState } from "react";
import axios from "axios";
import { getDashboardSummary } from "../services/dashboardService";
import { getApiErrorMessage } from "../utils/errorUtils";
import { t } from "../i18n";

/**
 * Encapsulates all DashboardPage state and handlers.
 */
export function useDashboard() {
  /**
   * Stores the dashboard summary returned by the backend.
   */
  const [summary, setSummary] = useState(null);

  /**
   * Indicates whether the dashboard request is currently running.
   */
  const [loading, setLoading] = useState(true);

  /**
   * Stores an error message when dashboard loading fails.
   */
  const [error, setError] = useState("");

  /**
   * Loads dashboard summary data.
   */
  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(getApiErrorMessage(err, t("dashboard.messages.loadError")));
        } else {
          setError(t("dashboard.messages.unexpected"));
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return {
    error,
    loading,
    summary,
  };
}
