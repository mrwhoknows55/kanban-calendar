import { cache } from "react";
import { getEventDates, getEventsForDate, type Event } from "./calendar-data";
import { format } from "date-fns";
import { CalendarError, CalendarErrorCodes } from "./errors";

/**
 * Cached function to get all events
 * This uses React's cache() to prevent redundant fetches
 */
export const getEventsWithCache = cache(async () => {
  try {
    return await fetchUpdatedEvents();
  } catch (error) {
    console.error("Failed to fetch cached events:", error);
    throw new CalendarError(
      "Failed to fetch calendar events",
      CalendarErrorCodes.FETCH_FAILED,
      500,
    );
  }
});

/**
 * Function to fetch updated events on the client side
 * This bypasses the cache to get fresh data
 */
export async function fetchUpdatedEvents() {
  try {
    const eventDates = await getEventDates();

    // Create a record of events by date
    const events: Record<string, Event[]> = {};

    // Populate events for each date
    for (const date of eventDates) {
      try {
        const formattedDate = date;
        const eventsForDate = await getEventsForDate(new Date(formattedDate));

        // Ensure each event has the fullDate property
        events[formattedDate] = eventsForDate.map((event) => ({
          ...event,
          fullDate:
            event.fullDate ||
            format(new Date(formattedDate), "EEEE, MMMM d, yyyy"),
        }));
      } catch (error) {
        console.error(`Failed to fetch events for date ${date}:`, error);
        // Skip failed date but continue with others
        continue;
      }
    }

    if (Object.keys(events).length === 0) {
      throw new CalendarError(
        "No events could be fetched",
        CalendarErrorCodes.FETCH_FAILED,
        404,
      );
    }

    return events;
  } catch (error) {
    console.error("Failed to fetch updated events:", error);
    if (error instanceof CalendarError) {
      throw error;
    }
    throw new CalendarError(
      "Failed to fetch calendar events",
      CalendarErrorCodes.FETCH_FAILED,
      500,
    );
  }
}

/**
 * Function to fetch events for a specific date range
 * Useful for optimizing data fetching when only a specific range is needed
 */
export async function fetchEventsForDateRange(startDate: Date, endDate: Date) {
  try {
    let start = new Date(startDate);
    let end = new Date(endDate);

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new CalendarError(
        "Invalid date range provided",
        CalendarErrorCodes.INVALID_DATE,
        400,
      );
    }

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
      try {
        const eventsForDate = await getEventsForDate(new Date(date));

        // Ensure each event has the fullDate property
        events[date] = eventsForDate.map((event) => ({
          ...event,
          fullDate:
            event.fullDate || format(new Date(date), "EEEE, MMMM d, yyyy"),
        }));
      } catch (error) {
        console.error(`Failed to fetch events for date ${date}:`, error);
        // Skip failed date but continue with others
        continue;
      }
    }

    return events;
  } catch (error) {
    console.error("Failed to fetch events for date range:", error);
    if (error instanceof CalendarError) {
      throw error;
    }
    throw new CalendarError(
      "Failed to fetch events for date range",
      CalendarErrorCodes.FETCH_FAILED,
      500,
    );
  }
}
