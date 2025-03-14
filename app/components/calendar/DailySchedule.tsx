"use client";

import React from 'react';
import { format } from 'date-fns';
import { useCalendarStore } from '@/app/lib/store';
import { EventCard } from './EventCard';

export function DailySchedule() {
  const { selectedDate, getEventsForDate } = useCalendarStore();
  const events = getEventsForDate(selectedDate);
  
  // Sort events by time (simple string comparison should work for AM/PM format)
  const sortedEvents = [...events].sort((a, b) => 
    a.time.localeCompare(b.time)
  );
  
  return (
    <div className="flex flex-col p-4">
      <div className="bg-gradient-background p-3 rounded-md mb-4 shadow-sm">
        <h2 className="text-gray-800 font-medium">
          {format(selectedDate, 'EEE MMM d yyyy')}
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