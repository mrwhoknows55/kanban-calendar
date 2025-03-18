# Drag and Drop Feature Technical Documentation

## Overview

The drag and drop feature in the Kanban Calendar allows users to interactively move events between different dates and time slots. This feature is primarily implemented in the `DraggableEventCard` component and leverages browser APIs for drag and drop functionality, along with custom gesture utilities for mobile touch interactions.

## Components Involved

1.  **`DraggableEventCard.tsx`**:
    *   This component is the core element that users can drag and drop.
    *   It handles the visual representation of an event and the interactive drag behavior.
    *   It uses the HTML5 Drag and Drop API for desktop and custom touch event handling for mobile.

2.  **`Calendar.tsx` (and `DesktopKanbanCalendar.tsx`, `MobileKanbanCalendar.tsx`)**:
    *   These calendar components act as the drop targets for the `DraggableEventCard`.
    *   They define the areas where events can be dropped and handle the logic for updating event dates upon a successful drop.
    *   They manage visual cues to indicate valid drop zones.

3.  **`gesture-utils.ts`**:
    *   This utility library provides helper functions for handling touch gestures, specifically for drag and drop on mobile devices.
    *   It abstracts away the complexities of touch event handling and provides a consistent interface for gesture recognition.

## Technical Implementation

### Desktop Drag and Drop (HTML5 Drag API)

1.  **Draggable Element (`DraggableEventCard.tsx`)**:
    *   The `DraggableEventCard` component is made draggable by setting the `draggable="true"` attribute on its root element.
    *   The `onDragStart` event handler is used to:
        *   Set the drag data using `event.dataTransfer.setData()`. This data typically includes the event ID or necessary information to identify the event being dragged.
        *   Provide visual feedback to the user that the element is being dragged (e.g., changing opacity or adding a drag preview).

2.  **Drop Target (`Calendar.tsx` and Kanban Calendar Components)**:
    *   Calendar day cells or time slots are designated as drop targets by attaching drag event listeners.
    *   `onDragOver`: This event handler is crucial for allowing drops. It must call `event.preventDefault()` to indicate that drops are allowed on this target.
    *   `onDrop`: This event handler is triggered when a `DraggableEventCard` is dropped onto the target. It performs the following actions:
        *   Retrieve the drag data using `event.dataTransfer.getData()`.
        *   Determine the new date or time slot based on the drop target.
        *   Update the event's date in the application state and backend (if applicable) using functions from `calendar-actions.ts` or similar state management logic.
        *   Provide user feedback on successful or unsuccessful drop.

### Mobile Drag and Drop (Touch Gestures)

Since the HTML5 Drag and Drop API is not well-suited for touch interactions on mobile devices, a custom implementation using touch events is used:

1.  **Gesture Detection (`gesture-utils.ts`)**:
    *   `gesture-utils.ts` likely implements functions to detect drag gestures based on `touchstart`, `touchmove`, and `touchend` events.
    *   It calculates touch distances and movement to determine if a drag gesture is occurring.
    *   It may handle edge cases like accidental taps or scrolls.

2.  **Draggable Element (`DraggableEventCard.tsx`)**:
    *   Touch event listeners (`onTouchStart`, `onTouchMove`, `onTouchEnd`) are attached to the `DraggableEventCard`.
    *   `onTouchStart`:  Records the initial touch position and identifies the event being "picked up".
    *   `onTouchMove`:
        *   Calculates the touch movement and visually moves the `DraggableEventCard` to follow the touch.
        *   May provide visual cues to indicate potential drop targets as the user drags.
    *   `onTouchEnd`:
        *   Determines the drop target based on the final touch position.
        *   Updates the event's date and state similar to the desktop `onDrop` handler.
        *   Resets the visual state of the dragged event card.

### State Management and Wiring

1.  **State Updates**:
    *   When a drag and drop operation is completed (either on desktop or mobile), the application state needs to be updated to reflect the event's new date.
    *   This is likely handled by calling action functions from `calendar-actions.ts` or using state management hooks from `calendar-hooks.ts`.
    *   The state update should trigger a re-render of the calendar to visually reflect the changes.

2.  **Next.js Wiring**:
    *   The drag and drop feature is integrated within the Next.js component structure.
    *   Components like `DraggableEventCard` and `Calendar` are likely client components (`'use client'`) because they require event listeners and direct DOM manipulation for drag and drop interactions.
    *   Data fetching and state management might be coordinated with server components for initial data loading and persistence, but the interactive drag and drop logic resides in client components.

## Challenges and Solutions

1.  **Mobile Touch Support**:
    *   **Challenge**: HTML5 Drag and Drop API is not ideal for touch.
    *   **Solution**: Implement custom touch gesture handling using `gesture-utils.ts` and touch event listeners.

2.  **Performance**:
    *   **Challenge**:  Dragging and updating UI in real-time can be performance-intensive, especially with many events on the calendar.
    *   **Solutions**:
        *   Optimize touch event handlers and drag calculations in `gesture-utils.ts`.
        *   Use requestAnimationFrame for smooth animations during drag.
        *   Minimize re-renders by efficiently updating component state.

3.  **Visual Feedback**:
    *   **Challenge**: Providing clear visual feedback to the user during drag and drop is crucial for usability.
    *   **Solutions**:
        *   Change the appearance of the `DraggableEventCard` when dragging (e.g., opacity, shadow).
        *   Highlight valid drop targets in the calendar as the user drags.
        *   Use a drag preview (for desktop) to visually represent the item being dragged.

4.  **Accessibility**:
    *   **Challenge**: Drag and drop interactions can be challenging for users who rely on keyboard navigation or screen readers.
    *   **Solutions**:
        *   Provide alternative keyboard interactions for moving events (e.g., using arrow keys and a "move" action).
        *   Ensure ARIA attributes are used to make the drag and drop interactions accessible to screen readers (e.g., `aria-grabbed`, `aria-dropeffect`).

5.  **Cross-Browser Compatibility**:
    *   **Challenge**: Ensuring consistent drag and drop behavior across different browsers and devices.
    *   **Solution**: Thoroughly test drag and drop functionality on major browsers and devices. Use polyfills or browser-specific adjustments if necessary.

## Future Improvements

1.  **Drag and Drop between Views**: Extend drag and drop to allow moving events between different calendar views (e.g., from week view to day view).
2.  **Visual Drag Preview Customization**: Allow more customization of the drag preview for desktop drag and drop.
3.  **Enhanced Drop Target Feedback**: Provide more dynamic and informative feedback when hovering over drop targets.
4.  **Accessibility Enhancements**: Further improve accessibility by providing more robust keyboard navigation and screen reader support for drag and drop. 