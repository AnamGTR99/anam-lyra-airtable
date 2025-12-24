"use client";

import { signIn, signOut } from "next-auth/react";

export function SignInButton() {
  return (
    <button
      type="button"
      className="rounded bg-black px-4 py-2 text-sm font-semibold text-white"
      onClick={() => signIn("google")}
    >
      Sign in with Google
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      type="button"
      className="rounded border border-black px-4 py-2 text-sm font-semibold text-black"
      onClick={() => signOut()}
    >
      Sign out
    </button>
  );
}
