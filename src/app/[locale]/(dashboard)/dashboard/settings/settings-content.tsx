"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  CreditCard,
  Globe,
  Moon,
  Sun,
  LogOut,
  Trash2,
  Check,
  Loader2,
  Crown,
  Sparkles,
} from "lucide-react";

interface SettingsContentProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  subscription: {
    plan: string;
    expiresAt: Date | null;
  } | null;
}

export function SettingsContent({ user, subscription }: SettingsContentProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [language, setLanguage] = useState<"pt-BR" | "en">("pt-BR");

  const isPlusUser =
    subscription?.plan !== "FREE" && subscription?.plan !== undefined;

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      router.refresh();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Conta
          </CardTitle>
          <CardDescription>Gerencie suas informações pessoais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || ""}
                className="h-16 w-16 rounded-full"
              />
            ) : (
              <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold">
                {name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <Button variant="outline" size="sm">
              Alterar foto
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Nome</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">E-mail</label>
            <Input value={email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">
              O e-mail não pode ser alterado
            </p>
          </div>

          <Button onClick={handleSaveProfile} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Salvar alterações
          </Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Assinatura
          </CardTitle>
          <CardDescription>Gerencie seu plano</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 mb-4">
            <div className="flex items-center gap-3">
              {isPlusUser ? (
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Crown className="h-5 w-5 text-white" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="font-semibold">
                  {isPlusUser ? "Plano Plus" : "Plano Gratuito"}
                </p>
                {isPlusUser && subscription?.expiresAt ? (
                  <p className="text-xs text-muted-foreground">
                    Válido até{" "}
                    {new Date(subscription.expiresAt).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Recursos limitados
                  </p>
                )}
              </div>
            </div>
            {isPlusUser ? (
              <Button variant="outline" size="sm">
                Gerenciar
              </Button>
            ) : (
              <Button variant="gradient" size="sm">
                <Sparkles className="h-4 w-4 mr-1" />
                Upgrade
              </Button>
            )}
          </div>

          {!isPlusUser && (
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Recursos do Plus
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Seções ilimitadas</li>
                <li>• Cores personalizadas</li>
                <li>• Análises detalhadas</li>
                <li>• Sem marca d&apos;água</li>
                <li>• Domínio personalizado</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Preferências
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme */}
          <div>
            <label className="text-sm font-medium mb-2 block">Aparência</label>
            <div className="flex gap-2">
              {[
                { id: "light", icon: Sun, label: "Claro" },
                { id: "dark", icon: Moon, label: "Escuro" },
                { id: "system", icon: Globe, label: "Sistema" },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setTheme(id as typeof theme)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    theme === id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="text-sm font-medium mb-2 block">Idioma</label>
            <div className="flex gap-2">
              {[
                { id: "pt-BR", label: "Português" },
                { id: "en", label: "English" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setLanguage(id as typeof language)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    language === id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Zona de Perigo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sair da conta</p>
              <p className="text-sm text-muted-foreground">
                Você será desconectado deste dispositivo
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Excluir conta</p>
              <p className="text-sm text-muted-foreground">
                Esta ação é irreversível
              </p>
            </div>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
