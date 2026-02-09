'use client';

import { useEffect } from 'react';

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
    <div className="container mx-auto py-8 px-4">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Something went wrong loading the match details.</span>
        <button
          onClick={() => reset()}
          className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-1 px-3 border border-red-300 rounded shadow"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
