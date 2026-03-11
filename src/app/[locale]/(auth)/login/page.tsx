import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LoginForm } from "./login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isGoogleOAuthEnabled } from "@/lib/auth/google-config";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ThemedImage } from "@/components/ui/themed-image";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("common");
  const googleEnabled = isGoogleOAuthEnabled();
  const { error } = await searchParams;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side Graphic */}
      <div className="hidden lg:flex flex-col items-center justify-center relative bg-muted/5 p-8 border-r border-border overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl dark:bg-orange-500/20" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl dark:bg-purple-500/20" />
        </div>
        <div className="relative w-full max-w-lg aspect-square">
          <ThemedImage
            lightSrc="/assets/abstract_art_light.png"
            darkSrc="/assets/abstract_art_dark.png"
            alt="Pulse Auth"
            fill
            className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
            priority
          />
        </div>
      </div>

      {/* Right side Form */}
      <div className="flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-start gap-2 mb-8">
            <BrandLogo size={40} className="rounded-xl" />
            <span className="font-bold text-2xl text-foreground">
              {tCommon("appName")}
            </span>
          </Link>

          <Card className="border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">{t("title")}</CardTitle>
              <CardDescription>{t("subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error === "OAuthAccountNotLinked"
                    ? "Este e-mail já está cadastrado. Tente outro método de login."
                    : "Ocorreu um erro ao fazer login. Tente novamente."}
                </div>
              )}
              <LoginForm googleEnabled={googleEnabled} />

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">{t("noAccount")} </span>
                <Link
                  href="/register"
                  className="text-primary hover:underline font-medium"
                >
                  {t("register")}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              ← {tCommon("back")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
