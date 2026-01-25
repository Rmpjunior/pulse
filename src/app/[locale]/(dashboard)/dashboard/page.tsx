import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  MousePointerClick,
  Plus,
  ExternalLink,
  Palette,
  BarChart3,
  Share2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const session = await auth();

  // Get user's page if it exists
  const page = await db.page.findFirst({
    where: { userId: session?.user?.id },
    include: {
      _count: {
        select: {
          blocks: true,
          pageViews: true,
        },
      },
    },
  });

  // Get click count
  const clickCount = page
    ? await db.blockClick.count({
        where: {
          block: {
            pageId: page.id,
          },
        },
      })
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("welcome", { name: session?.user?.name || "User" })}
        </h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {page ? (
        <>
          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("stats.views")}
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {page._count.pageViews}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("stats.viewsDescription")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("stats.clicks")}
                </CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clickCount}</div>
                <p className="text-xs text-muted-foreground">
                  {t("stats.clicksDescription")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("stats.ctr")}
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {page._count.pageViews > 0
                    ? ((clickCount / page._count.pageViews) * 100).toFixed(1)
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("stats.ctrDescription")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Page preview card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("yourPage")}</CardTitle>
                  <CardDescription>
                    pulse.vercel.app/{page.username}
                    {page.published ? (
                      <span className="ml-2 inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                        {t("published")}
                      </span>
                    ) : (
                      <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {t("unpublished")}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Link href={`/p/${page.username}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t("viewPage")}
                    </Button>
                  </Link>
                  <Link href="/dashboard/editor">
                    <Button variant="gradient" size="sm">
                      {t("editPage")}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Quick actions */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {t("quickActions.title")}
            </h2>
            <div className="grid gap-4 md:grid-cols-4">
              <Link href="/dashboard/editor">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm font-medium">
                      {t("quickActions.addBlock")}
                    </span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/editor?tab=theme">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                      <Palette className="h-6 w-6 text-secondary" />
                    </div>
                    <span className="text-sm font-medium">
                      {t("quickActions.editTheme")}
                    </span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/analytics">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-3">
                      <BarChart3 className="h-6 w-6 text-orange-500" />
                    </div>
                    <span className="text-sm font-medium">
                      {t("quickActions.viewAnalytics")}
                    </span>
                  </CardContent>
                </Card>
              </Link>

              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                    <Share2 className="h-6 w-6 text-purple-500" />
                  </div>
                  <span className="text-sm font-medium">
                    {t("quickActions.share")}
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        /* No page yet - Create page CTA */
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-6">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {t("firstPage.title")}
            </h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {t("firstPage.description")}
            </p>
            <Link href="/dashboard/editor">
              <Button variant="gradient" size="lg">
                {t("createPage")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
