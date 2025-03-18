# Application Flow Diagrams

## Component Hierarchy

```mermaid
graph TD
    A[App Root] --> B[Layout]
    B --> C[Page]
    C --> D[CalendarContainer]
    
    D --> E[ResponsiveCalendar]
    E --> F[DesktopKanbanCalendar]
    E --> G[MobileKanbanCalendar]
    
    F --> H[Calendar]
    F --> I[DraggableEventCard]
    F --> J[TimePill]
    
    G --> K[Calendar]
    G --> L[DraggableEventCard]
    G --> M[TimePill]
    
    D --> N[ClientCalendar]
    N --> O[EventCard]
    
    D --> P[RefreshButton]
    
    subgraph UI Components
        Q[Button]
        R[Card]
        S[Dialog]
        T[Header]
        U[Nav]
        V[CalendarSkeleton]
    end
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant ClientCalendar
    participant CalendarContainer
    participant Server
    participant Database

    User->>ClientCalendar: Interact with Calendar
    ClientCalendar->>CalendarContainer: Trigger Action
    CalendarContainer->>Server: Fetch/Update Data
    Server->>Database: Query/Update
    Database-->>Server: Response
    Server-->>CalendarContainer: Updated Data
    CalendarContainer-->>ClientCalendar: Update UI
    ClientCalendar-->>User: Visual Feedback
```

## State Management Flow

```mermaid
graph LR
    A[User Action] --> B[Client Component]
    B --> C[Action Creator]
    C --> D[State Update]
    D --> E[UI Update]
    
    subgraph State Management
        F[useState]
        G[useReducer]
        H[Context]
        I[Cookies]
    end
    
    D --> F
    D --> G
    D --> H
    D --> I
```

## Server-Client Component Interaction

```mermaid
graph TD
    A[Server Component] -->|Initial Data| B[Client Component]
    B -->|User Interaction| C[Client Action]
    C -->|State Update| D[Client State]
    D -->|Re-render| B
    
    subgraph Server
        E[Data Fetching]
        F[Server Actions]
        G[API Routes]
    end
    
    A --> E
    E --> F
    F --> G
```

## Drag and Drop Flow

```mermaid
sequenceDiagram
    participant User
    participant DraggableEventCard
    participant Calendar
    participant StateManager
    
    User->>DraggableEventCard: Start Drag
    DraggableEventCard->>Calendar: Drag Over
    Calendar->>Calendar: Update Drop Target
    User->>Calendar: Drop Event
    Calendar->>StateManager: Update Event Date
    StateManager-->>Calendar: Confirm Update
    Calendar-->>DraggableEventCard: Update Position
    DraggableEventCard-->>User: Visual Feedback
```

## Responsive Layout Flow

```mermaid
graph TD
    A[ResponsiveCalendar] -->|Desktop| B[DesktopKanbanCalendar]
    A -->|Mobile| C[MobileKanbanCalendar]
    
    B --> D[Multi-column Layout]
    B --> E[Desktop Drag & Drop]
    
    C --> F[Single-column Layout]
    C --> G[Mobile Touch Gestures]
    
    subgraph Breakpoints
        H[Desktop: >=1024px]
        I[Mobile: <1024px]
    end
    
    A --> H
    A --> I
```

## Error Handling Flow

```mermaid
graph TD
    A[Error Occurs] --> B{Error Type}
    B -->|API Error| C[API Error Handler]
    B -->|Component Error| D[Error Boundary]
    B -->|State Error| E[State Error Handler]
    
    C --> F[User Feedback]
    D --> F
    E --> F
    
    F --> G[Recovery Action]
    G --> H[Retry/Reset]
```

## Performance Optimization Flow

```mermaid
graph LR
    A[Component Render] --> B{Needs Update?}
    B -->|Yes| C[Update Component]
    B -->|No| D[Skip Render]
    
    subgraph Optimization Techniques
        E[React.memo]
        F[useMemo]
        G[useCallback]
        H[Virtual Scrolling]
    end
    
    A --> E
    A --> F
    A --> G
    A --> H
```

## Authentication Flow (Future Implementation)

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant Auth Server
    participant API
    
    User->>Client: Login Request
    Client->>Auth Server: Authenticate
    Auth Server-->>Client: JWT Token
    Client->>API: Request with Token
    API-->>Client: Protected Data
```

## Event Synchronization Flow

```mermaid
graph TD
    A[Event Update] --> B{Update Type}
    B -->|Local| C[Client State]
    B -->|Server| D[API Call]
    
    C --> E[Optimistic Update]
    D --> F[Server State]
    
    E --> G[UI Update]
    F --> G
    
    subgraph Conflict Resolution
        H[Version Control]
        I[Last Write Wins]
        J[Manual Resolution]
    end
```

These diagrams provide a comprehensive view of the application's architecture, data flow, and component interactions. They can be used for:
1. Understanding the system architecture
2. Debugging issues
3. Planning new features
4. Onboarding new developers
5. Documentation purposes

Each diagram focuses on a specific aspect of the application, making it easier to understand different parts of the system in isolation. 