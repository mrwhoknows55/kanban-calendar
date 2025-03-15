"use client";

import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { cn, getWeekDays, isSameDay } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { setSelectedDate } from "@/app/lib/calendar-actions";
import { hasEventsForDate } from "@/app/lib/calendar-data";

interface WeekViewProps {
  selectedDate: Date;
  onDateSelect?: (date: Date) => void; // Optional callback for client-side usage
}

export function WeekView({ selectedDate, onDateSelect }: WeekViewProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [localSelectedDate, setLocalSelectedDate] =
    React.useState(selectedDate);
  const [datesWithEvents, setDatesWithEvents] = React.useState<
    Record<string, boolean>
  >({});

  // Get the current week's days (Monday to Sunday)
  const weekDays = getWeekDays(selectedDate);

  // Check which dates have events
  React.useEffect(() => {
    async function checkEvents() {
      try {
        const eventFlags: Record<string, boolean> = {};

        // Process all dates in parallel for better performance
        const promises = weekDays.map(async (date) => {
          const hasEvents = await hasEventsForDate(date);
          const dateKey = format(date, "yyyy-MM-dd");
          return { dateKey, hasEvents };
        });

        const results = await Promise.all(promises);

        // Populate the eventFlags object
        results.forEach(({ dateKey, hasEvents }) => {
          eventFlags[dateKey] = hasEvents;
        });

        setDatesWithEvents(eventFlags);
      } catch (error) {
        console.error("Error checking events:", error);
      }
    }

    checkEvents();
  }, [weekDays]);

  // Handle date selection
  const handleDateSelect = async (date: Date) => {
    if (isUpdating) return;

    setIsUpdating(true);
    setLocalSelectedDate(date);

    try {
      // If onDateSelect is provided, use it (client-side)
      if (onDateSelect) {
        onDateSelect(date);
        setIsUpdating(false);
        return;
      }
      
      // Otherwise, use the server action (server-side)
      await setSelectedDate(date);
      // Refresh the page to get the updated data
      router.refresh();
    } catch (error) {
      console.error("Failed to update date:", error);
      // Revert to the previous date on error
      setLocalSelectedDate(selectedDate);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasEvents = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return datesWithEvents[dateKey] || false;
  };

  return (
    <div className="flex justify-between w-full px-2">
      {weekDays.map((date, index) => (
        <Button
          key={index}
          variant="ghost"
          className={cn(
            "flex flex-col items-center rounded-full w-10 h-10 relative",
            isSameDay(date, localSelectedDate)
              ? "bg-gradient-active text-white"
              : "text-white",
            isUpdating && isSameDay(date, localSelectedDate) && "opacity-70",
          )}
          onClick={() => handleDateSelect(date)}
          disabled={isUpdating}
        >
          <span className="text-xs">{format(date, "EEE").substring(0, 1)}</span>
          <span className="text-sm font-bold">{format(date, "d")}</span>
          {hasEvents(date) && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white"></span>
          )}
        </Button>
      ))}
    </div>
  );
}
