"use client";

import React from "react";
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
} from "@/app/components/ui/dialog";
import { TimePill } from "@/app/components/calendar/TimePill";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [imageError, setImageError] = React.useState(false);
  const fallbackImageUrl =
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1920&h=1080&auto=format&fit=crop";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="mb-4 cursor-pointer hover:shadow-md transition-all overflow-hidden rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
          <div className="relative w-full h-[140px] overflow-hidden rounded-t-xl">
            <Image
              src={imageError ? fallbackImageUrl : event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              onError={() => setImageError(true)}
            />
            <TimePill
              time={event.time}
              className="absolute top-3 right-3"
              layoutId={`time-pill-${event.id}`}
            />
          </div>
          <div className="p-4 flex flex-col">
            <h3 className="text-lg font-semibold text-[#222222] mb-1">
              {event.title}
            </h3>
            <p className="text-sm font-normal text-[#666666] leading-[1.4] line-clamp-2">
              {event.description}
            </p>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="bg-gradient-header text-white p-4 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="text-white text-xl">
            {event.title}
          </DialogTitle>
          <DialogDescription className="text-white/90 text-base">
            <TimePill
              time={event.time}
              className="inline-flex"
              layoutId={`time-pill-${event.id}`}
            />
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full h-[200px] rounded-md overflow-hidden">
          <Image
            src={imageError ? fallbackImageUrl : event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            onError={() => setImageError(true)}
          />
        </div>

        <div className="mt-4">
          <h4 className="text-[#222222] font-semibold mb-2">Description</h4>
          <p className="text-[#666666] text-sm leading-relaxed">
            {event.description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
