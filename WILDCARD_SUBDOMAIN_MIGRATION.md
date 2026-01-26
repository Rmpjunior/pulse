# Wildcard Subdomain Migration Guide

This document outlines how to migrate from path-based URLs (`pulse.app/p/username`) to subdomain-based URLs (`username.pulse.app`) when upgrading to Vercel Pro.

---

## Current Setup (Free Tier)

```
URL format: pulse.vercel.app/p/username
Route: /[locale]/p/[username]/page.tsx
```

---

## Migration Options

| Option                 | Cost   | Pros                      | Cons               |
| ---------------------- | ------ | ------------------------- | ------------------ |
| **Vercel Pro**         | $20/mo | Zero config, built-in SSL | Higher cost        |
| **VPS + Nginx**        | ~$5/mo | Low cost, full control    | Server maintenance |
| **Cloudflare Workers** | ~$5/mo | Edge speed, no server     | Learning curve     |

Choose the option that best fits your budget and technical comfort.

---

## Option A: Vercel Pro (Recommended for simplicity)

### Prerequisites

1. **Vercel Pro Plan** ($20/month) - Required for wildcard subdomains
2. **Custom Domain** - e.g., `pulse.app` or `mypulse.com`
3. **Domain Registrar Access** - To configure DNS records

---

## Step 1: Add Wildcard Domain in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain: `pulse.app`
3. Add wildcard: `*.pulse.app`
4. Vercel will provide DNS instructions

---

## Step 2: Configure DNS

At your domain registrar (Cloudflare, GoDaddy, Namecheap, etc.), add:

| Type  | Name | Value                | TTL  |
| ----- | ---- | -------------------- | ---- |
| A     | @    | 76.76.21.21          | Auto |
| CNAME | \*   | cname.vercel-dns.com | Auto |

---

## Step 3: Create Subdomain Middleware

Create/update `src/middleware.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

// Domain configuration
const ROOT_DOMAIN = process.env.ROOT_DOMAIN || "pulse.app";

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Skip API routes and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Extract subdomain
  const subdomain = hostname
    .replace(`.${ROOT_DOMAIN}`, "")
    .replace(`:${process.env.PORT || 3000}`, "");

  // Check if it's a user subdomain (not www, not root domain)
  const isUserSubdomain =
    subdomain !== "www" &&
    subdomain !== ROOT_DOMAIN.split(".")[0] &&
    subdomain !== hostname &&
    !subdomain.includes("localhost");

  if (isUserSubdomain) {
    // Rewrite username.pulse.app → pulse.app/p/username
    const url = request.nextUrl.clone();

    // Handle root of subdomain
    if (pathname === "/" || pathname === "") {
      url.pathname = `/p/${subdomain}`;
    } else {
      url.pathname = `/p/${subdomain}${pathname}`;
    }

    return NextResponse.rewrite(url);
  }

  // Run next-intl middleware for main domain
  const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: "as-needed",
  });

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
```

---

## Step 4: Add Environment Variable

Add to `.env` and Vercel:

```env
ROOT_DOMAIN=pulse.app
```

For local dev:

```env
ROOT_DOMAIN=localhost:3000
```

---

## Step 5: Update Local Hosts (for local testing)

Add to `/etc/hosts`:

```
127.0.0.1 testuser.localhost
```

---

## Step 6: Update Public Page Links

Update any links that point to user pages:

