"use client";

import React, { useState, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import { type Event } from "@/app/lib/calendar-data";
import { RefreshButton } from "./RefreshButton";

const MobileKanbanCalendar = dynamic(
  () =>
    import("./MobileKanbanCalendar").then((mod) => ({
      default: mod.MobileKanbanCalendar,
    })),
  {
    loading: () => <div className="w-full h-screen animate-pulse bg-gray-50" />,
    ssr: false,
  },
);

const DesktopKanbanCalendar = dynamic(
  () =>
    import("./DesktopKanbanCalendar").then((mod) => ({
      default: mod.DesktopKanbanCalendar,
    })),
  {
    loading: () => <div className="w-full h-screen animate-pulse bg-gray-50" />,
    ssr: false,
  },
);

interface ResponsiveKanbanCalendarProps {
  initialDate: Date;
  events: Record<string, Event[]>;
}

// Use memo to prevent unnecessary re-renders
export const ResponsiveKanbanCalendar = memo(function ResponsiveKanbanCalendar({
  initialDate,
  events: initialEvents,
}: ResponsiveKanbanCalendarProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const [events, setEvents] = useState<Record<string, Event[]>>(initialEvents);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  // Effect to handle responsive layout
  useEffect(() => {
    setIsClient(true);

    // Initial check
    setIsMobile(window.innerWidth < 768);

    // Add resize listener with debounce for better performance
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100); // 100ms debounce
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleRefresh = (freshEvents: Record<string, Event[]>) => {
    setEvents({ ...freshEvents });
  };

  // During SSR or before hydration, return a placeholder
  if (!isClient) {
    return <div className="w-full h-screen bg-gray-50" />;
  }

  // Render the appropriate component based on screen size
  return (
    <div className="relative w-full h-full">
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[9999]">
        <RefreshButton onRefresh={handleRefresh} />
      </div>
      {isMobile ? (
        <MobileKanbanCalendar initialDate={initialDate} events={events} />
      ) : (
        <DesktopKanbanCalendar initialDate={initialDate} events={events} />
      )}
    </div>
  );
});
