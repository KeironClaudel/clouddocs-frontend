/**
 * Extracts a readable error message from common API error response shapes.
 */
export function getApiErrorMessage(error, fallbackMessage) {
  const data = error?.response?.data;

  if (!data) {
    return fallbackMessage;
  }

  if (typeof data.message === "string" && data.message.trim() !== "") {
    return data.message;
  }

  if (data.errors && typeof data.errors === "object") {
    const firstFieldErrors = Object.values(data.errors).find(
      (value) => Array.isArray(value) && value.length > 0,
    );

    if (firstFieldErrors) {
      return firstFieldErrors[0];
    }
  }

  if (typeof data.title === "string" && data.title.trim() !== "") {
    return data.title;
  }

  return fallbackMessage;
}
