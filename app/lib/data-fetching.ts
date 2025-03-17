import { cache } from "react";
import { getEventDates, getEventsForDate, type Event } from "./calendar-data";

/**
 * Cached function to get all events
 * This uses React's cache() to prevent redundant fetches
 */
export const getEventsWithCache = cache(async () => {
  // Get all event dates
  const eventDates = await getEventDates();

  // Create a record of events by date
  const events: Record<string, Event[]> = {};

  // Populate events for each date
  for (const date of eventDates) {
    const formattedDate = date; // Already in yyyy-MM-dd format
    events[formattedDate] = await getEventsForDate(new Date(formattedDate));
  }

  return events;
});

/**
 * Function to fetch updated events on the client side
 * This bypasses the cache to get fresh data
 */
export async function fetchUpdatedEvents() {
  // Get all event dates
  const eventDates = await getEventDates();

  // Create a record of events by date
  const events: Record<string, Event[]> = {};

  // Populate events for each date
  for (const date of eventDates) {
    const formattedDate = date; // Already in yyyy-MM-dd format
    events[formattedDate] = await getEventsForDate(new Date(formattedDate));
  }

  return events;
}

/**
 * Function to fetch events for a specific date range
 * Useful for optimizing data fetching when only a specific range is needed
 */
export async function fetchEventsForDateRange(startDate: Date, endDate: Date) {
  let start = new Date(startDate);
  let end = new Date(endDate);

  // Ensure dates are in ascending order
  if (start > end) {
    const temp = start;
    start = end;
    end = temp;
  }

  // Get all event dates
  const eventDates = await getEventDates();

  // Filter dates within the range
  const filteredDates = eventDates.filter((dateStr) => {
    const date = new Date(dateStr);
    return date >= start && date <= end;
  });

  // Create a record of events by date
  const events: Record<string, Event[]> = {};

  // Populate events for each date in the range
  for (const date of filteredDates) {
    events[date] = await getEventsForDate(new Date(date));
  }

  return events;
}
