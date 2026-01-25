"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword");

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call (in production, this would call an actual password reset endpoint)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSuccess(true);
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
        <p className="text-foreground font-medium mb-2">Email enviado!</p>
        <p className="text-sm text-muted-foreground">
          Verifique sua caixa de entrada para redefinir sua senha.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t("email")}
        </label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <Button
        type="submit"
        variant="gradient"
        className="w-full"
        isLoading={isLoading}
      >
        {t("submit")}
      </Button>
    </form>
  );
}
