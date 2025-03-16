"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { type Event } from "@/app/lib/calendar-data";
import { Card } from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent as BaseDialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from "@/app/components/ui/dialog";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { X, Clock, Calendar } from "lucide-react";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/app/lib/utils";
import { useDragStore } from "@/app/lib/gesture-utils";
import { TimePill } from "@/app/components/calendar/TimePill";

interface DraggableEventCardProps {
  event: Event;
  onDragEnd?: (event: Event, offset: number) => void;
  onDragStart?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Custom DialogContent with styled default close button
const DialogContent = React.forwardRef<
  React.ElementRef<typeof BaseDialogContent>,
  React.ComponentPropsWithoutRef<typeof BaseDialogContent>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <BaseDialogContent
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogClose className="absolute right-5 top-5 z-30 rounded-full bg-black/20 p-2 text-white hover:bg-black/30 transition-colors duration-200 focus:outline-none">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </DialogClose>
    </BaseDialogContent>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

export function DraggableEventCard({
  event,
  onDragEnd,
  onDragStart,
  isOpen = false,
  onOpenChange,
}: DraggableEventCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Use the global drag store
  const { startDrag, endDrag, canOpenCard } = useDragStore();

  const fallbackImageUrl =
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1920&h=1080&auto=format&fit=crop";

  // Motion values for drag
  const x = useMotionValue(0);

  // Transform x motion value to card rotation and scale
  const rotate = useTransform(x, [-200, 0, 200], [-5, 0, 5]);
  const scale = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0.95, 0.97, 1, 0.97, 0.95],
  );

  // Track drag distance for determining if it was a click or drag
  const handleDrag = () => {
    setDragDistance(Math.abs(x.get()));
  };

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
    setDragDistance(0);

    // Add dragging class to body for global cursor changes
    document.body.classList.add("dragging");

    // Update global drag state
    startDrag();

    // Call the onDragStart callback if provided
    if (onDragStart) {
      onDragStart();
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    const xOffset = x.get();
    const wasDragged = dragDistance > 10;

    setIsDragging(false);

    // Remove dragging class from body
    document.body.classList.remove("dragging");

    // Update global drag state
    endDrag();

    // Only call the drag end callback if it was actually dragged
    if (wasDragged && onDragEnd) {
      const direction = xOffset > 0 ? 1 : -1;
      onDragEnd(event, direction);
    }

    // Reset position
    x.set(0);
  };

  // Handle card click - completely separate from drag handling
  const handleCardClick = () => {
    // Only treat as a click if:
    // 1. Not currently dragging
    // 2. Drag distance is minimal
    // 3. No drag operation is in progress globally
    // 4. Enough time has passed since the last drag completed
    if (!isDragging && dragDistance < 10 && canOpenCard() && onOpenChange) {
      onOpenChange(true);
    }
  };

  // Shared animation settings
  const sharedTransition = {
    type: "spring",
    damping: 25,
    stiffness: 400,
    mass: 0.6,
    velocity: 2,
  };

  // Content animation variants
  const contentVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.2,
      },
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: {
        duration: 0.15,
      },
    },
  };

  // Details animation variants
  const detailsVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.15,
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
  };

  // Dialog animation variants
  const dialogVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.15,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15,
        delay: 0.05, // Slight delay to allow child animations to start first
      },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <motion.div
        ref={cardRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1} // Reduce elasticity to keep card more rigid
        dragTransition={{
          bounceStiffness: 600,
          bounceDamping: 30,
          power: 0,
          timeConstant: 0,
          restDelta: 0.001,
          modifyTarget: (target) => {
            // Always return to original position
            console.debug("modifyTarget:", target);
            return 0;
          },
        }}
        style={{ x, rotate, scale }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.98 }}
        whileDrag={{
          zIndex: 50,
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          cursor: "grabbing",
          opacity: 0.7,
        }}
        transition={sharedTransition}
        className="touch-none select-none relative"
      >
        <Card
          className="mb-5 cursor-grab active:cursor-grabbing hover:shadow-md transition-all overflow-hidden rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
          onClick={handleCardClick}
        >
          <div className="relative w-full h-[160px] overflow-hidden rounded-t-xl">
            <Image
              src={imageError ? fallbackImageUrl : event.imageUrl}
              alt={event.title}
              fill
              className="object-cover pointer-events-none"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              onError={() => setImageError(true)}
              draggable={false}
            />
            <TimePill time={event.time} className="absolute top-4 right-4" />
          </div>
          <div className="p-5 flex flex-col">
            <h3 className="text-lg font-semibold text-[#222222] mb-2">
              {event.title}
            </h3>
            <p className="text-sm font-normal text-[#666666] leading-[1.5] line-clamp-2">
              {event.description}
            </p>
          </div>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {isOpen && (
          <DialogContent className="p-0 overflow-hidden max-w-none w-full h-full sm:h-auto sm:max-w-[500px] sm:rounded-lg border-none">
            <VisuallyHidden>
              <DialogTitle>{event.title}</DialogTitle>
              <DialogDescription>{event.description}</DialogDescription>
            </VisuallyHidden>
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col h-full bg-white"
            >
              {/* Cover image section */}
              <div className="relative w-full h-[40vh] sm:h-[280px] overflow-hidden">
                <Image
                  src={imageError ? fallbackImageUrl : event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Header content overlay */}
                <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">{event.title}</h2>

                    <TimePill
                      time={event.time}
                      layoutId={`time-pill-${event.id}`}
                    />
                  </div>

                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 opacity-80" />
                    <span className="text-sm text-white/90">Today</span>
                  </div>
                </div>
              </div>

              {/* Content section */}
              <div className="flex-1 overflow-y-auto bg-gradient-background">
                <motion.div
                  className="p-8"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {event.description}
                    </p>
                  </div>

                  <motion.div
                    className="border-t border-gray-200 pt-6"
                    variants={detailsVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-4">
                      Event Details
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-[#6c63ff] mr-4 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Date & Time
                          </p>
                          <p className="text-sm text-gray-500">
                            Today at {event.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-[#6c63ff] mr-4 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Duration
                          </p>
                          <p className="text-sm text-gray-500">1 hour</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
