"use client";

import { useEffect, useRef } from "react";
import { create } from "zustand";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface UseSwipeOptions {
  threshold?: number;
  preventDefault?: boolean;
}

interface DragState {
  isDragging: boolean;
  dragCompleteTimestamp: number | null;
  startDrag: () => void;
  endDrag: () => void;
  canOpenCard: () => boolean;
}

/**
 * Hook to handle swipe gestures
 * @param handlers Object containing handlers for different swipe directions
 * @param options Configuration options
 */
export function useSwipe(
  handlers: SwipeHandlers,
  options: UseSwipeOptions = {},
) {
  const { threshold = 50, preventDefault = true } = options;

  // Store touch start position
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (preventDefault) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;

      // Check if horizontal or vertical swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > threshold) {
          handlers.onSwipeRight?.();
        } else if (deltaX < -threshold) {
          handlers.onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > threshold) {
          handlers.onSwipeDown?.();
        } else if (deltaY < -threshold) {
          handlers.onSwipeUp?.();
        }
      }

      // Reset touch start
      touchStart.current = null;
    };

    // Add event listeners
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    // Clean up
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handlers, threshold, preventDefault]);
}

// Create a global store to track drag state across components
export const useDragStore = create<DragState>((set, get) => ({
  isDragging: false,
  dragCompleteTimestamp: null,

  startDrag: () => {
    set({ isDragging: true });
  },

  endDrag: () => {
    set({
      isDragging: false,
      dragCompleteTimestamp: Date.now(),
    });
  },

  // Only allow card opening if no drag is in progress and
  // at least 500ms have passed since the last drag completed
  canOpenCard: () => {
    const { isDragging, dragCompleteTimestamp } = get();

    if (isDragging) return false;

    if (dragCompleteTimestamp === null) return true;

    const timeSinceDragComplete = Date.now() - dragCompleteTimestamp;
    return timeSinceDragComplete > 500;
  },
}));
