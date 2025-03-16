"use client";

import React, { useState, useRef, useEffect } from "react";
import { format, addDays, subDays, startOfWeek, isToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { type Event } from "@/app/lib/calendar-data";
import { cn, formatDate } from "@/app/lib/utils";
import { ChevronLeft, ChevronRight, MoveHorizontal, X, Clock, Calendar } from "lucide-react";
import { useCalendarEvents } from "@/app/lib/calendar-hooks";
import { useDragStore } from "@/app/lib/gesture-utils";
import { Card } from "@/app/components/ui/card";
import Image from "next/image";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Helper function to convert time string to comparable value
const getTimeValue = (timeStr: string) => {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  minutes = minutes + 0;
  return hours * 60 + minutes;
};

interface DesktopKanbanCalendarProps {
  initialDate: Date;
  events: Record<string, Event[]>;
}

export function DesktopKanbanCalendar({
  initialDate: initialDate,
  events: initialEvents,
}: DesktopKanbanCalendarProps) {

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(initialDate, { weekStartsOn: 1 }),
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventOpen, setIsEventOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeDragTarget, setActiveDragTarget] = useState<string | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<{
    event: Event;
    sourceDate: string;
  } | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Use our custom hook for managing events
  const { events, moveEvent } = useCalendarEvents({ initialEvents });

  // Use the global drag store
  const { startDrag, endDrag } = useDragStore();

  // Handle week navigation
  const handleWeekChange = (direction: number) => {
    const newWeekStart =
      direction > 0
        ? subDays(currentWeekStart, 7) // Previous week
        : addDays(currentWeekStart, 7); // Next week

    setCurrentWeekStart(newWeekStart);
  };

  // Handle event drag start
  const handleEventDragStart = (event: Event, sourceDate: string) => {
    setIsDragging(true);
    setDraggedEvent({ event, sourceDate });

    // Update global drag state
    startDrag();
  };

  // Handle event drag end
  const handleEventDragEnd = () => {
    if (
      draggedEvent &&
      activeDragTarget &&
      draggedEvent.sourceDate !== activeDragTarget
    ) {
      // Move the event to the target date
      moveEvent(
        draggedEvent.event.id,
        draggedEvent.sourceDate,
        activeDragTarget,
      );
      console.log(
        `Moved event ${draggedEvent.event.id} from ${draggedEvent.sourceDate} to ${activeDragTarget}`,
      );
    }

    // Reset drag state
    setIsDragging(false);
    setActiveDragTarget(null);
    setDraggedEvent(null);

    // Update global drag state
    endDrag();
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
        isLast: true,
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
        top: "0",
        transform: "translate(-50%, 0)",
        insertIndex,
        isFirst: true,
        isLast: false,
      };
    } else if (insertIndex === dayEvents.length) {
      // Position at the bottom - exactly below the last card
      return {
        top: `${insertIndex * 84}px`,
        transform: "translate(-50%, 0)",
        insertIndex,
        isFirst: false,
        isLast: true,
      };
    } else {
      // Position between events - exactly at the insertion point
      return {
        top: `${insertIndex * 84}px`,
        transform: "translate(-50%, 0)",
        insertIndex,
        isFirst: false,
        isLast: false,
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

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, activeDragTarget]);

  // Animation variants for event details
  const dialogVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.15 }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.15,
        delay: 0.05
      }
    }
  };

  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { delay: 0.1, duration: 0.2 }
    },
    exit: { 
      y: 20, 
      opacity: 0,
      transition: { duration: 0.15 }
    }
  };

  const detailsVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delay: 0.15, duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.1 }
    }
  };

  const fallbackImageUrl =
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1920&h=1080&auto=format&fit=crop";

  return (
    <div
      className="flex flex-col w-full h-screen overflow-hidden"
      ref={calendarRef}
    >
      {/* Week header */}
      <div className="bg-gradient-header text-white p-6 sticky top-0 z-20">
        <h1 className="text-2xl font-bold mb-4 tracking-tight">
          Your Schedule
        </h1>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => handleWeekChange(1)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-semibold">
            {formatDate(currentWeekStart, "MMM d")} -{" "}
            {formatDate(addDays(currentWeekStart, 6), "MMM d, yyyy")}
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
      <div className="flex-1 bg-white overflow-y-auto">
        {isDragging && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-none z-30">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <MoveHorizontal className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                Drag to another day
              </span>
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
                  isActiveDropTarget && isDragging ? "drag-over" : "",
                )}
                onMouseOver={() => handleDragOver(dateKey)}
                onTouchMove={() => handleDragOver(dateKey)}
              >
                {/* Drop indicator overlay */}
                {isDragging && (
                  <div
                    className={cn(
                      "absolute inset-0 border-2 border-dashed rounded-md m-1 pointer-events-none z-0 transition-all duration-200",
                      isActiveDropTarget
                        ? "bg-blue-100/60 border-blue-400 scale-100"
                        : "bg-blue-100/10 border-blue-200 scale-95",
                    )}
                  ></div>
                )}

                {/* Drop destination indicator */}
                {isDragging &&
                  isActiveDropTarget &&
                  !isSourceColumn &&
                  draggedEvent &&
                  null}

                {/* Source column indicator */}
                {isDragging && isSourceColumn && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 z-20 pointer-events-none"></div>
                )}

                {/* Day header */}
                <div
                  className={cn(
                    "p-3 text-center border-b border-gray-100 sticky top-0 z-10 shadow-sm",
                    isToday(date) ? "bg-blue-100/50" : "bg-gray-50",
                    isActiveDropTarget && isDragging ? "bg-blue-100" : "",
                  )}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-gray-500">
                      {format(date, "EEE")}
                    </span>
                    <span
                      className={cn(
                        "text-xl font-bold mt-1",
                        isToday(date) ? "text-blue-600" : "text-gray-800",
                      )}
                    >
                      {format(date, "d")}
                    </span>
                  </div>
                </div>

                {/* Day events */}
                <div className="flex-1 p-3 overflow-y-auto">
                  {dayEvents.length === 0 ? (
                    <div
                      className={cn(
                        "text-gray-400 text-sm space-y-4 relative",
                        isActiveDropTarget && isDragging ? "bg-blue-50/30" : "",
                      )}
                    >
                      <p className="text-center py-2">No events</p>
                      {isActiveDropTarget &&
                        isDragging &&
                        !isSourceColumn &&
                        draggedEvent && (
                          <motion.div
                            className="event-wrapper"
                            layout
                            layoutId={`empty-column-${dateKey}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                              mass: 1,
                            }}
                          >
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mb-4 mx-auto max-w-[300px] w-full"
                              layoutId={`ghost-empty-${dateKey}`}
                            >
                              <div className="bg-blue-50 border-2 border-blue-400 rounded-xl shadow-lg overflow-hidden">
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
                            </motion.div>
                            <p className="text-blue-500 font-medium text-center">
                              Drop to add event
                            </p>
                          </motion.div>
                        )}
                    </div>
                  ) : (
                    <div className="space-y-4 relative">
                      {/* Insert position indicator */}
                      {isDragging &&
                        isActiveDropTarget &&
                        !isSourceColumn &&
                        draggedEvent &&
                        (() => {
                          return (
                            <div className="relative">
                              {/* Position indicators removed to prevent overlapping with cards */}
                            </div>
                          );
                        })()}

                      <AnimatePresence mode="popLayout" initial={false}>
                        {dayEvents.map((event, index) => {
                          // Calculate if we need to insert the ghost card before this event
                          const shouldInsertGhostBefore =
                            isDragging &&
                            isActiveDropTarget &&
                            !isSourceColumn &&
                            draggedEvent &&
                            getGhostCardPosition(dateKey, draggedEvent.event)
                              .insertIndex === index;

                          // Calculate if this is the last event and we need to insert ghost after
                          const isLastEvent = index === dayEvents.length - 1;
                          const shouldInsertGhostAfter =
                            isDragging &&
                            isActiveDropTarget &&
                            !isSourceColumn &&
                            draggedEvent &&
                            isLastEvent &&
                            getGhostCardPosition(dateKey, draggedEvent.event)
                              .insertIndex === dayEvents.length;

                          return (
                            <motion.div
                              key={event.id}
                              className="event-wrapper"
                              layout
                              layoutId={`event-${event.id}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20, scale: 0.9 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                                mass: 1,
                              }}
                            >
                              {shouldInsertGhostBefore && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mb-4 mx-auto max-w-[300px] w-full"
                                  layoutId={`ghost-before-${event.id}`}
                                >
                                  <div className="bg-blue-50 border-2 border-blue-400 rounded-xl shadow-lg overflow-hidden">
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
                                </motion.div>
                              )}

                              <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{
                                  duration: 0.2,
                                  delay: 0.05,
                                  ease: "easeOut",
                                }}
                              >
                                <Card
                                  className="mb-5 cursor-pointer hover:shadow-md transition-all overflow-hidden rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setIsEventOpen(true);
                                  }}
                                >
                                  <motion.div 
                                    className="relative w-full h-[160px] overflow-hidden rounded-t-xl"
                                    layoutId={`image-container-${event.id}`}
                                  >
                                    <Image
                                      src={event.imageUrl}
                                      alt={event.title}
                                      fill
                                      className="object-cover pointer-events-none"
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      priority
                                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                        // Fallback image on error
                                        const target = e.target as HTMLImageElement;
                                        target.src = fallbackImageUrl;
                                      }}
                                    />
                                    <motion.div 
                                      className="absolute top-4 right-4 bg-[#6c63ff] px-3 py-1.5 rounded-full text-sm font-bold text-white z-10"
                                      layoutId={`time-badge-${event.id}`}
                                    >
                                      {event.time}
                                    </motion.div>
                                  </motion.div>
                                  <motion.div 
                                    className="p-5 flex flex-col"
                                    layoutId={`content-container-${event.id}`}
                                  >
                                    <motion.h3 
                                      className="text-lg font-semibold text-[#222222] mb-2"
                                      layoutId={`title-${event.id}`}
                                    >
                                      {event.title}
                                    </motion.h3>
                                    <motion.p 
                                      className="text-sm font-normal text-[#666666] leading-[1.5] line-clamp-2"
                                      layoutId={`description-${event.id}`}
                                    >
                                      {event.description}
                                    </motion.p>
                                  </motion.div>
                                </Card>
                              </motion.div>

                              {shouldInsertGhostAfter && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-4 mx-auto max-w-[300px] w-full"
                                  layoutId={`ghost-after-${event.id}`}
                                >
                                  <div className="bg-blue-50 border-2 border-blue-400 rounded-xl shadow-lg overflow-hidden">
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
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-page event details */}
      <AnimatePresence mode="sync" onExitComplete={() => {}}>
        {isEventOpen && selectedEvent && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
            initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            exit={{ backgroundColor: "rgba(0, 0, 0, 0)", transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              // Close the modal when clicking the backdrop, but not when clicking the content
              if (e.target === e.currentTarget) {
                setIsEventOpen(false);
              }
            }}
          >
            <motion.div
              className="relative z-10 w-full h-full max-w-6xl mx-auto flex flex-col overflow-hidden bg-white rounded-xl shadow-xl md:h-[85vh] md:my-auto pointer-events-auto"
              layoutId={`card-container-${selectedEvent.id}`}
              initial={{ borderRadius: 12, y: 20, opacity: 0.8, scale: 0.8 }}
              animate={{ 
                borderRadius: 12, 
                y: 0, 
                opacity: 1, 
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.4
                }
              }}
              exit={{ 
                borderRadius: 12, 
                y: 20, 
                opacity: 0, 
                scale: 0.8,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 40,
                  duration: 0.25
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button 
                onClick={() => setIsEventOpen(false)}
                className="absolute right-5 top-5 z-50 rounded-full bg-black/20 p-2 text-white hover:bg-black/30 transition-colors duration-200 focus:outline-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </motion.button>

              <VisuallyHidden>
                <h2>{selectedEvent.title}</h2>
                <p>{selectedEvent.description}</p>
              </VisuallyHidden>

              {/* Cover image section */}
              <motion.div 
                className="relative w-full h-[40vh] md:h-[40vh] overflow-hidden rounded-t-xl"
                layoutId={`image-container-${selectedEvent.id}`}
              >
                <Image
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    // Fallback image on error
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImageUrl;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10"></div>

                {/* Header content overlay */}
                <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                  <div className="flex items-center justify-between mb-2">
                    <motion.h2 
                      className="text-2xl sm:text-3xl font-bold"
                      layoutId={`title-${selectedEvent.id}`}
                    >
                      {selectedEvent.title}
                    </motion.h2>

                    <motion.div 
                      className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-white"
                      layoutId={`time-badge-${selectedEvent.id}`}
                    >
                      {selectedEvent.time}
                    </motion.div>
                  </div>

                  <motion.div 
                    className="flex items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.3, duration: 0.2 }}
                  >
                    <Calendar className="w-4 h-4 mr-2 opacity-80" />
                    <span className="text-sm text-white/90">Today</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Content section */}
              <motion.div 
                className="overflow-y-auto bg-white w-full h-[calc(100vh-40vh)] md:h-[calc(85vh-40vh)] rounded-b-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: 0.1,
                  duration: 0.2
                }}
              >
                <motion.div 
                  className="p-8 md:p-12"
                  layoutId={`content-container-${selectedEvent.id}`}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.3
                  }}
                >
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Description
                      </h3>
                      <motion.p 
                        className="text-gray-600 leading-relaxed text-base"
                        layoutId={`description-${selectedEvent.id}`}
                      >
                        {selectedEvent.description}
                      </motion.p>
                    </div>

                    <motion.div
                      className="border-t border-gray-200 pt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: 0.3, duration: 0.2 }}
                    >
                      <h3 className="text-sm font-medium text-gray-500 mb-4">
                        Event Details
                      </h3>

                      <div className="space-y-4">
                        <motion.div 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ delay: 0.4, duration: 0.15 }}
                        >
                          <Calendar className="w-5 h-5 text-[#6c63ff] mr-4 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Date & Time
                            </p>
                            <p className="text-sm text-gray-500">
                              Today at {selectedEvent.time}
                            </p>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ delay: 0.5, duration: 0.15 }}
                        >
                          <Clock className="w-5 h-5 text-[#6c63ff] mr-4 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Duration
                            </p>
                            <p className="text-sm text-gray-500">1 hour</p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
