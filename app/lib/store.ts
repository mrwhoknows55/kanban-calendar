import { create } from 'zustand';
import { format, parse } from 'date-fns';

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

const events: EventsByDate = {
  "2024-03-11": [
    {
      id: "event-1",
      title: "Coffee with Alex",
      description:
        "Meet with Alex to brainstorm ideas for the upcoming product launch. We'll review market research and competitor analysis to identify potential opportunities and challenges.",
      imageUrl:
        "https://fastly.picsum.photos/id/312/1920/1080.jpg?hmac=OD_fP9MUQN7uJ8NBR7tlii78qwHPUROGgohG4w16Kjw",
      time: "09:00 AM",
    },
    {
      id: "event-2",
      title: "Team Standup",
      description:
        "Weekly standup meeting with the dev team. Discuss progress, blockers, and align on next week's priorities.",
      imageUrl:
        "http://fastly.picsum.photos/id/737/1920/1080.jpg?hmac=aFzER8Y4wcWTrXVx2wVKSj10IqnygaF33gESj0WGDwI",
      time: "02:00 PM",
    },
  ],
  "2024-03-12": [
    {
      id: "event-3",
      title: "Yoga Session",
      description:
        "Join for a relaxing yoga session to reduce stress and improve mindfulness. Suitable for all levels, focusing on gentle stretches.",
      imageUrl:
        "https://fastly.picsum.photos/id/392/1920/1080.jpg?hmac=Fvbf7C1Rcozg8EccwYPqsGkk_o6Bld2GQRDPZKWpd7g",
      time: "12:00 PM",
    },
    {
      id: "event-4",
      title: "Product Demo",
      description:
        "Demo of UI improvements and performance optimizations to gather stakeholder feedback.",
      imageUrl:
        "https://fastly.picsum.photos/id/249/1920/1080.jpg?hmac=cPMNdgGXRh6T_KhRMuaQjRtAx5cWRraELjtL2MHTfYs",
      time: "03:30 PM",
    },
  ],
  "2024-03-13": [
    {
      id: "event-5",
      title: "Client Meeting",
      description:
        "Review project progress, timeline adjustments, and outline roadmap for next quarter with the client.",
      imageUrl:
        "https://fastly.picsum.photos/id/908/1920/1080.jpg?hmac=MeG_oA1s75hHAL_4JzCioh6--zyFTWSCTxOhe8ugvXo",
      time: "11:30 AM",
    },
  ],
};

interface CalendarState {
  selectedDate: Date;
  events: EventsByDate;
  setSelectedDate: (date: Date) => void;
  getEventsForDate: (date: Date) => Event[];
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  selectedDate: new Date(2024, 2, 11), // March 11, 2024
  events,
  
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  getEventsForDate: (date) => {
    const { events } = get();
    const dateKey = format(date, 'yyyy-MM-dd');
    return events[dateKey] || [];
  },
})); 