import { Calendar } from "@/app/components/calendar/Calendar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar | Your Schedule",
  description: "View and manage your daily schedule",
};

export default function CalendarPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-background p-4">
      <Calendar />
    </main>
  );
}
