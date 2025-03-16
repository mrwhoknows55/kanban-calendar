"use server";

import { cookies } from "next/headers";
import { format, parse } from "date-fns";

/**
 * Set the selected date in a cookie
 */
export async function setSelectedDate(date: Date) {
  const cookieStore = await cookies();
  const dateString = format(date, "yyyy-MM-dd");

  // Set the cookie with a 7-day expiration
  cookieStore.set("selectedDate", dateString, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    path: "/",
  });

  return { success: true };
}

/**
 * Get the selected date from cookies or return today's date
 */
export async function getSelectedDate(): Promise<Date> {
  const cookieStore = await cookies();
  const selectedDateCookie = cookieStore.get("selectedDate");

  if (selectedDateCookie?.value) {
    // Parse the date from the cookie
    return parse(selectedDateCookie.value, "yyyy-MM-dd", new Date());
  }

  // Default to today if no cookie exists
  return new Date();
}
