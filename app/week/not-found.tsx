import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-background p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Page Not Found
        </h2>
        <p className="mb-6 text-gray-700">
          The calendar page you&apos;re looking for doesn&apos;t exist or has
          been moved.
        </p>
        <div className="flex justify-end">
          <Button asChild className="bg-gradient-header hover:opacity-90">
            <Link href="/calendar">Go to Calendar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
