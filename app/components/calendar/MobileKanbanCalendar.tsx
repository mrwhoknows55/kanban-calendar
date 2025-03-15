"use client";

import React, { useState, useEffect } from "react";
import { format, addDays, subDays, startOfWeek, endOfWeek, isSameWeek, isToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { DraggableEventCard } from "./DraggableEventCard";
import { type Event } from "@/app/lib/calendar-data";
import { cn, formatDate } from "@/app/lib/utils";
import { useSwipe } from "@/app/lib/gesture-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MobileKanbanCalendarProps {
  initialDate: Date;
  events: Record<string, Event[]>;
}

export function MobileKanbanCalendar({ initialDate, events }: MobileKanbanCalendarProps) {
  // Always use today as the initial date
  const today = new Date();
  
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(today, { weekStartsOn: 1 })
  );
  const [direction, setDirection] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventOpen, setIsEventOpen] = useState<boolean>(false);
  
  // Format the current date as a string key for the events object
  const currentDateKey = format(currentDate, "yyyy-MM-dd");
  
  // Get events for the current date
  const currentEvents = events[currentDateKey] || [];
  
  // Handle swipe to change date
  const handleSwipe = (direction: number) => {
    setDirection(direction);
    
    const newDate = direction > 0
      ? subDays(currentDate, 1) // Swipe right - go to previous day
      : addDays(currentDate, 1); // Swipe left - go to next day
    
    setCurrentDate(newDate);
    
    // Check if we need to update the week
    if (!isSameWeek(newDate, currentWeekStart, { weekStartsOn: 1 })) {
      setCurrentWeekStart(startOfWeek(newDate, { weekStartsOn: 1 }));
    }
  };
  
  // Handle week navigation
  const handleWeekChange = (direction: number) => {
    const newWeekStart = direction > 0
      ? subDays(currentWeekStart, 7) // Previous week
      : addDays(currentWeekStart, 7); // Next week
    
    setCurrentWeekStart(newWeekStart);
    
    // Also update the current date to the same day in the new week
    const dayOfWeek = (currentDate.getDay() === 0 ? 7 : currentDate.getDay()) - 1;
    const newDate = addDays(newWeekStart, dayOfWeek);
    setCurrentDate(newDate);
    setDirection(direction);
  };
  
  // Set up swipe handlers
  useSwipe({
    onSwipeLeft: () => handleSwipe(-1),
    onSwipeRight: () => handleSwipe(1),
  }, {
    threshold: 50,
    preventDefault: false,
  });
  
  // Handle event drag end
  const handleEventDragEnd = (event: Event, direction: number) => {
    // Calculate the new date based on the drag direction
    const newDate = direction > 0 
      ? subDays(currentDate, 1) 
      : addDays(currentDate, 1);
    
    // Format the new date as a string key
    const newDateKey = format(newDate, "yyyy-MM-dd");
    
    // Here you would typically update your state or database
    // For this demo, we're just logging the action
    console.log(`Moved event ${event.id} to ${newDateKey}`);
    
    // Change the current date to follow the event
    setDirection(direction);
    setCurrentDate(newDate);
    
    // Check if we need to update the week
    if (!isSameWeek(newDate, currentWeekStart, { weekStartsOn: 1 })) {
      setCurrentWeekStart(startOfWeek(newDate, { weekStartsOn: 1 }));
    }
  };
  
  // Generate dates for the week view based on currentWeekStart
  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(currentWeekStart, i));
    }
    return dates;
  };
  
  const weekDates = generateWeekDates();
  
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* Week header */}
      <div className="bg-gradient-header text-white p-6">
        <h1 className="text-2xl font-bold mb-4 tracking-tight">Your Schedule</h1>
        
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => handleWeekChange(1)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg font-semibold">
            {formatDate(currentWeekStart, "MMM d")} - {formatDate(addDays(currentWeekStart, 6), "MMM d, yyyy")}
          </h2>
          
          <button 
            onClick={() => handleWeekChange(-1)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            aria-label="Next week"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex justify-between w-full px-2 py-3 overflow-hidden">
          {weekDates.map((date) => (
            <motion.button
              key={format(date, "yyyy-MM-dd")}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-full w-12 h-16 p-3 relative transition-all duration-300",
                format(date, "yyyy-MM-dd") === currentDateKey
                  ? "bg-gradient-active text-white scale-110"
                  : "text-white",
                isToday(date) && format(date, "yyyy-MM-dd") !== currentDateKey
                  ? "ring-2 ring-white/30"
                  : ""
              )}
              onClick={() => {
                const newDirection = date > currentDate ? -1 : 1;
                setDirection(newDirection);
                setCurrentDate(date);
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              aria-label={formatDate(date, "EEEE, MMMM d")}
              aria-selected={format(date, "yyyy-MM-dd") === currentDateKey}
            >
              <span className="text-xs font-medium">{format(date, "EEE").substring(0, 1)}</span>
              <span className="text-sm font-bold">{format(date, "d")}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Daily events with swipe animation */}
      <div className="flex-1 bg-white overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentDateKey}
            className="h-full overflow-y-auto"
            initial={{ 
              x: direction < 0 ? 300 : -300,
              opacity: 0 
            }}
            animate={{ 
              x: 0,
              opacity: 1 
            }}
            exit={{ 
              x: direction < 0 ? -300 : 300,
              opacity: 0 
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <div className="p-6">
              {/* Updated date display with fading line on the right */}
              <div className="mb-8 flex items-center">
                <h2 className="text-2xl font-semibold text-gray-800 mr-4">
                  {format(currentDate, "EEE MMM d yyyy")}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
              </div>
              
              {currentEvents.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-lg">No events scheduled for today</p>
                  <p className="text-sm mt-3">Drag events from other days to add them here</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {currentEvents.map((event) => (
                    <DraggableEventCard
                      key={event.id}
                      event={event}
                      onDragEnd={handleEventDragEnd}
                      isOpen={isEventOpen && selectedEvent?.id === event.id}
                      onOpenChange={(open) => {
                        setIsEventOpen(open);
                        if (open) {
                          setSelectedEvent(event);
                        } else {
                          setSelectedEvent(null);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 