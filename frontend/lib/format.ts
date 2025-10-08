export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
};

export const formatClock = (seconds: number): string => {
  const sign = seconds < 0 ? "-" : "";
  const absSeconds = Math.abs(Math.round(seconds)); // round to nearest whole second
  const mins = Math.floor(absSeconds / 60);
  const secs = absSeconds % 60;
  return `${sign}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// variant "compact" matches the simple dashboard behavior (includes "yesterday")
// variant "detailed" matches the progress page: falls back to a short date after a week
export const formatTimeAgo = (
  dateString: string,
  variant: "compact" | "detailed" = "compact",
): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (variant === "compact") {
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "yesterday";
    return `${days}d ago`;
  }

  if (hours < 1) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export const formatDateLong = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
