import Link from "next/link";
import { buttonVariants } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";

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
          <Link
            href="/calendar"
            className={cn(
              buttonVariants(),
              "bg-gradient-header hover:opacity-90"
            )}
          >
            Go to Calendar
          </Link>
        </div>
      </div>
    </div>
  );
}
