"use client";

import React from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { cn } from '@/app/lib/utils';
import { useCalendarStore } from '@/app/lib/store';
import { Button } from '@/app/components/ui/button';

export function WeekView() {
  const { selectedDate, setSelectedDate } = useCalendarStore();
  
  // Get the current week's days (Monday to Sunday)
  const getDaysOfWeek = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start from Monday
    
    return Array(7).fill(0).map((_, i) => {
      return addDays(start, i);
    });
  };
  
  const weekDays = getDaysOfWeek();
  
  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  const hasEvents = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return !!useCalendarStore.getState().events[dateKey];
  };
  
  return (
    <div className="flex justify-between w-full px-2 py-3">
      {weekDays.map((date, index) => (
        <Button
          key={index}
          variant="ghost"
          className={cn(
            "flex flex-col items-center p-1 rounded-full w-10 h-16 relative",
            isSelected(date) ? "bg-gradient-active text-white" : "text-white"
          )}
          onClick={() => setSelectedDate(date)}
        >
          <span className="text-xs">{format(date, 'EEE').substring(0, 1)}</span>
          <span className="text-sm font-bold">{format(date, 'd')}</span>
          {hasEvents(date) && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white"></span>
          )}
        </Button>
      ))}
    </div>
  );
} 