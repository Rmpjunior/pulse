"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Check,
  Clock,
  Zap,
  Crown,
  Palette,
  BarChart3,
  Shield,
  Globe,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Seções ilimitadas",
    description: "Crie quantas seções quiser na sua página",
  },
  {
    icon: Palette,
    title: "Cores personalizadas",
    description: "Personalize cada detalhe visual do seu minisite",
  },
  {
    icon: BarChart3,
    title: "Análises avançadas",
    description: "Veja de onde vêm seus visitantes e quais links performam melhor",
  },
  {
    icon: Shield,
    title: "Sem marca d'água",
    description: "Sua página 100% com a sua marca",
  },
  {
    icon: Globe,
    title: "Domínio personalizado",
    description: "Use seu próprio domínio no minisite",
  },
  {
    icon: Crown,
    title: "Suporte prioritário",
    description: "Atendimento rápido quando precisar",
  },
];

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "already">("idle");

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session?.user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setStatus(data.message === "already_on_waitlist" ? "already" : "success");
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assinatura</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Desbloqueie todo o potencial do Pulse
        </p>
      </div>

      {/* Hero card */}
      <div className="relative rounded-2xl overflow-hidden border border-primary/20">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 via-transparent to-purple-500/8 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 md:items-start md:justify-between">
            {/* Left: info */}
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
                <Sparkles className="h-3 w-3" />
                Em breve
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight">Pulse Plus</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-sm">
                  Planos pagos estão chegando. Entre na lista de espera e seja
                  o primeiro a saber quando lançarmos — com desconto exclusivo.
                </p>
              </div>

              {/* Waitlist form */}
              {status === "success" ? (
                <div className="flex items-start gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-emerald-500">Você está na lista!</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Avisaremos em <strong className="text-foreground">{email}</strong> quando o Pulse Plus estiver disponível.
                    </p>
                  </div>
                </div>
              ) : status === "already" ? (
                <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                  <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-amber-500">Já na lista!</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      O e-mail <strong className="text-foreground">{email}</strong> já está cadastrado. Avisaremos em breve!
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@exemplo.com"
                    required
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    variant="gradient"
                    disabled={status === "loading"}
                    className="gap-1.5 shrink-0"
                  >
                    {status === "loading" ? (
                      "Aguarde..."
                    ) : (
                      <>
                        Entrar na lista
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Right: plan badge */}
            <div className="shrink-0 flex flex-col items-center justify-center rounded-2xl bg-card border border-border/60 p-6 text-center min-w-[160px]">
              <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center mb-3 shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <p className="font-bold text-lg gradient-primary-text">Plus</p>
              <p className="text-xs text-muted-foreground mt-1">Em breve</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          O que está incluído
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-2 hover:border-primary/30 transition-colors"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="font-medium text-sm">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
