import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import { SignOutButton } from "~/app/_components/AuthButtons";

export default async function ProtectedPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-2xl space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <div>
          <h1 className="text-2xl font-semibold">Protected Page</h1>
          <p className="mt-2 text-sm text-slate-300">
            You are signed in. This route requires an active session.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">
          <div className="font-medium text-slate-100">Session snapshot</div>
          <pre className="mt-3 whitespace-pre-wrap text-xs text-slate-300">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="rounded border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100"
          >
            Back home
          </a>
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
