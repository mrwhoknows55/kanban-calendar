"use client";

import React, { useRef, useEffect } from "react";

interface SwipeableViewProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  disabled?: boolean;
}

export function SwipeableView({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  disabled = false,
}: SwipeableViewProps) {
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (disabled) return;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (disabled) return;
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (disabled) return;
      
      const swipeDistance = touchEndX.current - touchStartX.current;
      const absDistance = Math.abs(swipeDistance);

      if (absDistance > threshold) {
        if (swipeDistance > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (swipeDistance < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }

      // Reset values
      touchStartX.current = 0;
      touchEndX.current = 0;
    };

    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchmove", handleTouchMove);
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold, disabled]);

  return (
    <div ref={containerRef} className="touch-pan-y">
      {children}
    </div>
  );
} 