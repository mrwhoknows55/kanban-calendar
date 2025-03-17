import { Suspense } from "react";
import { ResponsiveKanbanCalendar } from "./ResponsiveKanbanCalendar";
import { type Event } from "@/app/lib/calendar-data";
import { CalendarSkeleton } from "../ui/skeletons/CalendarSkeleton";

interface CalendarContainerProps {
  events: Record<string, Event[]>;
}

// This is a server component that handles passing data to the client component
export function CalendarContainer({ events }: CalendarContainerProps) {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <ResponsiveKanbanCalendar initialDate={new Date()} events={events} />
    </Suspense>
  );
}
