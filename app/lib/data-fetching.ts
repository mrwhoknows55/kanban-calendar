import { cache } from "react";
import { getEventDates, getEventsForDate, type Event } from "./calendar-data";
import { format } from "date-fns";

/**
 * Cached function to get all events
 * This uses React's cache() to prevent redundant fetches
 */
export const getEventsWithCache = cache(async () => {
  const eventDates = await getEventDates();

  // Create a record of events by date
  const events: Record<string, Event[]> = {};

  // Populate events for each date
  for (const date of eventDates) {
    const formattedDate = date; // Already in yyyy-MM-dd format
    const eventsForDate = await getEventsForDate(new Date(formattedDate));

    events[formattedDate] = eventsForDate.map((event) => ({
      ...event,
      fullDate:
        event.fullDate || format(new Date(formattedDate), "EEEE, MMMM d, yyyy"),
    }));
  }

  return events;
});

/**
 * Function to fetch updated events on the client side
 * This bypasses the cache to get fresh data
 */
export async function fetchUpdatedEvents() {
  const eventDates = await getEventDates();

  // Create a record of events by date
  const events: Record<string, Event[]> = {};

  // Populate events for each date
  for (const date of eventDates) {
    const formattedDate = date;
    const eventsForDate = await getEventsForDate(new Date(formattedDate));

    // Ensure each event has the fullDate property
    events[formattedDate] = eventsForDate.map((event) => ({
      ...event,
      fullDate:
        event.fullDate || format(new Date(formattedDate), "EEEE, MMMM d, yyyy"),
    }));
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

  const eventDates = await getEventDates();

  // Filter dates within the range
  const filteredDates = eventDates.filter((dateStr) => {
    const date = new Date(dateStr);
    return date >= start && date <= end;
  });

  const events: Record<string, Event[]> = {};

  // Populate events for each date in the range
  for (const date of filteredDates) {
    const eventsForDate = await getEventsForDate(new Date(date));

    // Ensure each event has the fullDate property
    events[date] = eventsForDate.map((event) => ({
      ...event,
      fullDate: event.fullDate || format(new Date(date), "EEEE, MMMM d, yyyy"),
    }));
  }

  return events;
}
