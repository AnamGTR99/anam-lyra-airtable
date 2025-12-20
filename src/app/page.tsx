import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const greeting = "from Lyra";
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Lyra</span> Airtable Clone
          </h1>

          <div className="text-center max-w-2xl">
            <p className="text-xl text-white/80 mb-4">
              High-performance database application built with the T3 Stack
            </p>
            <p className="text-sm text-white/60">
              Hybrid JSONB architecture • 1M+ row performance • 60fps virtualization
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4">
              <h3 className="text-2xl font-bold">✅ Phase 1 Complete</h3>
              <div className="text-lg">
                Foundation infrastructure with Hybrid JSONB schema, GIN indexes, and performance optimizations.
              </div>
            </div>
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4">
              <h3 className="text-2xl font-bold">🚀 Next: Phase 2</h3>
              <div className="text-lg">
                Implement tRPC routers for Base, Table, Column, Row operations and build the UI.
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {greeting}
            </p>

            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>

          {session?.user && <LatestPost />}
        </div>
      </main>
    </HydrateClient>
  );
}
