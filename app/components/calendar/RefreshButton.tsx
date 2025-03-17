"use client";

import { useState } from "react";
import { fetchUpdatedEvents } from "@/app/lib/data-fetching";
import { RefreshCcw } from "lucide-react";
import { type Event } from "@/app/lib/calendar-data";

interface RefreshButtonProps {
  onRefresh: (events: Record<string, Event[]>) => void;
}

export function RefreshButton({ onRefresh }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const freshEvents = await fetchUpdatedEvents();
      onRefresh(freshEvents);
    } catch (error) {
      console.error("Failed to refresh events:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="hidden p-2 cursor-pointer text-white hover:text-gray-900 transition-colors duration-200 focus:outline-none"
      title="Refresh calendar"
      aria-label="Refresh calendar"
    >
      <RefreshCcw
        className={`h-5 w-5 ${isRefreshing ? "animate-spin text-white" : ""}`}
      />
    </button>
  );
}
