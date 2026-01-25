# Multi-Language Support (Future Implementation)

This document outlines how to add multi-language support to Pulse in the future.

---

## Current State

Pulse currently supports **Portuguese (pt-BR) only**.

The i18n infrastructure from `next-intl` is already in place, making it easy to add more languages later.

---

## Adding a New Language

### Step 1: Update i18n Config

Edit `src/i18n/config.ts`:

```typescript
// Add new locales
export const locales = ["pt-BR", "en", "es"] as const;
export const defaultLocale = "pt-BR" as const;
```

---

### Step 2: Create Translation File

Create `src/i18n/messages/en.json` (or other language):

```json
{
  "common": {
    "appName": "Pulse",
    "loading": "Loading..."
    // ... copy structure from pt-BR.json and translate
  }
}
```

---

### Step 3: Create Language Selector Component

Create `src/components/ui/language-toggle.tsx`:

```tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

const LOCALE_NAMES: Record<string, string> = {
  "pt-BR": "PT",
  en: "EN",
  es: "ES",
};

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();

  const handleLanguageChange = (targetLocale: string) => {
    // Remove current locale prefix
    let cleanPath = pathname;
    for (const loc of Object.keys(LOCALE_NAMES)) {
      if (pathname.startsWith(`/${loc}`)) {
        cleanPath = pathname.slice(loc.length + 1) || "/";
        break;
      }
    }

    window.location.href = `/${targetLocale}${cleanPath}`;
  };

  return (
    <div className="flex gap-1">
      {Object.entries(LOCALE_NAMES).map(([code, name]) => (
        <Button
          key={code}
          variant={locale === code ? "default" : "ghost"}
          size="sm"
          onClick={() => handleLanguageChange(code)}
        >
          {name}
        </Button>
      ))}
    </div>
  );
}
```

---

### Step 4: Add to Headers

Add `<LanguageToggle />` to:

- `src/app/[locale]/page.tsx` (landing)
- `src/components/dashboard/header.tsx`

---

### Step 5: Update Navigation Config

Edit `src/i18n/navigation.ts`:

```typescript
import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "./config";

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
  localePrefix: "always", // Show locale in URL for all languages
});
```

---

## Translation Keys Reference

All translation keys are in `src/i18n/messages/pt-BR.json`.

Main sections:

- `common` - Shared UI text
- `landing` - Landing page
- `auth` - Login/register/forgot password
- `dashboard` - Dashboard pages
- `editor` - Page editor
- `blocks` - Block types
- `settings` - Settings page
- `publicPage` - Public bio pages
- `errors` - Error messages

---

## Testing Translations

1. Start dev server: `npm run dev`
2. Access different locales:
   - `http://localhost:3000/pt-BR/dashboard`
   - `http://localhost:3000/en/dashboard`
3. Verify all text is translated

---

## Considerations

- **SEO**: Each language gets its own URL path
- **Default Language**: pt-BR is the default/fallback
- **Missing Translations**: Falls back to Portuguese if key is missing
- **RTL Languages**: Would require additional CSS configuration
