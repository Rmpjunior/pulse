import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsContent } from "./settings-content";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get user with subscription
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <SettingsContent
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      }}
      subscription={
        user.subscription
          ? {
              plan: user.subscription.plan,
              expiresAt: user.subscription.currentPeriodEnd,
            }
          : null
      }
    />
  );
}
