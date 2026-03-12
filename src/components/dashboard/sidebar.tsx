"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileEdit,
  BarChart3,
  Settings,
  CreditCard,
  X,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

const navigation = [
  { name: "dashboard.title", href: "/dashboard", icon: LayoutDashboard },
  { name: "editor.title", href: "/dashboard/editor", icon: FileEdit },
  { name: "dashboard.stats.title", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "settings.subscription.title", href: "/dashboard/subscription", icon: CreditCard },
  { name: "settings.title", href: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const tCommon = useTranslations("common");

  const cleanPath = pathname.replace(/^\/(pt-BR|en)/, "");

  const sidebarContent = (
    <div className="flex h-full min-h-[100dvh] flex-col overflow-y-auto border-r border-border bg-card/50 backdrop-blur-sm px-4 pb-4">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between px-2">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandLogo size={30} className="shadow-sm" />
          <span className="font-bold text-lg tracking-tight">
            {tCommon("appName")}
          </span>
        </Link>
        {onClose && (
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col mt-2">
        <ul className="flex flex-1 flex-col gap-y-0.5">
          {navigation.map((item) => {
            const isActive =
              cleanPath === item.href ||
              (item.href !== "/dashboard" && cleanPath.startsWith(item.href));

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  <span>{t(item.name)}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Upgrade banner */}
        <div className="mt-4 mb-2">
          <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-orange-500/8 to-purple-500/8 p-4">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl -translate-y-6 translate-x-6 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <p className="text-xs font-semibold text-foreground">
                  {t("dashboard.upgrade.title")}
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {t("dashboard.upgrade.description")}
              </p>
              <Link href="/dashboard/subscription" onClick={onClose}>
                <button className="w-full rounded-lg gradient-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer">
                  {t("dashboard.upgrade.button")}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 h-[100dvh] w-64 animate-slide-in-left">
            {sidebarContent}
          </div>
        </div>
      )}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        {sidebarContent}
      </div>
    </>
  );
}
