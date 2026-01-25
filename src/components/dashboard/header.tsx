"use client";

import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogOut, Menu, User } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const tCommon = useTranslations("common");

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="p-2.5 text-muted-foreground lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-border lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1" />

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <ThemeToggle />

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />

          {/* Profile dropdown */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>

            {user.image ? (
              <img
                className="h-9 w-9 rounded-full ring-2 ring-border"
                src={user.image}
                alt={user.name || "User"}
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-border">
                <span className="text-sm font-medium text-primary">
                  {user.name ? (
                    getInitials(user.name)
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </span>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/" })}
              aria-label={tCommon("logout")}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
