import { format } from "date-fns";

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  time: string;
}

interface EventsByDate {
  [date: string]: Event[];
}

// Get current date in yyyy-MM-dd format
const today = format(new Date(), "yyyy-MM-dd");
const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
const tomorrow = format(new Date(Date.now() + 86400000), "yyyy-MM-dd");
const dayAfterTomorrow = format(
  new Date(Date.now() + 2 * 86400000),
  "yyyy-MM-dd",
);
const twoDaysAgo = format(new Date(Date.now() - 2 * 86400000), "yyyy-MM-dd");

// This would typically come from a database or API
// For now, we'll keep it as a static object with dynamic dates
const events: EventsByDate = {
  [twoDaysAgo]: [
    {
      id: "event-past-1",
      title: "Project Kickoff",
      description:
        "Initial meeting to discuss project scope, timeline, and team responsibilities. Set up communication channels and project management tools.",
      imageUrl:
        "https://fastly.picsum.photos/id/433/1920/1080.jpg?hmac=_4-vRvvQSPtpfXL-XRDgPVTrSsQJWJZhWbBkl_Qk67k",
      time: "10:00 AM",
    },
  ],
  [yesterday]: [
    {
      id: "event-past-2",
      title: "Design Review",
      description:
        "Review UI mockups and design system with the design team. Discuss implementation approach and potential challenges.",
      imageUrl:
        "https://fastly.picsum.photos/id/96/1920/1080.jpg?hmac=kKFGWKDL7yQZpfQJkLXQRvWtQHmXLmE6RyqxXYEgXTU",
      time: "02:30 PM",
    },
    {
      id: "event-past-3",
      title: "Team Lunch",
      description:
        "Casual team lunch to celebrate recent project milestones and build team rapport.",
      imageUrl:
        "https://fastly.picsum.photos/id/292/1920/1080.jpg?hmac=HYdJVbXwxIbT-Qs_Ib9s9GbM9haT3RzHhgI4hj2Vsj0",
      time: "12:00 PM",
    },
  ],
  [today]: [
    {
      id: "event-1",
      title: "Coffee with Alex",
      description:
        "Meet with Alex to brainstorm ideas for the upcoming product launch. We'll review market research and competitor analysis to identify potential opportunities and challenges.",
      imageUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "09:00 AM",
    },
    {
      id: "event-2",
      title: "Team Standup",
      description:
        "Weekly standup meeting with the dev team. Discuss progress, blockers, and align on next week's priorities.",
      imageUrl:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "02:00 PM",
    },
    {
      id: "event-today-3",
      title: "Client Call",
      description:
        "Monthly progress update with the client. Present completed features, gather feedback, and discuss next steps.",
      imageUrl:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "04:30 PM",
    },
  ],
  [tomorrow]: [
    {
      id: "event-3",
      title: "Yoga Session",
      description:
        "Join for a relaxing yoga session to reduce stress and improve mindfulness. Suitable for all levels, focusing on gentle stretches.",
      imageUrl:
        "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "12:00 PM",
    },
    {
      id: "event-4",
      title: "Product Demo",
      description:
        "Demo of UI improvements and performance optimizations to gather stakeholder feedback.",
      imageUrl:
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "03:30 PM",
    },
    {
      id: "event-tomorrow-3",
      title: "Code Review",
      description:
        "Review pull requests and provide feedback on code quality, performance, and adherence to best practices.",
      imageUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "10:00 AM",
    },
  ],
  [dayAfterTomorrow]: [
    {
      id: "event-5",
      title: "Client Meeting",
      description:
        "Review project progress, timeline adjustments, and outline roadmap for next quarter with the client.",
      imageUrl:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "11:30 AM",
    },
    {
      id: "event-future-2",
      title: "Team Building",
      description:
        "Virtual team building activity to strengthen collaboration and communication within the team.",
      imageUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "03:00 PM",
    },
  ],
};

/**
 * Get events for a specific date
 * This function can be called from server components
 */
export async function getEventsForDate(date: Date): Promise<Event[]> {
  // No need to simulate a database call with the mock data
  const dateKey = format(date, "yyyy-MM-dd");
  return events[dateKey] || [];
}

/**
 * Check if a date has any events
 */
export async function hasEventsForDate(date: Date): Promise<boolean> {
  // No need to simulate a database call with the mock data
  const dateKey = format(date, "yyyy-MM-dd");
  return !!events[dateKey] && events[dateKey].length > 0;
}

/**
 * Get all available dates with events
 */
export async function getEventDates(): Promise<string[]> {
  // No need to simulate a database call with the mock data
  return Object.keys(events);
}
