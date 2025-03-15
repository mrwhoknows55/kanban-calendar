"use client";

import React, { useState, useRef, useEffect } from "react";
import { format, addDays, subDays, startOfWeek, isSameWeek, isToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { DraggableEventCard } from "./DraggableEventCard";
import { type Event } from "@/app/lib/calendar-data";
import { cn, formatDate } from "@/app/lib/utils";
import { ChevronLeft, ChevronRight, MoveHorizontal, ArrowRight } from "lucide-react";
import { useCalendarEvents } from "@/app/lib/calendar-hooks";

// Helper function to convert time string to comparable value
const getTimeValue = (timeStr: string) => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
};

interface DesktopKanbanCalendarProps {
  initialDate: Date;
  events: Record<string, Event[]>;
}

export function DesktopKanbanCalendar({ initialDate, events: initialEvents }: DesktopKanbanCalendarProps) {
  // Always use today as the initial date
  const today = new Date();
  
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(today, { weekStartsOn: 1 })
  );
  const [direction, setDirection] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventOpen, setIsEventOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeDragTarget, setActiveDragTarget] = useState<string | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<{event: Event, sourceDate: string} | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Use our custom hook for managing events
  const { events, moveEvent } = useCalendarEvents({ initialEvents });
  
  // Handle week navigation
  const handleWeekChange = (direction: number) => {
    const newWeekStart = direction > 0
      ? subDays(currentWeekStart, 7) // Previous week
      : addDays(currentWeekStart, 7); // Next week
    
    setCurrentWeekStart(newWeekStart);
    setDirection(direction);
  };
  
  // Handle event drag start
  const handleEventDragStart = (event: Event, sourceDate: string) => {
    setIsDragging(true);
    setDraggedEvent({ event, sourceDate });
  };
  
  // Handle event drag end
  const handleEventDragEnd = () => {
    if (draggedEvent && activeDragTarget && draggedEvent.sourceDate !== activeDragTarget) {
      // Move the event to the target date
      moveEvent(draggedEvent.event.id, draggedEvent.sourceDate, activeDragTarget);
      console.log(`Moved event ${draggedEvent.event.id} from ${draggedEvent.sourceDate} to ${activeDragTarget}`);
    }
    
    // Reset drag state
    setIsDragging(false);
    setActiveDragTarget(null);
    setDraggedEvent(null);
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
  
  // Handle drag over column to highlight it
  const handleDragOver = (dateKey: string) => {
    if (isDragging && activeDragTarget !== dateKey) {
      setActiveDragTarget(dateKey);
    }
  };
  
  // Calculate the position for the ghost card based on time
  const getGhostCardPosition = (dateKey: string, draggedEvent: Event) => {
    const dayEvents = events[dateKey] || [];
    
    // If no events, position in the middle
    if (dayEvents.length === 0) {
      return { 
        top: "50%", 
        transform: "translate(-50%, -50%)",
        insertIndex: 0,
        isFirst: true,
        isLast: true
      };
    }
    
    const draggedTimeValue = getTimeValue(draggedEvent.time);
    
    // Find the position based on time
    let insertIndex = 0;
    for (let i = 0; i < dayEvents.length; i++) {
      const eventTimeValue = getTimeValue(dayEvents[i].time);
      if (draggedTimeValue < eventTimeValue) {
        break;
      }
      insertIndex = i + 1;
    }
    
    // Calculate position based on index
    if (insertIndex === 0) {
      // Position at the top
      return { 
        top: "20%", 
        transform: "translate(-50%, 0)",
        insertIndex,
        isFirst: true,
        isLast: false
      };
    } else if (insertIndex === dayEvents.length) {
      // Position at the bottom
      return { 
        top: "80%", 
        transform: "translate(-50%, -100%)",
        insertIndex,
        isFirst: false,
        isLast: true
      };
    } else {
      // Position between events
      const percentage = (insertIndex / dayEvents.length) * 60 + 20; // 20% to 80% range
      return { 
        top: `${percentage}%`, 
        transform: "translate(-50%, -50%)",
        insertIndex,
        isFirst: false,
        isLast: false
      };
    }
  };
  
  // Set up mouse move listener to detect which column the mouse is over
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Find which column the mouse is over
      for (const dateKey in columnRefs.current) {
        const column = columnRefs.current[dateKey];
        if (!column) continue;
        
        const rect = column.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          if (activeDragTarget !== dateKey) {
            setActiveDragTarget(dateKey);
          }
          break;
        }
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, activeDragTarget]);
  
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden" ref={calendarRef}>
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
      </div>
      
      {/* Weekly calendar grid */}
      <div className="flex-1 bg-white overflow-hidden">
        {isDragging && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center bg-black/5">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <MoveHorizontal className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Drag to another day</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-7 h-full">
          {weekDates.map((date) => {
            const dateKey = format(date, "yyyy-MM-dd");
            const dayEvents = events[dateKey] || [];
            const isActiveDropTarget = activeDragTarget === dateKey;
            const isSourceColumn = draggedEvent?.sourceDate === dateKey;
            
            return (
              <div 
                key={dateKey} 
                ref={(el) => {
                  columnRefs.current[dateKey] = el;
                }}
                className={cn(
                  "flex flex-col border-r last:border-r-0 border-gray-100 relative",
                  isToday(date) ? "bg-blue-50/30" : "",
                  isDragging ? "drop-target" : "",
                  isActiveDropTarget && isDragging ? "drag-over" : ""
                )}
                onMouseOver={() => handleDragOver(dateKey)}
                onTouchMove={() => handleDragOver(dateKey)}
              >
                {/* Drop indicator overlay */}
                {isDragging && (
                  <div className={cn(
                    "absolute inset-0 border-2 border-dashed rounded-md m-1 pointer-events-none z-0 transition-all duration-200",
                    isActiveDropTarget 
                      ? "bg-blue-100/60 border-blue-400 scale-100" 
                      : "bg-blue-100/10 border-blue-200 scale-95"
                  )}></div>
                )}
                
                {/* Drop destination indicator */}
                {isDragging && isActiveDropTarget && !isSourceColumn && draggedEvent && (
                  <>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                      <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-drop-pulse">
                        <ArrowRight className="w-5 h-5" />
                        <span className="font-medium">Drop Here</span>
                      </div>
                    </div>
                    
                    {/* Ghost card in target location - positioned based on time */}
                    <div 
                      className="absolute left-1/2 z-15 pointer-events-none w-[90%] max-w-[300px]"
                      style={getGhostCardPosition(dateKey, draggedEvent.event)}
                    >
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-400">
                        <div className="relative w-full h-[160px] overflow-hidden rounded-t-xl">
                          <div className="absolute inset-0 bg-blue-50"></div>
                          <div className="absolute top-4 right-4 bg-[#6c63ff] px-3 py-1.5 rounded-full text-sm font-bold text-white z-10">
                            {draggedEvent.event.time}
                          </div>
                        </div>
                        <div className="p-5 flex flex-col">
                          <h3 className="text-lg font-semibold text-[#222222] mb-2">
                            {draggedEvent.event.title}
                          </h3>
                          <p className="text-sm font-normal text-[#666666] leading-[1.5] line-clamp-2">
                            {draggedEvent.event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Source column indicator */}
                {isDragging && isSourceColumn && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 z-20 pointer-events-none"></div>
                )}
                
                {/* Day header */}
                <div className={cn(
                  "p-3 text-center border-b border-gray-100 sticky top-0 z-10",
                  isToday(date) ? "bg-blue-100/50" : "bg-gray-50",
                  isActiveDropTarget && isDragging ? "bg-blue-100" : ""
                )}>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-gray-500">{format(date, "EEE")}</span>
                    <span className={cn(
                      "text-xl font-bold mt-1",
                      isToday(date) ? "text-blue-600" : "text-gray-800"
                    )}>
                      {format(date, "d")}
                    </span>
                  </div>
                </div>
                
                {/* Day events */}
                <div className="flex-1 p-3 overflow-y-auto">
                  {dayEvents.length === 0 ? (
                    <div className={cn(
                      "text-center py-6 text-gray-400 text-sm",
                      isActiveDropTarget && isDragging ? "bg-blue-50/50 rounded-lg p-4" : ""
                    )}>
                      <p>No events</p>
                      {isActiveDropTarget && isDragging && (
                        <p className="mt-2 text-blue-500 font-medium">Drop to add event</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 relative">
                      {/* Insert position indicator */}
                      {isDragging && isActiveDropTarget && !isSourceColumn && draggedEvent && (() => {
                        const position = getGhostCardPosition(dateKey, draggedEvent.event);
                        return (
                          <>
                            {position.isFirst && (
                              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-full z-30 -mt-1"></div>
                            )}
                            {!position.isFirst && !position.isLast && (
                              <div className="absolute left-0 right-0 z-30 flex items-center justify-center" 
                                style={{ top: `${(position.insertIndex * 84) - 10}px` }}>
                                <div className="w-3/4 h-1 bg-blue-500 rounded-full"></div>
                                <div className="absolute -ml-1 w-3 h-3 rounded-full bg-blue-500"></div>
                              </div>
                            )}
                            {position.isLast && (
                              <div className="absolute left-0 right-0 z-30 flex items-center justify-center" 
                                style={{ top: `${(dayEvents.length * 84) - 10}px` }}>
                                <div className="w-3/4 h-1 bg-blue-500 rounded-full"></div>
                                <div className="absolute -ml-1 w-3 h-3 rounded-full bg-blue-500"></div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                      
                      <AnimatePresence mode="popLayout">
                        {dayEvents.map((event, index) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ 
                              duration: 0.2, 
                              delay: 0.05 + (index * 0.03),
                              ease: "easeOut"
                            }}
                          >
                            <DraggableEventCard
                              event={event}
                              onDragStart={() => handleEventDragStart(event, dateKey)}
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
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 