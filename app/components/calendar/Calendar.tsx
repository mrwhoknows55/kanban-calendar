import React from "react";
import { WeekView } from "@/app/components/calendar/WeekView";
import { DailySchedule } from "@/app/components/calendar/DailySchedule";
import { getSelectedDate } from "@/app/lib/calendar-actions";
import { Suspense } from "react";

interface CalendarProps {
  initialDate?: Date;
}

export async function Calendar({ initialDate }: CalendarProps) {
  // Get the selected date from cookies if initialDate is not provided
  const selectedDate = initialDate || (await getSelectedDate());

  return (
    <div className="flex flex-col w-full h-screen shadow-lg overflow-hidden sm:max-w-md sm:rounded-lg">
      <div className="bg-gradient-header text-white p-4">
        <h1 className="text-xl font-bold mb-2">Your Schedule</h1>
        <Suspense fallback={<WeekViewSkeleton />}>
          <WeekView selectedDate={selectedDate} />
        </Suspense>
      </div>
      <div className="flex-1 bg-white overflow-y-auto">
        <Suspense fallback={<DailyScheduleSkeleton />}>
          <DailySchedule selectedDate={selectedDate} />
        </Suspense>
      </div>
    </div>
  );
}

function WeekViewSkeleton() {
  return (
    <div className="flex justify-between w-full px-2 py-3">
      {Array(7)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center p-1 rounded-full w-10 h-16 bg-white/10"
          ></div>
        ))}
    </div>
  );
}

function DailyScheduleSkeleton() {
  return (
    <div className="flex flex-col p-4">
      <div className="bg-gradient-background p-3 rounded-md mb-4 shadow-sm">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
      </div>

      <div className="space-y-4">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden shadow-sm animate-pulse"
            >
              <div className="h-[140px] bg-gray-200"></div>
              <div className="p-4">
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
