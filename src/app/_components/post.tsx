"use client";

import { api } from "~/trpc/react";

/**
 * Placeholder component for initial deployment
 * Will be replaced with Lyra UI components in Phase 2
 */
export function LatestPost() {
  const hello = api.post.hello.useQuery({ text: "Lyra Airtable Clone" });

  return (
    <div className="w-full max-w-xs">
      <div className="rounded-lg bg-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          🚀 Phase 1 Complete
        </h3>
        <p className="text-white/80 text-sm mb-4">
          {hello.data?.greeting ?? "Loading..."}
        </p>
        <p className="text-white/60 text-xs">
          Foundation is ready. Next: Implement Lyra routers and UI.
        </p>
      </div>
    </div>
  );
}
