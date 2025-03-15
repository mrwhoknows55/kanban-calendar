import { ResponsiveCalendar } from "@/app/components/calendar/ResponsiveCalendar";
import { getSelectedDate } from "@/app/lib/calendar-actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar | Your Schedule",
  description: "View and manage your daily schedule",
};

export default async function CalendarPage() {
  // Get the selected date from cookies
  const selectedDate = await getSelectedDate();
  
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-background">
      <ResponsiveCalendar initialDate={selectedDate} />
    </main>
  );
}
