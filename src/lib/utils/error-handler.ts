/**
 * Safely extracts a dynamic human-readable error message from backend API response payloads,
 * including standard FastAPI 422 detail arrays, custom JSON error payloads, and JS Error objects.
 */
export function getDynamicErrorMessage(error: any, fallback: string = "An error occurred"): string {
  if (!error) return fallback;

  // Extract response data from various client patterns (fetch, axios, custom wrapper)
  const data = error?.data ?? error?.response?.data ?? (typeof error === "object" && !("message" in error) ? error : null);

  if (data) {
    // 1. FastAPI standard validation error detail array: [{ loc: [...], msg: "..." }]
    if (Array.isArray(data.detail)) {
      const messages = data.detail
        .map((item: any) => {
          if (typeof item === "string") return item;
          if (item?.msg) {
            const loc = Array.isArray(item.loc)
              ? item.loc.filter((l: any) => l !== "body" && l !== "path" && l !== "query").join(".")
              : "";
            return loc ? `${loc}: ${item.msg}` : item.msg;
          }
          if (item?.message) return item.message;
          return null;
        })
        .filter(Boolean);

      if (messages.length > 0) {
        return messages.join("; ");
      }
    }

    // 2. Single detail string
    if (typeof data.detail === "string" && data.detail.trim()) {
      return data.detail;
    }

    // 3. Single message string inside data payload
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }

    // 4. Single error string
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }
  }

  // Fallback to top-level Error object message or string error
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
}
