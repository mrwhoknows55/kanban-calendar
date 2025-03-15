import React from "react";
import { formatDate } from "@/app/lib/utils";
import { getEventsForDate } from "@/app/lib/calendar-data";
import { EventCard } from "@/app/components/calendar/EventCard";

interface DailyScheduleProps {
  selectedDate: Date;
}

export async function DailySchedule({ selectedDate }: DailyScheduleProps) {
  // Get events for the selected date
  const events = await getEventsForDate(selectedDate);

  // Sort events by time (simple string comparison should work for AM/PM format)
  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="flex flex-col p-4">
      <div className="bg-gradient-background p-3 rounded-md mb-4 shadow-sm">
        <h2 className="text-gray-800 font-medium">
          {formatDate(selectedDate, "EEE MMM d yyyy")}
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
