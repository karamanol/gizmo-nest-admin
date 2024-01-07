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
      <h2 className="mt-8 text-xl mb-3 text-center font-semibold">
        🤔 Something went wrong!
      </h2>
      <p className="text-center">{error.message}</p>
      {/* <p className="text-center">{error.stack}</p> */}
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
