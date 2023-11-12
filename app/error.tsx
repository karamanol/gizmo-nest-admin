"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="mt-8">🤔 Something went wrong!</h2>
      <button
        className="border border-teal-700/40 px-3 py-1 rounded-md hover:bg-[#B2BECC] transition-colors mt-4"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }>
        Try again
      </button>
    </div>
  );
}
