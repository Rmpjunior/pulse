import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicPageContent } from "./page-content";

interface PublicPageProps {
  params: Promise<{ locale: string; username: string }>;
}

export async function generateMetadata({ params }: PublicPageProps) {
  const { username } = await params;

  const page = await db.page.findUnique({
    where: { username, published: true },
  });

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.displayName || `@${page.username}`,
    description: page.bio || `Check out ${page.displayName || username}'s page`,
    openGraph: {
      title: page.displayName || `@${page.username}`,
      description:
        page.bio || `Check out ${page.displayName || username}'s page`,
      type: "profile",
    },
  };
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { username } = await params;

  const page = await db.page.findUnique({
    where: { username },
    include: {
      blocks: {
        where: { visible: true },
        orderBy: { order: "asc" },
      },
      user: {
        select: {
          subscription: {
            select: { plan: true },
          },
        },
      },
    },
  });

  if (!page || !page.published) {
    notFound();
  }

  // Track page view (fire and forget)
  trackPageView(page.id);

  const isPlusPlan = page.user.subscription?.plan !== "FREE";

  return <PublicPageContent page={page} showWatermark={!isPlusPlan} />;
}

async function trackPageView(pageId: string) {
  try {
    const visitorId = Math.random().toString(36).substring(2, 15);

    await db.pageView.create({
      data: {
        pageId,
        visitorId,
      },
    });
  } catch (error) {
    console.error("Error tracking page view:", error);
  }
}
