import { auth } from "~/server/auth";
import Link from "next/link";

import { SignInButton, SignOutButton } from "~/app/_components/AuthButtons";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-xl rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Lyra Phase 0</h1>
        <p className="mt-2 text-sm text-gray-600">
          Minimal auth scaffold for Google sign-in and a protected route.
        </p>

        {session?.user ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
              <div className="font-medium text-gray-900">Signed in</div>
              <div>{session.user.name ?? "Unnamed user"}</div>
              <div>{session.user.email ?? "No email available"}</div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/protected"
                className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Go to protected page
              </Link>
              <SignOutButton />
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-600">
              You are signed out. Sign in with Google to view the protected page.
            </p>
            <SignInButton />
          </div>
        )}
      </div>
    </main>
  );
}
