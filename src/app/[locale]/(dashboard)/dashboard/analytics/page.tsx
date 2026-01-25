import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AnalyticsContent } from "./analytics-content";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user has a page
  const page = await db.page.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  return <AnalyticsContent hasPage={!!page} />;
}
