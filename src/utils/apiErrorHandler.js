/**
 * Utility function to handle API errors and extract meaningful messages for the user.
 */
export function resolveApiErrorMessage(error, fallbackMessage) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.title ||
      fallbackMessage
    );
  }

  return fallbackMessage;
}
