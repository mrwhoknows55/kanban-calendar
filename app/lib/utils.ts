import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

/**
 * Combines multiple class names and merges Tailwind CSS classes
 * This is useful for conditionally applying classes and merging them with Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//  Format a date for display
export function formatDate(date: Date, formatString: string): string {
  return format(date, formatString);
}

// Helper function to convert time string to comparable value
export const getTimeValue = (timeStr: string) => {
  const [time, period] = timeStr.split(" ");
  const [hour, minutes] = time.split(":").map(Number);
  let hours = hour;

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};
