"use client";

import { useState, useEffect } from "react";
import { type Event } from "./calendar-data";
import { format } from "date-fns";
import { getTimeValue } from "./utils";

interface UseCalendarEventsProps {
  initialEvents: Record<string, Event[]>;
}

interface UseCalendarEventsReturn {
  events: Record<string, Event[]>;
  moveEvent: (eventId: string, sourceDate: string, targetDate: string) => void;
  addEvent: (event: Event, date: string) => void;
  removeEvent: (eventId: string, date: string) => void;
}

//  Custom hook for managing calendar events with drag and drop functionality
export function useCalendarEvents({
  initialEvents,
}: UseCalendarEventsProps): UseCalendarEventsReturn {
  const [events, setEvents] = useState<Record<string, Event[]>>(initialEvents);

  // Update events when initialEvents prop changes
  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  /**
   * Move an event from one date to another
   */
  const moveEvent = (
    eventId: string,
    sourceDate: string,
    targetDate: string,
  ) => {
    // Don't do anything if source and target are the same
    if (sourceDate === targetDate) return;

    setEvents((prevEvents) => {
      // Create a deep copy of the events object
      const newEvents = { ...prevEvents };

      // Find the event in the source date
      const sourceEvents = [...(newEvents[sourceDate] || [])];
      const eventIndex = sourceEvents.findIndex((e) => e.id === eventId);

      // If event not found, do nothing
      if (eventIndex === -1) return prevEvents;

      // Get the event and create a deep copy
      const event = { ...sourceEvents[eventIndex] };

      // Update the event's fullDate property to match the new date
      event.fullDate = format(new Date(targetDate), "EEEE, MMMM d, yyyy");

      // Remove from source
      sourceEvents.splice(eventIndex, 1);
      newEvents[sourceDate] = sourceEvents;

      // Add to target at the correct position based on time
      const targetEvents = [...(newEvents[targetDate] || [])];

      // Find the correct position to insert the event based on time
      const eventTimeValue = getTimeValue(event.time);
      let insertIndex = 0;

      for (let i = 0; i < targetEvents.length; i++) {
        const targetEventTimeValue = getTimeValue(targetEvents[i].time);
        if (eventTimeValue < targetEventTimeValue) {
          break;
        }
        insertIndex = i + 1;
      }

      // Insert the event at the correct position
      targetEvents.splice(insertIndex, 0, event);
      newEvents[targetDate] = targetEvents;

      return newEvents;
    });
  };

  /**
   * Add a new event to a specific date
   */
  const addEvent = (event: Event, date: string) => {
    setEvents((prevEvents) => {
      const newEvents = { ...prevEvents };
      const dateEvents = [...(newEvents[date] || [])];

      // Create a deep copy of the event and ensure it has the correct fullDate
      const newEvent = {
        ...event,
        fullDate:
          event.fullDate || format(new Date(date), "EEEE, MMMM d, yyyy"),
      };

      // Find the correct position to insert the event based on time
      const eventTimeValue = getTimeValue(newEvent.time);
      let insertIndex = 0;

      for (let i = 0; i < dateEvents.length; i++) {
        const dateEventTimeValue = getTimeValue(dateEvents[i].time);
        if (eventTimeValue < dateEventTimeValue) {
          break;
        }
        insertIndex = i + 1;
      }

      // Insert the event at the correct position
      dateEvents.splice(insertIndex, 0, newEvent);
      newEvents[date] = dateEvents;

      return newEvents;
    });
  };

  /**
   * Remove an event from a specific date
   */
  const removeEvent = (eventId: string, date: string) => {
    setEvents((prevEvents) => {
      const newEvents = { ...prevEvents };
      const dateEvents = [...(newEvents[date] || [])];
      const eventIndex = dateEvents.findIndex((e) => e.id === eventId);

      if (eventIndex !== -1) {
        dateEvents.splice(eventIndex, 1);
        newEvents[date] = dateEvents;
      }

      return newEvents;
    });
  };

  return {
    events,
    moveEvent,
    addEvent,
    removeEvent,
  };
}
