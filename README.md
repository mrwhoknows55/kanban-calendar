# Kanban Calendar App

A simple calendar app built with Next.js that helps you organize events in a kanban style.

Visit [https://calendar.avdt.xyz/](https://calendar.avdt.xyz) to see the live app.

## Screenshots

<details>
<summary>Toggle to view</summary>

| Mobile                                                       | Desktop                                                        |
| ------------------------------------------------------------ | -------------------------------------------------------------- |
| ![Mobile Main View](/docs/screenshots/mobile-main.png)       | ![Desktop Main View](/docs/screenshots/desktop-main.png)       |
| ![Mobile Details View](/docs/screenshots/mobile-details.png) | ![Desktop Details View](/docs/screenshots/desktop-details.png) |

</details>

## Features

- Responsive design for mobile and desktop
- Weekly calendar navigation
- Drag and drop cross-day event movement
- Smooth animations and transitions
- Real-time event updates
- Optimized performance
- Mock data integration (temporary)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Date Handling**: date-fns

## Project Structure

```
app/
├── components/
│   ├── calendar/     # Calendar-specific components
│   └── ui/           # Reusable UI components
├── lib/              # Utility functions and hooks
└── week/             # Week view pages
```

## Getting Started

```bash
# Install dependencies
pnpm install
```

```bash
# Run development server
pnpm dev

# Start production server
pnpm start
```

```bash
# Build for production
pnpm build
```

## Future Scope and Possible Features

- Database integration (PostgreSQL/MongoDB)
- Authentication and user profiles
- Dark/light theme support
- Additional calendar views (month, year)
- Recurring events and event categorization
- Performance and touch gesture enhancements
- Offline capability with PWA features
- Push notifications for reminders
- Real-time collaborative editing via WebSockets
- Import/export functionality
