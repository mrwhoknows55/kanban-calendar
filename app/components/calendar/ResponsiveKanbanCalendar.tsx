"use client";

import React, { memo } from "react";
import { type Event } from "@/app/lib/calendar-data";
import { KanbanCalendar } from "./KanbanCalendar";

interface ResponsiveKanbanCalendarProps {
  initialDate: Date;
  events: Record<string, Event[]>;
}

export const ResponsiveKanbanCalendar = memo(function ResponsiveKanbanCalendar({
  initialDate,
  events: initialEvents,
}: ResponsiveKanbanCalendarProps) {
  return <KanbanCalendar initialDate={initialDate} events={initialEvents} />;
});
