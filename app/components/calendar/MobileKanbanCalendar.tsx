"use client";

import React, { useState } from "react";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  isSameWeek,
  isToday,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { type Event } from "@/app/lib/calendar-data";
import { cn, formatDate } from "@/app/lib/utils";
import { useSwipe } from "@/app/lib/gesture-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendarEvents } from "@/app/lib/calendar-hooks";
import { Card } from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/app/components/ui/dialog";
import { Calendar, Clock } from "lucide-react";
import { X } from "lucide-react";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";

interface MobileKanbanCalendarProps {
  initialDate: Date;
  events: Record<string, Event[]>;
}

export function MobileKanbanCalendar({
  initialDate: initialDate,
  events: initialEvents,
}: MobileKanbanCalendarProps) {

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(currentDate, { weekStartsOn: 1 }),
  );
  const [direction, setDirection] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventOpen, setIsEventOpen] = useState<boolean>(false);

  // Use our custom hook for managing events
  const { events } = useCalendarEvents({ initialEvents });

  // Format the current date as a string key for the events object
  const currentDateKey = format(currentDate, "yyyy-MM-dd");

  // Get events for the current date
  const currentEvents = events[currentDateKey] || [];

  // Handle swipe to change date
  const handleSwipe = (direction: number) => {
    setDirection(direction);

    const newDate =
      direction > 0
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
    const newWeekStart =
      direction > 0
        ? subDays(currentWeekStart, 7) // Previous week
        : addDays(currentWeekStart, 7); // Next week

    setCurrentWeekStart(newWeekStart);

    // Also update the current date to the same day in the new week
    const dayOfWeek =
      (currentDate.getDay() === 0 ? 7 : currentDate.getDay()) - 1;
    const newDate = addDays(newWeekStart, dayOfWeek);
    setCurrentDate(newDate);
    setDirection(direction);
  };

  // Set up swipe handlers
  useSwipe(
    {
      onSwipeLeft: () => handleSwipe(-1),
      onSwipeRight: () => handleSwipe(1),
    },
    {
      threshold: 50,
      preventDefault: false,
    },
  );

  // Generate dates for the week view based on currentWeekStart
  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(currentWeekStart, i));
    }
    return dates;
  };

  const weekDates = generateWeekDates();

  const fallbackImageUrl =
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1920&h=1080&auto=format&fit=crop";

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* Week header */}
      <div className="bg-gradient-header text-white p-6">
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

        <div className="flex justify-between w-full px-2 py-3 overflow-hidden">
          {weekDates.map((date) => (
            <motion.button
              key={format(date, "yyyy-MM-dd")}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-md w-12 h-16 p-3 relative transition-all duration-300",
                format(date, "yyyy-MM-dd") === currentDateKey
                  ? "bg-gradient-active text-white scale-110"
                  : "bg-white/5 text-white",
                isToday(date) && format(date, "yyyy-MM-dd") !== currentDateKey
                  ? "ring-1 ring-white/30"
                  : "",
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

      {/* Daily events with swipe animation */}
      <div className="flex-1 bg-white overflow-hidden flex flex-col">
        {/* Static date display with fading line on the right */}
        <div className="p-6 pb-0">
          <div className="mb-6 flex items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mr-4">
              {format(currentDate, "EEE MMM d yyyy")}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>
        </div>

        {/* Animated content area */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={currentDateKey}
              className="absolute inset-0 overflow-y-auto"
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
                velocity: 4,
              }}
            >
              <div className="p-6 pt-0">
                {currentEvents.length === 0 ? (
                  <motion.div
                    className="text-center py-10 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                  >
                    <p className="text-lg">No events scheduled for today</p>
                  </motion.div>
                ) : (
                  <div className="space-y-5">
                    {currentEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: 0.05 + index * 0.03,
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
                            transition={{
                              layout: { type: "spring", stiffness: 300, damping: 25 }
                            }}
                          >
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              fill
                              className="object-cover pointer-events-none"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority
                              onError={(
                                e: React.SyntheticEvent<HTMLImageElement>,
                              ) => {
                                // Fallback image on error
                                const target = e.target as HTMLImageElement;
                                target.src = fallbackImageUrl;
                              }}
                            />
                            <motion.div 
                              className="absolute top-4 right-4 bg-[#6c63ff] px-3 py-1.5 rounded-full text-sm font-bold text-white z-10"
                              layoutId={`time-badge-${event.id}`}
                              transition={{
                                layout: { type: "spring", stiffness: 500, damping: 25 }
                              }}
                            >
                              {event.time}
                            </motion.div>
                          </motion.div>
                          <motion.div 
                            className="p-5 flex flex-col"
                            layoutId={`content-container-${event.id}`}
                            transition={{
                              layout: { type: "spring", stiffness: 300, damping: 25 }
                            }}
                          >
                            <motion.h3 
                              className="text-lg font-semibold text-[#222222] mb-2"
                              layoutId={`title-${event.id}`}
                              transition={{
                                layout: { type: "spring", stiffness: 300, damping: 25 }
                              }}
                            >
                              {event.title}
                            </motion.h3>
                            <motion.p 
                              className="text-sm font-normal text-[#666666] leading-[1.5] line-clamp-2"
                              layoutId={`description-${event.id}`}
                              transition={{
                                layout: { type: "spring", stiffness: 300, damping: 25 }
                              }}
                            >
                              {event.description}
                            </motion.p>
                          </motion.div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Event details dialog */}
      <Dialog open={isEventOpen} onOpenChange={setIsEventOpen}>
        <AnimatePresence mode="sync" onExitComplete={() => {}}>
          {isEventOpen && selectedEvent && (
            <DialogContent 
              className="p-0 overflow-hidden max-w-none w-full h-full sm:h-auto sm:max-w-[500px] sm:rounded-lg border-none"
              onPointerDownOutside={(e) => {
                // Prevent interaction with elements behind the dialog
                e.preventDefault();
              }}
              onInteractOutside={(e) => {
                // Prevent any interaction outside the dialog when it's open
                e.preventDefault();
              }}
            >
              <VisuallyHidden>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  {selectedEvent.description}
                </DialogDescription>
              </VisuallyHidden>
              <motion.div
                layoutId={`card-container-${selectedEvent.id}`}
                initial={{ 
                  borderRadius: 12, 
                  y: 20, 
                  opacity: 0.8, 
                  scale: 0.8,
                  rotate: 1
                }}
                animate={{ 
                  borderRadius: 12, 
                  y: 0, 
                  opacity: 1, 
                  scale: 1,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    mass: 0.8,
                    velocity: 2
                  }
                }}
                exit={{ 
                  borderRadius: 12, 
                  y: 30, 
                  opacity: 0, 
                  scale: 0.8,
                  rotate: -1,
                  transition: {
                    type: "spring",
                    stiffness: 350,
                    damping: 22,
                    mass: 0.7,
                    velocity: 3
                  }
                }}
                className="flex flex-col h-full bg-white shadow-2xl"
              >
                {/* Cover image section */}
                <motion.div 
                  className="relative w-full h-[40vh] sm:h-[280px] overflow-hidden rounded-t-xl"
                  layoutId={`image-container-${selectedEvent.id}`}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 25 }
                  }}
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
                        className="text-2xl font-bold"
                        layoutId={`title-${selectedEvent.id}`}
                        transition={{
                          layout: { type: "spring", stiffness: 300, damping: 25 }
                        }}
                      >
                        {selectedEvent.title}
                      </motion.h2>

                      <motion.div 
                        className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-white"
                        layoutId={`time-badge-${selectedEvent.id}`}
                        transition={{
                          layout: { type: "spring", stiffness: 500, damping: 25 }
                        }}
                      >
                        {selectedEvent.time}
                      </motion.div>
                    </div>

                    <motion.div 
                      className="flex items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 20,
                          delay: 0.2
                        }
                      }}
                      exit={{ 
                        opacity: 0, 
                        y: 5, 
                        transition: { 
                          duration: 0.15,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2 opacity-80" />
                      <span className="text-sm text-white/90">Today</span>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Content section */}
                <motion.div 
                  className="flex-1 overflow-y-auto bg-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      mass: 0.8,
                      delay: 0.1
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: 10, 
                    transition: { 
                      duration: 0.2,
                      ease: "easeOut"
                    }
                  }}
                >
                  <motion.div 
                    className="p-8"
                    layoutId={`content-container-${selectedEvent.id}`}
                    transition={{
                      layout: { type: "spring", stiffness: 300, damping: 25 }
                    }}
                  >
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: "auto", 
                        opacity: 1,
                        transition: {
                          height: { type: "spring", stiffness: 300, damping: 25, delay: 0.1 },
                          opacity: { duration: 0.2, delay: 0.2 }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0, 
                        transition: { 
                          height: { duration: 0.2 },
                          opacity: { duration: 0.15 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                          Description
                        </h3>
                        <motion.p 
                          className="text-gray-600 leading-relaxed text-base"
                          layoutId={`description-${selectedEvent.id}`}
                          transition={{
                            layout: { type: "spring", stiffness: 300, damping: 25 }
                          }}
                        >
                          {selectedEvent.description}
                        </motion.p>
                      </div>

                      <motion.div
                        className="border-t border-gray-200 pt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            delay: 0.25
                          }
                        }}
                        exit={{ 
                          opacity: 0, 
                          y: 5, 
                          transition: { 
                            duration: 0.1,
                            ease: "easeIn"
                          }
                        }}
                      >
                        <h3 className="text-sm font-medium text-gray-500 mb-4">
                          Event Details
                        </h3>

                        <div className="space-y-4">
                          <motion.div 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ 
                              opacity: 1, 
                              x: 0,
                              transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                                delay: 0.3
                              }
                            }}
                            exit={{ 
                              opacity: 0, 
                              x: -3, 
                              transition: { 
                                duration: 0.1,
                                ease: "easeIn"
                              }
                            }}
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
                            animate={{ 
                              opacity: 1, 
                              x: 0,
                              transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                                delay: 0.4
                              }
                            }}
                            exit={{ 
                              opacity: 0, 
                              x: -3, 
                              transition: { 
                                duration: 0.1,
                                ease: "easeIn"
                              }
                            }}
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
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { 
                    delay: 0.2, 
                    duration: 0.2,
                    type: "spring",
                    stiffness: 400,
                    damping: 20
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8,
                  transition: { 
                    duration: 0.15,
                    ease: "easeInOut"
                  }
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-5 top-5 z-30"
              >
                <DialogClose className="rounded-full bg-black/20 p-2 text-white hover:bg-black/30 transition-colors duration-200 focus:outline-none">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </div>
  );
}
