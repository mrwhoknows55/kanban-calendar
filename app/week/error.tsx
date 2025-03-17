"use client";

import { useEffect } from "react";
import { Button } from "@/app/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-background p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-red-600">
          Something went wrong!
        </h2>
        <p className="mb-6 text-gray-700">
          We encountered an error while loading your calendar. Please try again.
        </p>
        <div className="flex justify-end space-x-4">
          <Button
            onClick={() => reset()}
            className="bg-gradient-header hover:opacity-90"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
