import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EditorContent } from "./editor-content";
import { getPlanCapabilities } from "@/lib/subscription/gating";

export default async function EditorPage({
  searchParams,
}: {
  searchParams?: Promise<{ pageId?: string; create?: string }>;
}) {
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

  const resolvedSearchParams = (await searchParams) || {};
  const selectedPageId = resolvedSearchParams.pageId;
  const createNew = resolvedSearchParams.create === "1";

  // Get selected page (or first page) for this user unless explicit create flow
  const page = createNew
    ? null
    : await db.page.findFirst({
    where: {
      userId: session.user.id,
      ...(selectedPageId ? { id: selectedPageId } : {}),
    },
    include: {
      blocks: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // If no page exists, we'll handle creation in the client
  return (
    <EditorContent
      page={page}
      isPlusUser={capabilities.premiumThemes || capabilities.customColors}
      maxSections={capabilities.maxSections}
    />
  );
}
