import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EditorContent } from "./editor-content";

export default async function EditorPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

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
  return <EditorContent page={page} />;
}
