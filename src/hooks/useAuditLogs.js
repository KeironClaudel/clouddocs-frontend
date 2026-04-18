import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAuditLogs } from "../services/auditService";
import { getApiErrorMessage } from "../utils/errorUtils";
import {
  buildAuditLogsParams,
  getInitialAuditFilters,
} from "../mappers/auditMappers";
import { getUniqueValues } from "../utils/collectionUtils";
import { resolveApiErrorMessage } from "../utils/apiErrorHandler";
import { t } from "../i18n";

/**
 * Encapsulates all AuditLogsPage state and handlers.
 */
export function useAuditLogs() {
  /**
   * Stores the audit log list returned by the API.
   */
  const [auditLogs, setAuditLogs] = useState([]);

  /**
   * Stores the current filter values for the audit table. Initialized from URL parameters.
   */
  const [filters, setFilters] = useState(getInitialAuditFilters());
  /**
   * Pagination state.
   */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  /**
   * Stores URL search parameters.
   */
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Debounced filters used for API requests.
   */
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  /**
   * Indicates whether audit logs are currently loading.
   */
  const [loading, setLoading] = useState(true);

  /**
   * Stores a page-level error message.
   */
  const [error, setError] = useState("");

  /**
   * Defines the columns displayed in the audit log table.
   */
  const auditLogTableColumns = [
    { key: "userId", label: t("auditLogs.table.userId") },
    { key: "action", label: t("auditLogs.table.action") },
    { key: "module", label: t("auditLogs.table.module") },
    { key: "entityName", label: t("auditLogs.table.entity") },
    { key: "entityId", label: t("auditLogs.table.entityId") },
    { key: "details", label: t("auditLogs.table.details") },
    { key: "ipAddress", label: t("auditLogs.table.ip") },
    { key: "date", label: t("auditLogs.table.date") },
  ];

  /**
   * Calculates total pages based on backend metadata.
   */
  const totalPages = Math.ceil(totalCount / pageSize);

  /**
   * Loads audit logs from the backend using pagination and filters.
   */
  async function loadAuditLogs({
    pageParam,
    filtersParam,
    pageSizeParam,
  } = {}) {
    try {
      setLoading(true);
      setError("");

      const effectivePage = pageParam ?? 1;
      const effectiveFilters = filtersParam ?? debouncedFilters;
      const effectivePageSize = pageSizeParam ?? pageSize;

      const params = buildAuditLogsParams({
        page: effectivePage,
        pageSize: effectivePageSize,
        filters: effectiveFilters,
      });

      const data = await getAuditLogs(params);

      setAuditLogs(data.items || []);
      setPage(data.page || effectivePage);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(resolveApiErrorMessage(err, t("auditLogs.loadError")));
    } finally {
      setLoading(false);
    }
  }

  /**
   * Debounces filters to avoid sending a request on every keystroke/change immediately.
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 400);

    return () => clearTimeout(timeout);
  }, [filters]);

  /**
   * Syncs API loading with URL page and debounced filters.
   * This is the single source of truth for fetching data.
   */
  useEffect(() => {
    const pageFromUrl = Number(searchParams.get("page")) || 1;

    loadAuditLogs({
      pageParam: pageFromUrl,
      filtersParam: debouncedFilters,
      pageSizeParam: pageSize,
    });
  }, [searchParams, debouncedFilters, pageSize]);

  /**
   * Moves to the next page by updating the URL.
   */
  function handleNextPage() {
    const currentPage = Number(searchParams.get("page")) || 1;

    if (currentPage < totalPages) {
      setSearchParams({ page: String(currentPage + 1) });
    }
  }

  /**
   * Moves to the previous page by updating the URL.
   */
  function handlePreviousPage() {
    const currentPage = Number(searchParams.get("page")) || 1;

    if (currentPage > 1) {
      setSearchParams({ page: String(currentPage - 1) });
    }
  }

  /**
   * Updates audit filter state when an input changes.
   * Resets pagination back to page 1.
   */
  function handleFilterChange(e) {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSearchParams({ page: "1" });
  }

  /**
   * Clears all audit filters and resets pagination.
   */
  function handleClearFilters() {
    setFilters(getInitialAuditFilters());
    setSearchParams({ page: "1" });
  }

  /**
   * Builds unique user ID options from currently loaded logs.
   */
  const userOptions = useMemo(() => {
    return getUniqueValues(auditLogs, "userId");
  }, [auditLogs]);

  /**
   * Builds unique action options from currently loaded logs.
   */
  const actionOptions = useMemo(() => {
    return getUniqueValues(auditLogs, "action");
  }, [auditLogs]);

  /**
   * Builds unique module options from currently loaded logs.
   */
  const moduleOptions = useMemo(() => {
    return getUniqueValues(auditLogs, "module");
  }, [auditLogs]);

  return {
    actionOptions,
    auditLogTableColumns,
    auditLogs,
    error,
    filters,
    handleClearFilters,
    handleFilterChange,
    handleNextPage,
    handlePreviousPage,
    loading,
    moduleOptions,
    page,
    pageSize,
    setPageSize,
    setSearchParams,
    totalCount,
    totalPages,
    userOptions,
  };
}
