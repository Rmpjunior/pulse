import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BrandLogo } from "@/components/ui/brand-logo";
import {
  Link as LinkIcon,
  Play,
  ShoppingBag,
  BarChart3,
  FileText,
  Palette,
  ArrowRight,
  Check,
  Rocket,
  PenSquare,
  Share2,
} from "lucide-react";

export default function HomePage() {
  const t = useTranslations();

  const features = [
    { icon: LinkIcon, key: "links" },
    { icon: Play, key: "media" },
    { icon: ShoppingBag, key: "catalog" },
    { icon: BarChart3, key: "analytics" },
    { icon: FileText, key: "form" },
    { icon: Palette, key: "themes" },
  ];

  const trustBullets = ["noCode", "mobileFirst", "publishFast"] as const;

  const howItWorks = [
    { icon: PenSquare, key: "step1" },
    { icon: Rocket, key: "step2" },
    { icon: Share2, key: "step3" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo size={32} className="shadow-sm" />
            <span className="font-bold text-xl gradient-primary-text">Pulse</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("landing.features.title")}
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("landing.pricing.title")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                {t("auth.login.title")}
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="gradient" size="sm" className="whitespace-nowrap px-3 sm:px-4">
                {t("auth.register.title")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            {t("landing.hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up">
            {t("landing.hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="gradient" size="xl" className="group">
                {t("landing.hero.cta")}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button variant="outline" size="xl">
                {t("landing.hero.ctaSecondary")}
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {trustBullets.map((key) => (
              <span
                key={key}
                className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs md:text-sm text-muted-foreground"
              >
                <Check className="mr-1.5 h-3.5 w-3.5 text-success" />
                {t(`landing.hero.trust.${key}`)}
              </span>
            ))}
          </div>

          {/* Demo Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 blur-3xl" />
            <div className="relative bg-card/90 border border-border rounded-2xl p-3 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 max-w-md mx-auto">
              <Image
                src="/assets/landing-hero-v2.jpg"
                alt="Prévia de minisite criado no Pulse"
                width={1024}
                height={1024}
                priority
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t("landing.features.title")}
          </h2>

          <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-sm">
            <Image
              src="/assets/landing-features-grid-v2.jpg"
              alt="Visão das principais funcionalidades do Pulse"
              width={1536}
              height={1024}
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">
                  {t(`landing.features.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`landing.features.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t("landing.howItWorks.title")}
          </h2>

          <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-sm">
            <Image
              src="/assets/landing-how-it-works-v2.jpg"
              alt="Ilustração do fluxo de criação no Pulse"
              width={1536}
              height={1024}
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {howItWorks.map(({ icon: Icon, key }, index) => (
              <div
                key={key}
                className="p-6 bg-card border border-border rounded-xl h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t("landing.howItWorks.stepLabel", { number: index + 1 })}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">
                  {t(`landing.howItWorks.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`landing.howItWorks.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t("landing.pricing.title")}
          </h2>

          <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-sm">
            <Image
              src="/assets/landing-pricing-v2.jpg"
              alt="Comparativo visual entre os planos Free e Plus"
              width={1536}
              height={1024}
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="p-8 bg-card border border-border rounded-2xl">
              <h3 className="text-2xl font-bold mb-2">
                {t("landing.pricing.free.name")}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {t("landing.pricing.free.price")}
                </span>
                <span className="text-muted-foreground ml-2">
                  {t("landing.pricing.free.period")}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {(t.raw("landing.pricing.free.features") as string[]).map(
                  (feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-success" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ),
                )}
              </ul>
              <Link href="/register" className="block">
                <Button variant="outline" size="lg" className="w-full">
                  {t("landing.hero.cta")}
                </Button>
              </Link>
            </div>

            {/* Plus Plan */}
            <div className="p-8 bg-card border-2 border-primary rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                Mais escolhido
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {t("landing.pricing.plus.name")}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {t("landing.pricing.plus.priceYearly")}
                </span>
                <span className="text-muted-foreground ml-2">
                  {t("landing.pricing.plus.periodYearly")}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {(t.raw("landing.pricing.plus.features") as string[]).map(
                  (feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-success" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ),
                )}
              </ul>
              <Link href="/register" className="block">
                <Button variant="gradient" size="lg" className="w-full">
                  {t("landing.pricing.plus.cta")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>
            {t("landing.footer.madeWith")} ❤️ {t("landing.footer.by")}
          </p>
        </div>
      </footer>
    </div>
  );
}
