"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  Calendar,
  BarChart3,
  Loader2,
} from "lucide-react";

interface AnalyticsData {
  views: number;
  clicks: number;
  viewsData: { date: string; count: number }[];
  clicksData: { date: string; count: number }[];
  topBlocks: { id: string; type: string; label: string; clicks: number }[];
}

interface AnalyticsContentProps {
  hasPage: boolean;
}

export function AnalyticsContent({ hasPage }: AnalyticsContentProps) {
  const t = useTranslations("dashboard");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    if (!hasPage) {
      setLoading(false);
      return;
    }

    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?days=${days}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [days, hasPage]);

  if (!hasPage) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Nenhuma página criada</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Crie sua página primeiro para começar a ver as análises de
          visualizações e cliques.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Erro ao carregar análises
      </div>
    );
  }

  const ctr =
    data.views > 0 ? ((data.clicks / data.views) * 100).toFixed(1) : "0";
  const maxViewCount = Math.max(...data.viewsData.map((d) => d.count), 1);
  const maxClickCount = Math.max(...data.clicksData.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Análises</h1>
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                days === d
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {d} dias
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.views.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Últimos {days} dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.clicks.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Cliques em links</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Cliques
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ctr}%</div>
            <p className="text-xs text-muted-foreground">CTR médio</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visualizações por dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-1">
              {data.viewsData.slice(-Math.min(days, 30)).map((d, i) => (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                    style={{
                      height: `${(d.count / maxViewCount) * 100}%`,
                      minHeight: d.count > 0 ? "4px" : "0",
                    }}
                    title={`${d.date}: ${d.count} visualizações`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{formatDate(data.viewsData[0]?.date)}</span>
              <span>
                {formatDate(data.viewsData[data.viewsData.length - 1]?.date)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Clicks Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cliques por dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-1">
              {data.clicksData.slice(-Math.min(days, 30)).map((d, i) => (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-secondary/80 rounded-t transition-all hover:bg-secondary"
                    style={{
                      height: `${(d.count / maxClickCount) * 100}%`,
                      minHeight: d.count > 0 ? "4px" : "0",
                    }}
                    title={`${d.date}: ${d.count} cliques`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{formatDate(data.clicksData[0]?.date)}</span>
              <span>
                {formatDate(data.clicksData[data.clicksData.length - 1]?.date)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Blocks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Links mais clicados</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topBlocks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum clique registrado ainda
            </p>
          ) : (
            <div className="space-y-3">
              {data.topBlocks.map((block, index) => (
                <div
                  key={block.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-lg font-bold text-muted-foreground w-6">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{block.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {block.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{block.clicks}</p>
                    <p className="text-xs text-muted-foreground">cliques</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
