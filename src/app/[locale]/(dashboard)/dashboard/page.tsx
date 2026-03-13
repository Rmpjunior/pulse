import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  MousePointerClick,
  Plus,
  ExternalLink,
  Palette,
  BarChart3,
  Share2,
  Globe,
  ArrowUpRight,
  TrendingUp,
  Pencil,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const session = await auth();

  const pages = await db.page.findMany({
    where: { userId: session?.user?.id },
    include: {
      _count: {
        select: { blocks: true, pageViews: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const pageIds = pages.map((p: (typeof pages)[number]) => p.id);

  const clickCount = pageIds.length
    ? await db.blockClick.count({
        where: { block: { pageId: { in: pageIds } } },
      })
    : 0;

  const totalViews = pages.reduce(
    (sum: number, p: (typeof pages)[number]) => sum + p._count.pageViews,
    0,
  );
  const primaryPage = pages[0] || null;
  const ctr = totalViews > 0 ? ((clickCount / totalViews) * 100).toFixed(1) : "0.0";

  const stats = [
    {
      label: t("stats.views"),
      value: totalViews.toLocaleString("pt-BR"),
      description: t("stats.viewsDescription"),
      icon: Eye,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: t("stats.clicks"),
      value: clickCount.toLocaleString("pt-BR"),
      description: t("stats.clicksDescription"),
      icon: MousePointerClick,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: t("stats.ctr"),
      value: `${ctr}%`,
      description: t("stats.ctrDescription"),
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Welcome header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {t("welcome", { name: session?.user?.name?.split(" ")[0] || "User" })}
        </h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      {pages.length > 0 ? (
        <>
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map(({ label, value, description, icon: Icon, color, bg }) => (
              <Card key={label} className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {label}
                    </span>
                    <div className={`h-8 w-8 rounded-lg ${bg} flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-3xl font-bold tracking-tight">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Primary page card */}
          <Card className="overflow-hidden border-border/60">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <h2 className="font-semibold text-base">{t("yourPage")}</h2>
                  {primaryPage?.published ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500 ring-1 ring-emerald-500/20">
                      {t("published")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {t("unpublished")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-mono break-all">
                  {process.env.NEXT_PUBLIC_APP_URL}/p/{primaryPage?.username}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={`/p/${primaryPage?.username}`} target="_blank">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t("viewPage")}
                  </Button>
                </Link>
                <Link href={`/dashboard/editor?pageId=${primaryPage?.id}`}>
                  <Button variant="gradient" size="sm" className="gap-1.5">
                    <Pencil className="h-3.5 w-3.5" />
                    {t("editPage")}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Sites list */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Seus sites</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Gerencie múltiplos sites
                  </p>
                </div>
                <Link href="/dashboard/editor?create=1">
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    Novo site
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border/60">
                {pages.map((site: (typeof pages)[number]) => (
                  <div
                    key={site.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-white">
                          {(site.displayName || site.username)[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {site.displayName || site.username}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          @{site.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link href={`/dashboard/editor?pageId=${site.id}`}>
                        <Button size="sm" variant="outline" className="h-8 text-xs px-3">
                          Editar
                        </Button>
                      </Link>
                      <Link href={`/p/${site.username}`} target="_blank">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
              {t("quickActions.title")}
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              {[
                {
                  href: `/dashboard/editor${primaryPage ? `?pageId=${primaryPage.id}` : ""}`,
                  icon: Plus,
                  label: t("quickActions.addBlock"),
                  iconColor: "text-primary",
                  iconBg: "bg-primary/10",
                },
                {
                  href: `/dashboard/editor?tab=theme${primaryPage ? `&pageId=${primaryPage.id}` : ""}`,
                  icon: Palette,
                  label: t("quickActions.editTheme"),
                  iconColor: "text-purple-500",
                  iconBg: "bg-purple-500/10",
                },
                {
                  href: "/dashboard/analytics",
                  icon: BarChart3,
                  label: t("quickActions.viewAnalytics"),
                  iconColor: "text-orange-500",
                  iconBg: "bg-orange-500/10",
                },
                {
                  href: primaryPage ? `/p/${primaryPage.username}` : "#",
                  icon: Share2,
                  label: t("quickActions.share"),
                  iconColor: "text-blue-500",
                  iconBg: "bg-blue-500/10",
                },
              ].map(({ href, icon: Icon, label, iconColor, iconBg }) => (
                <Link key={label} href={href} target={href.startsWith("/p/") ? "_blank" : undefined}>
                  <Card className="hover:border-primary/40 transition-all hover:shadow-sm cursor-pointer h-full group">
                    <CardContent className="flex flex-col items-center justify-center p-5 text-center gap-3">
                      <div className={`h-11 w-11 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                      </div>
                      <span className="text-xs font-medium leading-tight">{label}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t("firstPage.title")}</h2>
            <p className="text-muted-foreground text-center max-w-md mb-8 text-sm">
              {t("firstPage.description")}
            </p>
            <Link href="/dashboard/editor">
              <Button variant="gradient" size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("createPage")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
