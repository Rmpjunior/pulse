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
  Sparkles,
  CreditCard,
  X,
} from "lucide-react";

const navigation = [
  { name: "dashboard.title", href: "/dashboard", icon: LayoutDashboard },
  { name: "editor.title", href: "/dashboard/editor", icon: FileEdit },
  {
    name: "dashboard.stats.title",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "settings.subscription.title",
    href: "/dashboard/subscription",
    icon: CreditCard,
  },
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

  // Clean pathname for comparison
  const cleanPath = pathname.replace(/^\/(pt-BR|en)/, "");

  const sidebarContent = (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl gradient-primary-text">
            {tCommon("appName")}
          </span>
        </Link>
        {onClose && (
          <button
            type="button"
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive =
                  cleanPath === item.href ||
                  cleanPath.startsWith(item.href + "/");
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-colors",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      {t(item.name)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          <li className="mt-auto">
            <div className="rounded-xl bg-gradient-to-r from-orange-500/10 to-purple-500/10 p-4 border border-primary/20">
              <h3 className="text-sm font-semibold gradient-primary-text">
                {t("dashboard.upgrade.title")}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("dashboard.upgrade.description")}
              </p>
              <Link href="/dashboard/subscription" onClick={onClose}>
                <button className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
                  {t("dashboard.upgrade.button")}
                </button>
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 animate-slide-in-left">
            {sidebarContent}
          </div>
        </div>
      )}

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {sidebarContent}
      </div>
    </>
  );
}
