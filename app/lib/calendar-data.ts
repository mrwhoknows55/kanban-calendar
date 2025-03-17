import {
  format,
  isToday,
  isYesterday,
  isTomorrow,
  differenceInDays,
} from "date-fns";

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  time: string;
  duration?: string;
  fullDate?: string;
}

export function getRelativeDate(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isTomorrow(date)) return "Tomorrow";

  const diffDays = differenceInDays(date, new Date());

  if (diffDays < 0) {
    const absDiff = Math.abs(diffDays);
    return absDiff === 1 ? "Yesterday" : `${absDiff} days ago`;
  }

  if (diffDays > 0) {
    return diffDays === 1 ? "Tomorrow" : `In ${diffDays} days`;
  }

  return format(date, "EEEE, MMMM d");
}

interface EventsByDate {
  [date: string]: Event[];
}

const today = format(new Date(), "yyyy-MM-dd");
const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
const tomorrow = format(new Date(Date.now() + 86400000), "yyyy-MM-dd");
const dayAfterTomorrow = format(
  new Date(Date.now() + 2 * 86400000),
  "yyyy-MM-dd",
);
const twoDaysAgo = format(new Date(Date.now() - 2 * 86400000), "yyyy-MM-dd");

// This is the mock data for the calendar
const events: EventsByDate = {
  [twoDaysAgo]: [
    {
      id: "event-past-1",
      title: "Project Kickoff",
      description:
        "Initial meeting to discuss project scope, timeline, and team responsibilities. Set up communication channels and project management tools.",
      imageUrl:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "10:00 AM",
      duration: "2 hours",
      fullDate: format(new Date(twoDaysAgo), "EEEE, MMMM d, yyyy"),
    },
  ],
  [yesterday]: [
    {
      id: "event-past-2",
      title: "Design Review",
      description:
        "Review UI mockups and design system with the design team. Discuss implementation approach and potential challenges.",
      imageUrl:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "02:30 PM",
      duration: "1.5 hours",
      fullDate: format(new Date(yesterday), "EEEE, MMMM d, yyyy"),
    },
    {
      id: "event-past-3",
      title: "Team Lunch",
      description:
        "Casual team lunch to celebrate recent project milestones and build team rapport.",
      imageUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "12:00 PM",
      duration: "1 hour",
      fullDate: format(new Date(yesterday), "EEEE, MMMM d, yyyy"),
    },
  ],
  [today]: [
    {
      id: "event-1",
      title: "Coffee with Alex",
      description:
        "Meet with Alex to brainstorm ideas for the upcoming product launch. We'll review market research and competitor analysis to identify potential opportunities and challenges.",
      imageUrl:
        "https://fastly.picsum.photos/id/312/1920/1080.jpg?hmac=OD_fP9MUQN7uJ8NBR7tlii78qwHPUROGgohG4w16Kjw",
      time: "09:00 AM",
      duration: "45 minutes",
      fullDate: format(new Date(today), "EEEE, MMMM d, yyyy"),
    },
    {
      id: "event-2",
      title: "Team Standup",
      description:
        "Weekly standup meeting with the dev team. Discuss progress, blockers, and align on next week's priorities.",
      imageUrl:
        "https://fastly.picsum.photos/id/737/1920/1080.jpg?hmac=aFzER8Y4wcWTrXVx2wVKSj10IqnygaF33gESj0WGDwI",
      time: "02:00 PM",
      duration: "30 minutes",
      fullDate: format(new Date(today), "EEEE, MMMM d, yyyy"),
    },
    {
      id: "event-today-3",
      title: "Client Call",
      description:
        "Monthly progress update with the client. Present completed features, gather feedback, and discuss next steps.",
      imageUrl:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "04:30 PM",
      duration: "1 hour",
      fullDate: format(new Date(today), "EEEE, MMMM d, yyyy"),
    },
  ],
  [tomorrow]: [
    {
      id: "event-3",
      title: "Yoga Session",
      description:
        "Join for a relaxing yoga session to reduce stress and improve mindfulness. Suitable for all levels, focusing on gentle stretches.",
      imageUrl:
        "https://fastly.picsum.photos/id/392/1920/1080.jpg?hmac=Fvbf7C1Rcozg8EccwYPqsGkk_o6Bld2GQRDPZKWpd7g",
      time: "12:00 PM",
      duration: "1 hour",
      fullDate: format(new Date(tomorrow), "EEEE, MMMM d, yyyy"),
    },
    {
      id: "event-4",
      title: "Product Demo",
      description:
        "Demo of UI improvements and performance optimizations to gather stakeholder feedback.",
      imageUrl:
        "https://fastly.picsum.photos/id/249/1920/1080.jpg?hmac=cPMNdgGXRh6T_KhRMuaQjRtAx5cWRraELjtL2MHTfYs",
      time: "03:30 PM",
      duration: "1 hour",
      fullDate: format(new Date(tomorrow), "EEEE, MMMM d, yyyy"),
    },
    {
      id: "event-tomorrow-3",
      title: "Code Review",
      description:
        "Review pull requests and provide feedback on code quality, performance, and adherence to best practices.",
      imageUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "10:00 AM",
      duration: "45 minutes",
      fullDate: format(new Date(tomorrow), "EEEE, MMMM d, yyyy"),
    },
  ],
  [dayAfterTomorrow]: [
    {
      id: "event-5",
      title: "Client Meeting",
      description:
        "Review project progress, timeline adjustments, and outline roadmap for next quarter with the client.",
      imageUrl:
        "https://fastly.picsum.photos/id/908/1920/1080.jpg?hmac=MeG_oA1s75hHAL_4JzCioh6--zyFTWSCTxOhe8ugvXo",
      time: "11:30 AM",
      duration: "2 hours",
      fullDate: format(new Date(dayAfterTomorrow), "EEEE, MMMM d, yyyy"),
    },
    {
      id: "event-future-2",
      title: "Team Building",
      description:
        "Virtual team building activity to strengthen collaboration and communication within the team.",
      imageUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&h=1080&auto=format&fit=crop",
      time: "03:00 PM",
      duration: "1.5 hours",
      fullDate: format(new Date(dayAfterTomorrow), "EEEE, MMMM d, yyyy"),
    },
  ],
};

export async function getEventsForDate(date: Date): Promise<Event[]> {
  const dateKey = format(date, "yyyy-MM-dd");
  return events[dateKey] || [];
}
export async function getEventDates(): Promise<string[]> {
  return Object.keys(events);
}
