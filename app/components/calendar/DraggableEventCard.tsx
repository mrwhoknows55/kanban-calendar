"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { type Event } from "@/app/lib/calendar-data";
import { Card } from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/app/components/ui/dialog";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { X, Clock, Calendar, ArrowLeft } from "lucide-react";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface DraggableEventCardProps {
  event: Event;
  onDragEnd?: (event: Event, offset: number) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DraggableEventCard({ 
  event, 
  onDragEnd,
  isOpen = false,
  onOpenChange
}: DraggableEventCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const fallbackImage =
    "https://fastly.picsum.photos/id/312/1920/1080.jpg?hmac=OD_fP9MUQN7uJ8NBR7tlii78qwHPUROGgohG4w16Kjw";

  // Motion values for drag
  const x = useMotionValue(0);
  const dragThreshold = 100; // Threshold to trigger day change
  
  // Transform x motion value to card rotation
  const rotate = useTransform(x, [-200, 0, 200], [-5, 0, 5]);
  
  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    const xOffset = x.get();
    
    if (Math.abs(xOffset) > dragThreshold && onDragEnd) {
      // Determine direction (negative = right, positive = left)
      const direction = xOffset > 0 ? 1 : -1;
      onDragEnd(event, direction);
    }
    
    // Reset position
    x.set(0);
  };

  // Shared animation settings
  const sharedTransition = {
    type: "spring",
    damping: 30,
    stiffness: 300,
    mass: 0.8
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <motion.div
          ref={cardRef}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{ x, rotate }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: 0.98 }}
          layoutId={`card-${event.id}`}
          transition={sharedTransition}
        >
          <Card 
            className="mb-5 cursor-pointer hover:shadow-md transition-all overflow-hidden rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
            onClick={() => !isDragging && onOpenChange && onOpenChange(true)}
          >
            <motion.div 
              className="relative w-full h-[160px] overflow-hidden rounded-t-xl"
              layoutId={`image-container-${event.id}`}
              transition={sharedTransition}
            >
              <Image
                src={imageError ? fallbackImage : event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                onError={() => setImageError(true)}
              />
              <motion.div 
                className="absolute top-4 right-4 bg-[#6c63ff] px-3 py-1.5 rounded-full text-sm font-bold text-white z-10"
                layoutId={`time-badge-${event.id}`}
                transition={sharedTransition}
              >
                {event.time}
              </motion.div>
            </motion.div>
            <motion.div 
              className="p-5 flex flex-col"
              layoutId={`content-${event.id}`}
              transition={sharedTransition}
            >
              <motion.h3 
                className="text-lg font-semibold text-[#222222] mb-2"
                layoutId={`title-${event.id}`}
                transition={sharedTransition}
              >
                {event.title}
              </motion.h3>
              <motion.p 
                className="text-sm font-normal text-[#666666] leading-[1.5] line-clamp-2"
                layoutId={`description-${event.id}`}
                transition={sharedTransition}
              >
                {event.description}
              </motion.p>
            </motion.div>
          </Card>
        </motion.div>
      </DialogTrigger>

      <AnimatePresence>
        {isOpen && (
          <DialogContent className="p-0 overflow-hidden max-w-none w-full h-full sm:h-auto sm:max-w-[500px] sm:rounded-lg border-none">
            <VisuallyHidden>
              <DialogTitle>{event.title}</DialogTitle>
              <DialogDescription>{event.description}</DialogDescription>
            </VisuallyHidden>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full bg-white"
            >
              {/* Close button (top right) */}
              <DialogClose className="absolute right-5 top-5 z-30 rounded-full bg-black/20 p-2 text-white hover:bg-black/30 transition-colors duration-200 focus:outline-none">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogClose>
              
              {/* Cover image section */}
              <motion.div 
                className="relative w-full h-[40vh] sm:h-[280px] overflow-hidden"
                layoutId={`image-container-${event.id}`}
                transition={sharedTransition}
              >
                <Image
                  src={imageError ? fallbackImage : event.imageUrl}
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
                    <motion.h2 
                      className="text-2xl font-bold"
                      layoutId={`title-${event.id}`}
                      transition={sharedTransition}
                    >
                      {event.title}
                    </motion.h2>
                    
                    <motion.div 
                      className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-white"
                      layoutId={`time-badge-${event.id}`}
                      transition={sharedTransition}
                    >
                      {event.time}
                    </motion.div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 opacity-80" />
                    <span className="text-sm text-white/90">Today</span>
                  </div>
                </div>
              </motion.div>

              {/* Content section */}
              <div className="flex-1 overflow-y-auto bg-gradient-background">
                <motion.div 
                  className="p-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Description</h3>
                    <motion.p 
                      className="text-gray-600 leading-relaxed text-base"
                      layoutId={`description-${event.id}`}
                      transition={sharedTransition}
                    >
                      {event.description}
                    </motion.p>
                  </div>
                  
                  <motion.div 
                    className="border-t border-gray-200 pt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Event Details</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-[#6c63ff] mr-4 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Date & Time</p>
                          <p className="text-sm text-gray-500">Today at {event.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-[#6c63ff] mr-4 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Duration</p>
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