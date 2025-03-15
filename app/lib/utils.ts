import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, startOfWeek, addDays } from "date-fns";

/**
 * Combines class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get an array of dates for the week containing the provided date
 */
export function getWeekDays(
  date: Date,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1,
) {
  const start = startOfWeek(date, { weekStartsOn });

  return Array(7)
    .fill(0)
    .map((_, i) => {
      return addDays(start, i);
    });
}

/**
 * Format a date for display
 */
export function formatDate(date: Date, formatString: string): string {
  return format(date, formatString);
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Sort events by time
 */
export function sortEventsByTime(events: Array<{ time: string }>) {
  return [...events].sort((a, b) => a.time.localeCompare(b.time));
}
