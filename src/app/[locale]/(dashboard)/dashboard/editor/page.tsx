import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EditorContent } from "./editor-content";
import { getPlanCapabilities } from "@/lib/subscription/gating";

export default async function EditorPage() {
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

  // Get or create user's page
  const page = await db.page.findFirst({
    where: { userId: session.user.id },
    include: {
      blocks: {
        orderBy: { order: "asc" },
      },
    },
  });

  // If no page exists, we'll handle creation in the client
  return (
    <EditorContent
      page={page}
      isPlusUser={capabilities.premiumThemes || capabilities.customColors}
    />
  );
}
