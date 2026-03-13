import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ThemedImage } from "@/components/ui/themed-image";
import {
  Link as LinkIcon,
  Play,
  ShoppingBag,
  BarChart3,
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
            <span className="font-bold text-xl text-foreground">Pulse</span>
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
              <Button size="sm" className="whitespace-nowrap px-3 sm:px-4">
                {t("auth.register.title")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 mt-16 lg:mt-0 xl:min-h-[85vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] dark:bg-primary/10" />
        </div>

        <div className="container relative mx-auto max-w-7xl z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              {t("landing.hero.trust.mobileFirst")}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in leading-tight lg:-mr-20 z-20 relative">
              {t("landing.hero.title")}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-slide-up">
              {t("landing.hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/register">
                <Button
                  size="xl"
                  className="group text-lg px-8 h-14 bg-primary hover:bg-primary/90"
                >
                  {t("landing.hero.cta")}
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button
                  variant="outline"
                  size="xl"
                  className="h-14 px-8 border-border/50 bg-background/50 backdrop-blur hover:bg-muted/50"
                >
                  {t("landing.hero.ctaSecondary")}
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-8">
              {trustBullets
                .filter((key) => key !== "mobileFirst")
                .map((key) => (
                  <div
                    key={key}
                    className="flex items-center text-sm text-muted-foreground"
                  >
                    <Check className="mr-1.5 h-4 w-4 text-primary" />
                    {t(`landing.hero.trust.${key}`)}
                  </div>
                ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-purple-500/20 blur-[80px] rounded-full pointer-events-none" />
            <ThemedImage
              lightSrc="/assets/landing_hero_light.png"
              darkSrc="/assets/landing_hero_dark.png"
              alt="App Interface"
              width={1000}
              height={1000}
              className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700 select-none animate-float"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Bento Grid Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {t("landing.features.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              Crie o minisite perfeito para vender, divulgar ou unificar sua
              presença digital.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Bento Box 1: Themes — large feature card */}
            <div className="lg:col-span-8 group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 hover:border-primary/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-sm">
              <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-500" />
              <div className="relative z-10 md:w-1/2 flex flex-col justify-center h-full">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Palette className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  {t("landing.features.themes.title")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("landing.features.themes.description")}
                </p>
              </div>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-[55%] lg:w-[50%] transform group-hover:scale-105 transition-transform duration-700 pointer-events-none hidden md:block">
                <ThemedImage
                  lightSrc="/assets/features_grid_light.png"
                  darkSrc="/assets/feature_grids_dark.png"
                  alt="Features Grid"
                  width={800}
                  height={800}
                  className="w-full h-auto drop-shadow-xl"
                />
              </div>
            </div>

            {/* Bento Box 2: Analytics */}
            <div className="lg:col-span-4 group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 hover:border-primary/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-sm">
              <div className="absolute -left-10 -bottom-10 w-[250px] h-[250px] bg-orange-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-orange-500/20 transition-colors duration-500" />
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  {t("landing.features.analytics.title")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("landing.features.analytics.description")}
                </p>
              </div>
            </div>

            {/* Remaining feature cards */}
            {features
              .filter((f) => f.key !== "themes" && f.key !== "analytics")
              .map(({ icon: Icon, key }) => (
                <div
                  key={key}
                  className="lg:col-span-3 group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 hover:border-primary/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-sm text-center lg:text-left flex flex-col items-center lg:items-start"
                >
                  <div className="absolute -right-8 -top-8 w-[150px] h-[150px] bg-purple-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-purple-500/15 transition-colors duration-500" />
                  <div className="relative z-10">
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">
                      {t(`landing.features.${key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`landing.features.${key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {t("landing.howItWorks.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              Comece agora mesmo, sem complicações.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[40%] left-10 right-10 h-0.5 bg-border -z-10" />

            {howItWorks.map(({ icon: Icon, key }, index) => (
              <div
                key={key}
                className="bg-card border border-border rounded-3xl p-8 relative flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm"
              >
                <div className="absolute -top-5 w-10 h-10 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 ring-4 ring-background shadow-inner">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {t(`landing.howItWorks.${key}.title`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(`landing.howItWorks.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {t("landing.pricing.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              Simplificado para escalar junto com você.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Free Plan */}
            <div className="p-10 bg-card border border-border rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold mb-2">
                {t("landing.pricing.free.name")}
              </h3>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight">
                  {t("landing.pricing.free.price")}
                </span>
                <span className="text-muted-foreground font-medium">
                  {t("landing.pricing.free.period")}
                </span>
              </div>
              <ul className="space-y-4 mb-10 text-muted-foreground">
                {(t.raw("landing.pricing.free.features") as string[]).map(
                  (feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ),
                )}
              </ul>
              <Link href="/register" className="block mt-auto">
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full h-14 rounded-xl border-border/60 hover:bg-muted font-semibold text-base"
                >
                  {t("landing.hero.cta")}
                </Button>
              </Link>
            </div>

            {/* Plus Plan */}
            <div className="p-10 bg-card border border-primary/50 relative overflow-hidden rounded-[2.5rem] shadow-xl shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <div className="absolute top-0 inset-x-0 flex justify-center">
                <div className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-b-xl shadow-sm uppercase tracking-wider">
                  Mais escolhido
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2 mt-4 text-foreground">
                {t("landing.pricing.plus.name")}
              </h3>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight text-foreground">
                  {t("landing.pricing.plus.priceYearly")}
                </span>
                <span className="text-muted-foreground font-medium">
                  {t("landing.pricing.plus.periodYearly")}
                </span>
              </div>
              <ul className="space-y-4 mb-10 text-muted-foreground">
                {(t.raw("landing.pricing.plus.features") as string[]).map(
                  (feature: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-foreground/90"
                    >
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ),
                )}
              </ul>
              <Link href="/register" className="block mt-auto">
                <Button
                  size="xl"
                  className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 font-semibold text-base shadow-md shadow-primary/20"
                >
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
