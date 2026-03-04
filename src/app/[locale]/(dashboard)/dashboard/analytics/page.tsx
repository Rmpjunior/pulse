import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AnalyticsContent } from "./analytics-content";
import { getPlanCapabilities } from "@/lib/subscription/gating";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      subscription: {
        select: { plan: true },
      },
    },
  });

  const capabilities = getPlanCapabilities(user?.subscription?.plan);

  // Check if user has a page
  const page = await db.page.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  return (
    <AnalyticsContent hasPage={!!page} analyticsDaysLimit={capabilities.analyticsDays} />
  );
}
