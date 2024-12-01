'use client';

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="flex flex-col items-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold">Something went wrong!</h2>
          <p className="text-sm text-gray-500 max-w-md">
            {error.message || "There was an error loading the evaluation results. Please try again."}
          </p>
          {error.digest && (
            <p className="text-xs text-gray-400">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <Button
          onClick={() => reset()}
          variant="outline"
          className="mt-4"
        >
          Try again
        </Button>
      </div>
    </div>
  );
} 