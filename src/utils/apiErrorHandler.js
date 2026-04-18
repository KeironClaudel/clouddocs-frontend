/**
 * Utility function to handle API errors and extract meaningful messages for the user.
 */
export function resolveApiError(err, fallbackMessage, t) {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || fallbackMessage;
  }

  return t("common.unexpected");
}
