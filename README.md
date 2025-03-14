# Calendar Mobile View

A mobile-friendly calendar application built with Next.js, TypeScript, Tailwind CSS, and Zustand.

## Features

- Week view calendar strip for easy date navigation
- Daily schedule view showing events for the selected day
- Event cards with detailed information
- "Zoom to open" transition for event details
- Responsive design optimized for mobile devices

## Components

### UI Components

- **Button**: Reusable button component with various styles and sizes
- **Card**: Card component for displaying content in a contained format
- **Dialog**: Modal dialog for displaying detailed event information

### Calendar Components

- **Calendar**: Main component that combines WeekView and DailySchedule
- **WeekView**: Displays a week strip for date selection
- **DailySchedule**: Shows events for the selected day
- **EventCard**: Card component for individual events with zoom-to-open functionality

## State Management

The application uses Zustand for state management, with the following features:

- Store selected date
- Manage calendar events
- Filter events by date

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Image Placeholders

The application uses placeholder images for events. Replace the following files with actual images:

- `/public/images/coffee.jpg`
- `/public/images/buildings.jpg`
- `/public/images/bridge.jpg`

## Technologies Used

- Next.js 15
- TypeScript
- Tailwind CSS 4
- Zustand for state management
- Radix UI for accessible components
- date-fns for date manipulation

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
