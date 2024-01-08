"use client";

function ErrorReviewsPage({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="mt-8 text-xl mb-3 text-center font-semibold">
        🤔 Something went wrong!
      </h2>
      <p className="text-center">Make sure you are signed in as admin</p>
      <button
        className="border border-teal-700/40 px-3 py-1 rounded-md hover:bg-[#b2becc95] transition-colors mt-4"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }>
        Try again
      </button>
    </div>
  );
}

export default ErrorReviewsPage;
