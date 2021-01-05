export const TOKEN_KEY = "token";

export function isLoggedIn(): boolean {
  return localStorage.getItem(TOKEN_KEY) !== null;
}

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

export function isEmail(s: string): boolean {
  // https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression
  if (
    s.match(
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    )
  ) {
    return true;
  }
  return false;
}
