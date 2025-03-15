"use client";

import React, { useState, useEffect } from "react";
import { WeekView } from "@/app/components/calendar/WeekView";
import { getEventsForDate, type Event } from "@/app/lib/calendar-data";
import { format } from "date-fns";

interface ClientCalendarProps {
  initialDate: Date;
}

export function ClientCalendar({ initialDate }: ClientCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events for the selected date
  useEffect(() => {
    let isMounted = true;

    async function fetchEvents() {
      try {
        const eventsForDate = await getEventsForDate(selectedDate);
        
        if (isMounted) {
          setEvents(eventsForDate);
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
  }, [selectedDate]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex flex-col w-full h-screen shadow-lg overflow-hidden sm:max-w-md sm:rounded-lg">
      <div className="bg-gradient-header text-white p-4">
        <h1 className="text-xl font-bold mb-6">Your Schedule</h1>
        <WeekView selectedDate={selectedDate} onDateSelect={handleDateSelect} />
      </div>
      <div className="flex-1 bg-white overflow-y-auto">
        {isLoading ? (
          <DailyScheduleSkeleton />
        ) : (
          <ClientDailySchedule selectedDate={selectedDate} events={events} />
        )}
      </div>
    </div>
  );
}

function DailyScheduleSkeleton() {
  return (
    <div className="flex flex-col p-4">
      <div className="bg-gradient-background p-3 rounded-md mb-4 shadow-sm">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
      </div>

      <div className="space-y-4">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden shadow-sm animate-pulse"
            >
              <div className="h-[140px] bg-gray-200"></div>
              <div className="p-4">
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

interface ClientDailyScheduleProps {
  selectedDate: Date;
  events: Event[];
}

function ClientDailySchedule({ selectedDate, events }: ClientDailyScheduleProps) {
  // Sort events by time
  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="flex flex-col p-4">
      <div className="bg-gradient-background p-3 rounded-md mb-4 shadow-sm">
        <h2 className="text-gray-800 font-medium">
          {format(selectedDate, "EEE MMM d yyyy")}
        </h2>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No events scheduled for today</p>
        </div>
      ) : (
        <div>
          {sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

// Import the EventCard component
import { EventCard } from "@/app/components/calendar/EventCard"; 