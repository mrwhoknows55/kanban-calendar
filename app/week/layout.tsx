import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kanban Calendar",
  description:
    "Interactive drag and drop calendar with kanban-style event management",
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gradient-background">{children}</div>;
}