```tsx
// Before
<a href={`/p/${username}`}>View Page</a>

// After (for Plus users with subdomain)
<a href={`https://${username}.pulse.app`}>View Page</a>
```

---

## Optional: Custom Domains for Plus Users

Allow Plus users to connect their own domain:

### Backend API to add domain via Vercel API:

```typescript
// src/app/api/domains/route.ts
export async function POST(request: Request) {
  const { username, domain } = await request.json();

  // Validate user is Plus
  // ...

  const response = await fetch(
    `https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: domain }),
    },
  );

  return Response.json(await response.json());
}
```

### Database: Add domain field to Page model:

```prisma
model Page {
  // ... existing fields
  customDomain String? @unique
}
```

---

## Migration Checklist

- [ ] Upgrade to Vercel Pro
- [ ] Purchase/configure custom domain
- [ ] Add wildcard DNS records
- [ ] Add ROOT_DOMAIN environment variable
- [ ] Deploy updated middleware
- [ ] Test subdomain routing
- [ ] Update marketing/landing page links
- [ ] (Optional) Implement custom domain feature for Plus users

---

## Rollback Plan

If issues occur, revert to path-based URLs:

1. Remove subdomain logic from middleware
2. Keep `/p/[username]` route
3. Update any changed links

---

## Resources

- [Vercel Wildcard Domains](https://vercel.com/docs/projects/domains#wildcard-domains)
- [Vercel Domains API](https://vercel.com/docs/rest-api/endpoints#domains)
- [next-intl Middleware](https://next-intl-docs.vercel.app/docs/routing/middleware)

---

## Option B: VPS + Nginx Reverse Proxy (Budget-friendly)

This approach uses a cheap VPS (~$5/mo) running nginx to handle wildcard subdomains and proxy requests to Vercel.

### Architecture

```
User visits: maria.pulse.app
       ↓
   DNS (*.pulse.app → VPS IP)
       ↓
   VPS (Nginx reverse proxy)
       ↓
   Vercel (pulse.app/p/maria)
```

### Step 1: Set Up VPS

1. Get a VPS from DigitalOcean, Vultr, or Hetzner (~$5/mo)
2. Install nginx: `sudo apt install nginx`
3. Install Certbot: `sudo apt install certbot python3-certbot-nginx`

### Step 2: Configure DNS

At your domain registrar:

| Type  | Name | Value       |
| ----- | ---- | ----------- |
| A     | @    | YOUR_VPS_IP |
| A     | \*   | YOUR_VPS_IP |
| CNAME | www  | @           |

### Step 3: Get Wildcard SSL Certificate

```bash
sudo certbot certonly --manual --preferred-challenges=dns \
  -d "pulse.app" -d "*.pulse.app"
```

Follow the prompts to add a TXT record for verification.

### Step 4: Nginx Configuration

Create `/etc/nginx/sites-available/pulse`:

```nginx
# Wildcard subdomain → proxy to Vercel /p/username
server {
    listen 80;
    listen 443 ssl;

    server_name ~^(?<subdomain>.+)\.pulse\.app$;

    ssl_certificate /etc/letsencrypt/live/pulse.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pulse.app/privkey.pem;

    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }

    location / {
        # Proxy to Vercel with path rewrite
        proxy_pass https://pulse.vercel.app/p/$subdomain$request_uri;
        proxy_set_header Host pulse.vercel.app;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
    }
}

# Main domain → proxy to Vercel
server {
    listen 80;
    listen 443 ssl;
    server_name pulse.app www.pulse.app;

    ssl_certificate /etc/letsencrypt/live/pulse.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pulse.app/privkey.pem;

    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }

    location / {
        proxy_pass https://pulse.vercel.app;
        proxy_set_header Host pulse.vercel.app;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
    }
}
```

### Step 5: Enable and Test

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/pulse /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Set up auto-renewal for SSL
sudo crontab -e
# Add: 0 0 1 * * certbot renew --quiet
```

### Considerations

- **Latency**: Adds ~50-100ms from proxy hop
- **Availability**: VPS becomes a single point of failure (add monitoring)
- **SSL Renewal**: Wildcard certs need DNS challenge (can automate with Cloudflare API)
- **Maintenance**: You're responsible for server updates and security

### Alternative: Use Cloudflare as DNS Proxy

If you use Cloudflare for DNS (free tier):

1. Point \*.pulse.app to your VPS
2. Enable Cloudflare proxy (orange cloud)
3. Cloudflare handles SSL automatically
4. Your VPS only needs port 80 open
