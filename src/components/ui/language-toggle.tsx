"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const newLocale = locale === "pt-BR" ? "en" : "pt-BR";

    // Remove current locale from pathname if present
    let newPath = pathname;
    if (pathname.startsWith("/pt-BR")) {
      newPath = pathname.replace("/pt-BR", "");
    } else if (pathname.startsWith("/en")) {
      newPath = pathname.replace("/en", "");
    }

    // Add new locale prefix
    if (newLocale !== "pt-BR") {
      newPath = `/${newLocale}${newPath || "/"}`;
    } else {
      newPath = newPath || "/";
    }

    router.push(newPath);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
      aria-label="Toggle language"
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">
        {locale === "pt-BR" ? "EN" : "PT"}
      </span>
    </Button>
  );
}
