"use client";

import React, { useState, useEffect } from "react";
import { MobileKanbanCalendar } from "./MobileKanbanCalendar";
import { DesktopKanbanCalendar } from "./DesktopKanbanCalendar";
import { type Event } from "@/app/lib/calendar-data";

interface ResponsiveKanbanCalendarProps {
  initialDate: Date;
  events: Record<string, Event[]>;
}

export function ResponsiveKanbanCalendar({
  initialDate,
  events,
}: ResponsiveKanbanCalendarProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Effect to handle responsive layout
  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      // Initial check
      setIsMobile(window.innerWidth < 768);

      // Add resize listener
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);

      // Clean up
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // Use SSR-friendly approach to avoid hydration mismatch
  // Only render the appropriate component after client-side hydration
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a placeholder with the same height during SSR
    return <div className="w-full h-screen" />;
  }

  // Render the appropriate component based on screen size
  return isMobile ? (
    <MobileKanbanCalendar initialDate={initialDate} events={events} />
  ) : (
    <DesktopKanbanCalendar initialDate={initialDate} events={events} />
  );
}
