"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const targetLocale = locale === "pt-BR" ? "en" : "pt-BR";

  // Get path without locale prefix for the Link
  let pathWithoutLocale = pathname;
  if (pathname.startsWith("/pt-BR")) {
    pathWithoutLocale = pathname.slice(6) || "/";
  } else if (pathname.startsWith("/en")) {
    pathWithoutLocale = pathname.slice(3) || "/";
  }

  return (
    <Link href={pathWithoutLocale} locale={targetLocale}>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        aria-label="Toggle language"
      >
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline">
          {locale === "pt-BR" ? "EN" : "PT"}
        </span>
      </Button>
    </Link>
  );
}
