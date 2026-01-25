import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pulse - Transforme seu bio em um minisite",
    template: "%s | Pulse",
  },
  description:
    "Centralize seus links, produtos e conteúdo em uma única página profissional. Fácil de criar, fácil de compartilhar.",
  keywords: [
    "bio link",
    "link in bio",
    "minisite",
    "landing page",
    "social media",
  ],
  authors: [{ name: "Pulse" }],
  creator: "Pulse",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
    title: "Pulse - Transforme seu bio em um minisite",
    description:
      "Centralize seus links, produtos e conteúdo em uma única página profissional.",
    siteName: "Pulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse - Transforme seu bio em um minisite",
    description:
      "Centralize seus links, produtos e conteúdo em uma única página profissional.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
