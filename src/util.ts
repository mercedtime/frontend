export function formatDate(date: Date): string {
  let diffMs = new Date().getTime() - date.getTime();
  let diffSec = Math.round(diffMs / 1000);
  let diffMin = diffSec / 60;
  let diffHour = diffMin / 60;
  let diffDay = diffHour / 24;

  if (diffSec < 1) {
    return "right now";
  } else if (diffMin < 1) {
    return `${Math.round(diffSec)} seconds ago`;
  } else if (diffHour < 1) {
    return `${Math.round(diffMin)} minutes ago`;
  } else if (diffDay < 1.0) {
    return `${diffHour.toFixed(1)} hours ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });
  }
}
