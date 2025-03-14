import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export function getDaysOfWeek(currentDate: Date): Date[] {
  const day = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = currentDate.getDate() - day; // Adjust to get Sunday
  
  return Array(7).fill(0).map((_, i) => {
    const date = new Date(currentDate);
    date.setDate(diff + i);
    return date;
  });
} 