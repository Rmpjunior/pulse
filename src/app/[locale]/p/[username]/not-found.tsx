import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="text-center">
        <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
          <Sparkles className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-8">
          Esta página não existe ou não está publicada.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="gradient">Ir para o início</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Criar sua página</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
