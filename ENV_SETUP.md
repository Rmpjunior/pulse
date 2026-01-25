# Pulse - Environment Setup Guide

This guide explains how to set up the necessary accounts and environment variables to run Pulse locally.

## Quick Start (Minimal Setup)

For basic testing without external services, copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your values as described below.

---

## Required Environment Variables

### 1. Database (Vercel Postgres or Local)

**Option A: Vercel Postgres (Production-like)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select existing
3. Go to **Storage** → **Create Database** → **Postgres**
4. Copy the connection strings from the "Quickstart" tab

```env
DATABASE_URL="postgres://user:password@host:5432/database?sslmode=require"
POSTGRES_PRISMA_URL="postgres://user:password@host:5432/database?sslmode=require&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgres://user:password@host:5432/database?sslmode=require"
```

**Option B: Local PostgreSQL (Development)**

```bash
# Using Docker
docker run --name pulse-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=pulse -p 5432:5432 -d postgres:15
```

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/pulse"
```

After setting up the database, run migrations:

```bash
npx prisma db push
```

---

### 2. NextAuth.js (Authentication)

Generate a secret:

```bash
openssl rand -base64 32
```

```env
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

---

### 3. Google OAuth (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen if prompted
6. Select **Web application**
7. Add authorized origins:
   - `http://localhost:3000`
8. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
9. Copy the Client ID and Client Secret

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**If you skip Google OAuth**: Users can still register and login with email/password.

---

## Optional Environment Variables

### Vercel Blob (File Uploads)

1. Go to Vercel Dashboard → Storage → Create Database → Blob
2. Copy the token

```env
BLOB_READ_WRITE_TOKEN="vercel_blob_xxxxx"
```

**If not configured**: File upload features won't work, but the rest of the app will function.

---

### Stripe (Payments) - Currently Mocked

When ready to implement real payments:

1. Create account at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get API keys from Developers → API keys

```env
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
```

**Currently mocked**: Payment features are placeholders.

---

## Complete .env.local Example

```env
# Database (Required)
DATABASE_URL="postgresql://postgres:password@localhost:5432/pulse"

# NextAuth (Required)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional - for "Continue with Google")
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Vercel Blob (Optional - for file uploads)
BLOB_READ_WRITE_TOKEN=""

# Stripe (Optional - currently mocked)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

---

## Running the App

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up database:

   ```bash
   npx prisma db push
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

---

## Testing Flow

1. **Register**: Go to `/register` and create an account with email/password
2. **Create Page**: After login, you'll be redirected to dashboard. Click "Criar página"
3. **Add Blocks**: Use the editor to add links, highlights, text, etc.
4. **Preview**: See live preview on the right side
5. **Publish**: Click "Publicar" to make your page public
6. **View**: Visit `/p/your-username` to see the public page

---

## Troubleshooting

### "Database connection failed"

- Check if PostgreSQL is running
- Verify DATABASE_URL is correct
- Run `npx prisma db push` to create tables

### "Google OAuth not working"

- Ensure redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`
- Check if OAuth consent screen is configured
- Google OAuth is optional - use email/password login instead

### "Build errors"

- Delete `.next` folder and rebuild: `rm -rf .next && npm run build`
- Check Node.js version (18+ required)
