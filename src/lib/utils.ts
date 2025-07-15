import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatAppointmentTime(timeString: string | null): string {
  if (!timeString) return 'Not specified';
  
  try {
    // Handle different time formats
    const time = new Date(timeString);
    
    // Check if it's a valid date
    if (isNaN(time.getTime())) {
      // If not a valid date, try to parse as time string
      return timeString;
    }
    
    return time.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return timeString;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Need Callback':
      return 'bg-yellow-100 text-yellow-800';
    case 'Confirmed':
      return 'bg-green-100 text-green-800';
    case 'Needs Attention':
      return 'bg-red-100 text-red-800';
    case 'Contacted':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
} 