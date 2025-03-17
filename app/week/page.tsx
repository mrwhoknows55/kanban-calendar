import React from "react";
import { CalendarContainer } from "@/app/components/calendar/CalendarContainer";
import { Metadata } from "next";
import { getEventsWithCache } from "@/app/lib/data-fetching";

export const metadata: Metadata = {
  title: "Kanban Calendar",
  description: "View and manage your daily schedule",
};

// Change from force-dynamic to auto with revalidation
// This allows Next.js to cache the page while still keeping it fresh
export const dynamic = "auto";
export const revalidate = 60; // Revalidate every minute

export default async function CalendarPage() {
  // Use the cached version of getEvents from our utility
  const events = await getEventsWithCache();

  return (
    <main className="min-h-screen">
      <CalendarContainer events={events} />
    </main>
  );
}
