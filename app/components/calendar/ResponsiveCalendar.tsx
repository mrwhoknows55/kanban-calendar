"use client";

import React, { useState, useEffect } from "react";
import { ClientCalendar } from "./ClientCalendar";
import { MobileKanbanCalendar } from "./MobileKanbanCalendar";
import {
  getEventDates,
  getEventsForDate,
  type Event,
} from "@/app/lib/calendar-data";

// Define the useMediaQuery hook directly in this file to avoid import issues
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Create a media query list
    const mediaQuery = window.matchMedia(query);

    // Set the initial value
    setMatches(mediaQuery.matches);

    // Define a callback function to handle changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the event listener
    mediaQuery.addEventListener("change", handleChange);

    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

interface ResponsiveCalendarProps {
  initialDate: Date;
}

export function ResponsiveCalendar({ initialDate }: ResponsiveCalendarProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [events, setEvents] = useState<Record<string, Event[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Add overflow hidden to body to prevent vertical scrolling
  useEffect(() => {
    // Save the original overflow style
    const originalOverflow = document.body.style.overflow;

    // Set overflow to hidden
    document.body.style.overflow = "hidden";

    // Restore original overflow on cleanup
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Fetch all events on component mount
  useEffect(() => {
    let isMounted = true;

    async function fetchEvents() {
      try {
        // Get all dates with events
        const eventDates = await getEventDates();

        // Create an object to store events by date
        const eventsByDate: Record<string, Event[]> = {};

        // Fetch events for each date
        const eventsPromises = eventDates.map(async (dateString) => {
          const date = new Date(dateString);
          const eventsForDate = await getEventsForDate(date);
          return { dateString, eventsForDate };
        });

        const results = await Promise.all(eventsPromises);

        results.forEach(({ dateString, eventsForDate }) => {
          eventsByDate[dateString] = eventsForDate;
        });

        if (isMounted) {
          setEvents(eventsByDate);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  // Use the mobile kanban calendar on small screens
  if (isMobile) {
    return (
      <div className="w-full h-screen overflow-hidden">
        <MobileKanbanCalendar initialDate={initialDate} events={events} />
      </div>
    );
  }

  // Use the client calendar on larger screens
  return (
    <div className="w-full h-screen overflow-hidden sm:max-w-md sm:rounded-lg sm:shadow-lg">
      <ClientCalendar initialDate={initialDate} />
    </div>
  );
}
