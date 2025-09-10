/**
 * Convert an ISO date string into local time (HH:mm, 24-hour).
 *
 * @param isoString - ISO date string (e.g. "2025-09-12T09:40:42Z")
 * @returns Local system time as "HH:mm"
 */
const formatIsoToLocalTime = (isoString: string): string => {
  const date = new Date(isoString);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default formatIsoToLocalTime;
