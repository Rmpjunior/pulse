import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { resolveVisitorIdFromHeaders } from "@/lib/analytics/visitor";
import { getPlanCapabilities } from "@/lib/subscription/gating";
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
  const requestHeaders = await headers();
  trackPageView(page.id, requestHeaders);

  const capabilities = getPlanCapabilities(page.user.subscription?.plan);

  return (
    <PublicPageContent
      page={page}
      showWatermark={!capabilities.watermarkRemoval}
    />
  );
}

async function trackPageView(pageId: string, requestHeaders: Headers) {
  try {
    const visitorId = resolveVisitorIdFromHeaders(requestHeaders);

    await db.pageView.create({
      data: {
        pageId,
        visitorId,
        referrer: requestHeaders.get("referer") || undefined,
        userAgent: requestHeaders.get("user-agent") || undefined,
      },
    });
  } catch (error) {
    console.error("Error tracking page view:", error);
  }
}
