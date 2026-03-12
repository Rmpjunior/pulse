"use client";

import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogOut, Menu, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getInitials } from "@/lib/utils";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onMenuClick?: () => void;
}

export function DashboardHeader({ user, onMenuClick }: DashboardHeaderProps) {
  const tCommon = useTranslations("common");

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-3 border-b border-border/60 bg-background/90 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors lg:hidden cursor-pointer"
        aria-label="Abrir menu"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-x-3">
        <ThemeToggle />

        <div className="h-5 w-px bg-border" />

        {/* User info + avatar */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex flex-col items-end leading-none">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground mt-0.5">{user.email}</span>
          </div>

          <Link
            href="/dashboard/settings"
            aria-label="Configurações da conta"
            className="transition-opacity hover:opacity-80"
          >
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="h-8 w-8 rounded-full ring-2 ring-border object-cover"
                src={user.image}
                alt={user.name || "User"}
                width={32}
                height={32}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-border">
                <span className="text-xs font-semibold text-primary">
                  {user.name ? getInitials(user.name) : <User className="h-3.5 w-3.5" />}
                </span>
              </div>
            )}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label={tCommon("logout")}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
