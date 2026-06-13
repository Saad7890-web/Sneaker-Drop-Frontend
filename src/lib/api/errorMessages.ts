export const API_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: "Invalid email or password.",
  USER_ALREADY_EXISTS: "An account with this email or username already exists.",
  UNAUTHORIZED: "Please sign in again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  DROP_NOT_FOUND: "The drop could not be found.",
  DROP_NOT_ACTIVE: "This drop is not active right now.",
  DROP_SOLD_OUT: "This drop is sold out.",
  RESERVATION_NOT_FOUND: "Reservation not found.",
  RESERVATION_EXPIRED: "This reservation has expired.",
  RESERVATION_ALREADY_EXISTS: "You already have an active reservation.",
  PURCHASE_NOT_ALLOWED: "You can only purchase a reserved item.",
  VALIDATION_ERROR: "Please check the form and try again.",
  RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
  CONCURRENCY_CONFLICT:
    "Stock changed while you were trying to reserve. Please try again.",
  INTERNAL_SERVER_ERROR: "Something went wrong on the server.",
};

export function getFriendlyErrorMessage(code?: string, fallback?: string) {
  if (!code) return fallback ?? "Something went wrong";
  return API_ERROR_MESSAGES[code] ?? fallback ?? "Something went wrong";
}
