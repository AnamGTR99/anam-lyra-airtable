import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "~/app/_components/Sidebar";

export default async function Home() {
  const session = await auth();

  // If logged in, try to find last base
  if (session?.user) {
    const lastBase = await db.base.findFirst({
      where: { createdById: session.user.id },
      orderBy: { updatedAt: 'desc' }
    });

    if (lastBase) {
      redirect(`/base/${lastBase.id}`);
    }
  }

  // Fallback: Show Shell with Prompt
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111111] mb-2">Welcome to Airtable</h1>
          <p className="text-[#666666]">Select a workspace or create a new base to get started.</p>
          {!session && (
            <div className="mt-6">
              <a href="/api/auth/signin" className="px-4 py-2 bg-[#116df7] text-white rounded font-medium">
                Sign In
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
