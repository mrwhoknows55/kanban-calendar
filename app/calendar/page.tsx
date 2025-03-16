import React from "react";
import { ResponsiveKanbanCalendar } from "@/app/components/calendar/ResponsiveKanbanCalendar";
import {
  getEventDates,
  getEventsForDate,
  type Event,
} from "@/app/lib/calendar-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar | Your Schedule",
  description: "View and manage your daily schedule",
};

export const dynamic = "force-dynamic";

async function getEvents() {
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

export default async function CalendarPage() {
  const events = await getEvents();

  return (
    <main className="min-h-screen">
      <ResponsiveKanbanCalendar initialDate={new Date()} events={events} />
    </main>
  );
}
