"use client";

import React, { useState, useRef } from "react";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  isToday,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { type Event, getRelativeDate } from "@/app/lib/calendar-data";
import { cn, formatDate } from "@/app/lib/utils";
import { useDragStore } from "@/app/lib/gesture-utils";
import { useCalendarEvents } from "@/app/lib/calendar-hooks";
import { Card } from "@/app/components/ui/card";
import { TimePill } from "@/app/components/calendar/TimePill";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/app/components/ui/dialog";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  X,
} from "lucide-react";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { SwipeableView } from "./SwipeableView";

const fallbackImageUrl = "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1920&h=1080&auto=format&fit=crop";

interface KanbanCalendarProps {
  initialDate: Date;
  events: Record<string, Event[]>;
}

export function KanbanCalendar({
  initialDate,
  events: initialEvents,
}: KanbanCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(currentDate, { weekStartsOn: 1 })
  );
  const [direction, setDirection] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventOpen, setIsEventOpen] = useState<boolean>(false);
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Drag and drop state from the store
  const { isDragging, draggedEvent, setIsDragging, setDraggedEvent } = useDragStore();
  const [activeDragTarget, setActiveDragTarget] = useState<string | null>(null);

  // Use our custom hook for managing events
  const { events, moveEvent } = useCalendarEvents({ initialEvents });

  // Store the date that was selected before opening the dialog
  const [lastSelectedDate, setLastSelectedDate] = useState<Date | null>(null);

  // Handle week navigation
  const handleWeekChange = (direction: number) => {
    const newWeekStart = direction > 0
      ? subDays(currentWeekStart, 7)
      : addDays(currentWeekStart, 7);

    setCurrentWeekStart(newWeekStart);
    const dayOfWeek = (currentDate.getDay() === 0 ? 7 : currentDate.getDay()) - 1;
    const newDate = addDays(newWeekStart, dayOfWeek);
    setCurrentDate(newDate);
    setDirection(direction);
  };

  // Handle opening and closing the event dialog
  const handleOpenEventDialog = (event: Event) => {
    setLastSelectedDate(currentDate);
    setSelectedEvent(event);
    setIsEventOpen(true);
  };

  const handleCloseEventDialog = () => {
    setIsEventOpen(false);
    // Restore the previously selected date if needed
    if (lastSelectedDate) {
      setCurrentDate(lastSelectedDate);
    }
  };

  // Generate dates for the week view
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  // Handle drag and drop
  const handleDragStart = (event: Event, sourceDate: string) => {
    setIsDragging(true);
    setDraggedEvent({ event, sourceDate });
  };

  const handleDragOver = (targetDate: string) => {
    if (draggedEvent && targetDate !== draggedEvent.sourceDate) {
      setActiveDragTarget(targetDate);
    }
  };

  const handleDragEnd = () => {
    if (draggedEvent && activeDragTarget) {
      moveEvent(draggedEvent.event.id, draggedEvent.sourceDate, activeDragTarget);
    }
    setIsDragging(false);
    setDraggedEvent(null);
    setActiveDragTarget(null);
  };

  const currentDateKey = format(currentDate, "yyyy-MM-dd");
  const currentEvents = events[currentDateKey] || [];

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* Define a consistent grid template for the entire calendar */}
      <style jsx>{`
        .grid-cols-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          width: 100%;
        }
      `}</style>

      {/* Header */}
      <div className="bg-gradient-header text-white sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 shadow-md">
        <div className="px-6 pt-6 pb-4">
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

        {/* Week navigation - Desktop */}
        <div className="hidden md:block px-0">
          <div className="grid-cols-days">
            {weekDates.map((date) => (
              <div 
                key={format(date, "yyyy-MM-dd")} 
                className="text-center px-2 pb-3"
              >
                <motion.button
                  className={cn(
                    "flex flex-col items-center justify-center w-full gap-1 rounded-md py-2 relative transition-all duration-300",
                    format(date, "yyyy-MM-dd") === currentDateKey
                      ? "bg-gradient-active text-white"
                      : "bg-white/5 text-white",
                    isToday(date) && format(date, "yyyy-MM-dd") !== currentDateKey
                      ? "ring-1 ring-white/30"
                      : ""
                  )}
                  onClick={() => {
                    const newDirection = date > currentDate ? -1 : 1;
                    setDirection(newDirection);
                    setCurrentDate(date);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  aria-label={formatDate(date, "EEEE, MMMM d")}
                  aria-selected={format(date, "yyyy-MM-dd") === currentDateKey}
                >
                  <span className="text-xs font-medium">
                    {format(date, "EEE")}
                  </span>
                  <span className="text-lg font-bold">{format(date, "d")}</span>
                </motion.button>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile week navigation */}
        <div className="flex md:hidden justify-between px-4 py-3 overflow-hidden">
          {weekDates.map((date) => (
            <motion.button
              key={format(date, "yyyy-MM-dd")}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-md w-12 h-16 relative transition-all duration-300",
                format(date, "yyyy-MM-dd") === currentDateKey
                  ? "bg-gradient-active text-white scale-110"
                  : "bg-white/5 text-white",
                isToday(date) && format(date, "yyyy-MM-dd") !== currentDateKey
                  ? "ring-1 ring-white/30"
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
              <span className="text-xs font-medium">
                {format(date, "EEE").substring(0, 1)}
              </span>
              <span className="text-sm font-bold">{format(date, "d")}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 bg-white overflow-hidden">
        {/* Mobile View */}
        <div className="block md:hidden h-[calc(100vh-13rem)] overflow-hidden">
          <SwipeableView
            onSwipeLeft={() => {
              if (!isEventOpen) {
                setDirection(-1);
                setCurrentDate(addDays(currentDate, 1));
              }
            }}
            onSwipeRight={() => {
              if (!isEventOpen) {
                setDirection(1);
                setCurrentDate(subDays(currentDate, 1));
              }
            }}
            disabled={isEventOpen}
          >
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={currentDateKey}
                className="h-full overflow-auto"
                initial={{
                  x: direction < 0 ? 200 : -200,
                  opacity: 0.5,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                }}
                exit={{
                  x: direction < 0 ? -200 : 200,
                  opacity: 0,
                  zIndex: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.5,
                }}
              >
                <div className="space-y-4 p-6">
                  {currentEvents.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <p className="text-lg">No events scheduled</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {currentEvents.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: 1,
                            transition: {
                              delay: index * 0.05,
                              duration: 0.3,
                              ease: "easeOut"
                            }
                          }}
                        >
                          <EventCard
                            event={event}
                            onClick={() => {
                              handleOpenEventDialog(event);
                            }}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </SwipeableView>
        </div>

        {/* Desktop View - Perfectly aligned with header day columns */}
        <div className="hidden md:block md:h-full">
          <div className="grid-cols-days h-full">
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
                    "border-r border-gray-100 last:border-r-0 h-full overflow-y-auto px-2 pt-3",
                    isToday(date) ? "bg-blue-50/30" : "",
                    isDragging ? "drop-target" : "",
                    isActiveDropTarget && isDragging ? "bg-blue-50" : "",
                    format(date, "yyyy-MM-dd") === currentDateKey ? "bg-blue-50/50" : ""
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleDragOver(dateKey);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDragEnd();
                  }}
                >
                  <div className="space-y-4">
                    {dayEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: 1,
                          transition: {
                            delay: index * 0.05,
                            duration: 0.3,
                            ease: "easeOut"
                          }
                        }}
                      >
                        <EventCard
                          event={event}
                          draggable
                          onDragStart={() => handleDragStart(event, dateKey)}
                          onClick={() => {
                            handleOpenEventDialog(event);
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Dialog */}
      <EventDialog
        event={selectedEvent}
        isOpen={isEventOpen}
        onClose={handleCloseEventDialog}
      />
    </div>
  );
}

// Event Card Component
function EventCard({
  event,
  onClick,
  draggable,
  onDragStart,
}: {
  event: Event;
  onClick: () => void;
  draggable?: boolean;
  onDragStart?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card
        draggable={draggable}
        onDragStart={onDragStart}
        onClick={onClick}
        className={cn(
          "cursor-pointer hover:shadow-md transition-all overflow-hidden rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.1)]",
          draggable && "hover:scale-105"
        )}
      >
        <motion.div 
          className="relative w-full h-[160px] overflow-hidden rounded-t-xl"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackImageUrl;
            }}
          />
          <TimePill time={event.time} className="absolute top-4 right-4" />
        </motion.div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900">{event.title}</h3>
        </div>
      </Card>
    </motion.div>
  );
}

// Event Dialog Component
function EventDialog({
  event,
  isOpen,
  onClose,
}: {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!event) return null;

  const handleClose = () => {
    // Call the parent's onClose without changing any date state
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={true}>
      <DialogContent className="fixed inset-0 w-full h-full p-0 m-0 border-0 rounded-none bg-white max-w-none translate-x-0 translate-y-0 !duration-200">
        <AnimatePresence mode="wait">
          <motion.div
            key="dialog-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className="absolute inset-0 flex flex-col"
          >
            <VisuallyHidden>
              <DialogTitle>{event.title}</DialogTitle>
              <DialogDescription>{event.description}</DialogDescription>
            </VisuallyHidden>

            <motion.div className={cn(
              "relative w-full overflow-hidden",
              "h-[40vh]", // Mobile height
              "md:h-[50vh]" // Desktop height
            )}>
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
              <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{event.title}</h2>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 opacity-80" />
                  <span className="text-sm md:text-base text-white/90">
                    {event.fullDate
                      ? getRelativeDate(new Date(event.fullDate))
                      : "Today"}
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="flex-1 overflow-auto">
              <div className="p-8 md:p-12 space-y-6 bg-white min-h-full">
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-[#6c63ff] mr-4 mt-0.5" />
                    <div>
                      <p className="text-sm md:text-base font-medium text-gray-700">Date & Time</p>
                      <p className="text-sm md:text-base text-gray-500">
                        {event.fullDate || format(new Date(), "EEEE, MMMM d, yyyy")}{" "}
                        at {event.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#6c63ff] mr-4 mt-0.5" />
                    <div>
                      <p className="text-sm md:text-base font-medium text-gray-700">Duration</p>
                      <p className="text-sm md:text-base text-gray-500">
                        {event.duration || "1 hour"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogClose className="absolute right-5 top-5 z-30 rounded-full bg-black/20 p-2 text-white hover:bg-black/30 transition-colors duration-200">
              <X className="h-5 w-5 md:h-6 md:w-6" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
} 