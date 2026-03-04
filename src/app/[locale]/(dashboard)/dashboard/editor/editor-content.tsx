"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlockEditor } from "@/components/editor/block-editor";
import { ThemedPreview } from "@/components/editor/themed-preview";
import { ThemeEditor } from "@/components/editor/theme-editor";
import { defaultBlockContent, type BlockType } from "@/types/blocks";
import { defaultThemeSettings, type ThemeSettings } from "@/types/theme";
import {
  Plus,
  Eye,
  Smartphone,
  Monitor,
  Save,
  Link as LinkIcon,
  Play,
  Type,
  Sparkles,
  Share2,
  Minus,
  Globe,
  Loader2,
  Palette,
  LayoutGrid,
  ShoppingBag,
  FileText,
} from "lucide-react";

interface Block {
  id: string;
  type: BlockType;
  order: number;
  visible: boolean;
  content: unknown;
}

interface Page {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatar: string | null;
  theme: unknown;
  published: boolean;
  blocks: Block[];
}

interface EditorContentProps {
  page: Page | null;
  isPlusUser?: boolean;
}

interface ToastMessage {
  id: string;
  type: "success" | "error";
  text: string;
}

const blockTypes = [
  { type: "LINK", icon: LinkIcon, label: "Link" },
  { type: "HIGHLIGHT", icon: Sparkles, label: "Destaque" },
  { type: "MEDIA", icon: Play, label: "Mídia" },
  { type: "CATALOG", icon: ShoppingBag, label: "Catálogo" },
  { type: "FORM", icon: FileText, label: "Formulário" },
  { type: "SOCIAL_ICONS", icon: Share2, label: "Redes Sociais" },
  { type: "TEXT", icon: Type, label: "Texto" },
  { type: "DIVIDER", icon: Minus, label: "Divisor" },
];

const sectionLibrary = [
  {
    key: "WELCOME",
    label: "Welcome",
    description: "Introdução com título curto",
    icon: Sparkles,
    type: "TEXT" as BlockType,
    template: {
      variant: "WELCOME",
      profilePhoto: "",
      displayName: "",
      featuredTitle: "Seu destaque",
      secondTitle: "Subtítulo",
      ctaText: "Saiba mais",
      ctaLink: "",
      text: "",
      align: "center",
    },
  },
  {
    key: "ABOUT",
    label: "About",
    description: "Contexto sobre você ou seu projeto",
    icon: Type,
    type: "HIGHLIGHT" as BlockType,
    template: {
      variant: "ABOUT",
      pageTitle: "Sobre",
      featuredTitle: "",
      description: "Conte um pouco sobre você.",
      image: "",
      title: "Sobre",
    },
  },
  {
    key: "CATALOG",
    label: "Catalog",
    description: "Produtos e serviços",
    icon: ShoppingBag,
    type: "CATALOG" as BlockType,
  },
  {
    key: "LINKS",
    label: "Links",
    description: "CTA para canais externos",
    icon: LinkIcon,
    type: "LINK" as BlockType,
  },
  {
    key: "SOCIAL",
    label: "Social",
    description: "Redes sociais",
    icon: Share2,
    type: "SOCIAL_ICONS" as BlockType,
  },
];

export function EditorContent({ page, isPlusUser = false }: EditorContentProps) {
  const t = useTranslations("editor");
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "theme" ? "theme" : "content";

  const [activeTab, setActiveTab] = useState<"content" | "theme">(initialTab);
  const [username, setUsername] = useState(page?.username || "");
  const [displayName, setDisplayName] = useState(page?.displayName || "");
  const [bio, setBio] = useState(page?.bio || "");
  const [avatar, setAvatar] = useState(page?.avatar || "");
  const [blocks, setBlocks] = useState<Block[]>(page?.blocks || []);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(
    (page?.theme as ThemeSettings) || defaultThemeSettings,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(page?.published || false);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">(
    "mobile",
  );
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);
  const [onboardingCategory, setOnboardingCategory] = useState("creator");
  const [onboardingFirstSection, setOnboardingFirstSection] =
    useState<BlockType>("LINK");
  const [publishSuccessUrl, setPublishSuccessUrl] = useState<string | null>(null);
  const [isCopyingPublishedLink, setIsCopyingPublishedLink] = useState(false);
  const [hasDraftRecoveryChoice, setHasDraftRecoveryChoice] = useState(false);
  const [pendingRecoveredDraft, setPendingRecoveredDraft] = useState<{
    displayName: string;
    bio: string;
    avatar: string;
    blocks: Block[];
    themeSettings: ThemeSettings;
  } | null>(null);

  const pushToast = useCallback((type: ToastMessage["type"], text: string) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, type, text }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const handleCreatePage = async () => {
    if (!username.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, displayName, bio }),
      });

      if (!res.ok) {
        pushToast("error", "Não foi possível criar a página.");
        return;
      }

      const createdPage = (await res.json()) as { id: string };
      const firstSectionContent = defaultBlockContent[onboardingFirstSection];

      await Promise.all([
        fetch(`/api/pages/${createdPage.id}/blocks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: onboardingFirstSection,
            order: 0,
            content: firstSectionContent,
          }),
        }),
        fetch(`/api/pages/${createdPage.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            theme: {
              onboarding: {
                category: onboardingCategory,
                firstSection: onboardingFirstSection,
                completedAt: new Date().toISOString(),
              },
            },
          }),
        }),
      ]);

      pushToast("success", "Página criada com onboarding inicial.");
      router.refresh();
    } catch (error) {
      console.error("Error creating page:", error);
      pushToast("error", "Erro ao criar página.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSave = async () => {
    if (!page) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          bio,
          avatar: avatar || undefined,
          theme: themeSettings,
        }),
      });

      if (!res.ok) {
        pushToast("error", "Falha ao salvar alterações.");
        return;
      }

      pushToast("success", "Alterações salvas.");
      router.refresh();
    } catch (error) {
      console.error("Error saving:", error);
      pushToast("error", "Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyPublishedLink = useCallback(async () => {
    if (!publishSuccessUrl) return;

    const absoluteUrl = `${window.location.origin}${publishSuccessUrl}`;
    setIsCopyingPublishedLink(true);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(absoluteUrl);
        pushToast("success", "Link copiado.");
        return;
      }

      const textArea = document.createElement("textarea");
      textArea.value = absoluteUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (copied) {
        pushToast("success", "Link copiado.");
      } else {
        pushToast("error", "Não foi possível copiar automaticamente.");
      }
    } catch (error) {
      console.error("Error copying published link:", error);
      pushToast("error", "Erro ao copiar link.");
    } finally {
      setIsCopyingPublishedLink(false);
    }
  }, [publishSuccessUrl, pushToast]);

  const handlePublish = async () => {
    if (!page) return;

    setIsPublishing(true);
    try {
      const nextPublished = !published;

      if (nextPublished) {
        const slugRes = await fetch(
          `/api/pages/slug?slug=${encodeURIComponent(username)}&pageId=${page.id}`,
        );

        if (!slugRes.ok) {
          pushToast("error", "Falha ao validar slug para publicação.");
          return;
        }

        const slugData = (await slugRes.json()) as { available: boolean };

        if (!slugData.available) {
          pushToast("error", "Slug indisponível. Ajuste o username para publicar.");
          return;
        }
      }

      const res = await fetch(`/api/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: nextPublished }),
      });

      if (!res.ok) {
        pushToast("error", "Falha ao alterar publicação.");
        return;
      }

      setPublished(nextPublished);

      if (nextPublished) {
        const liveUrl = `/p/${username}`;
        setPublishSuccessUrl(liveUrl);
        pushToast("success", "Página publicada com sucesso.");
      } else {
        setPublishSuccessUrl(null);
        pushToast("success", "Página despublicada.");
      }
    } catch (error) {
      console.error("Error publishing:", error);
      pushToast("error", "Erro ao publicar/despublicar.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAddBlock = async (type: string, templateContent?: unknown) => {
    if (!page) return;

    const content = templateContent || defaultBlockContent[type as BlockType];
    const tempId = `tmp-${crypto.randomUUID()}`;
    const optimisticBlock: Block = {
      id: tempId,
      type: type as BlockType,
      order: blocks.length,
      visible: true,
      content,
    };

    setBlocks((current) => [...current, optimisticBlock]);
    setShowBlockPicker(false);

    try {
      const res = await fetch(`/api/pages/${page.id}/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, order: blocks.length, content }),
      });

      if (!res.ok) {
        setBlocks((current) => current.filter((b) => b.id !== tempId));
        pushToast("error", "Falha ao adicionar bloco.");
        return;
      }

      const newBlock = await res.json();
      setBlocks((current) =>
        current.map((b) => (b.id === tempId ? newBlock : b)),
      );
      pushToast("success", "Bloco adicionado.");
    } catch (error) {
      console.error("Error adding block:", error);
      setBlocks((current) => current.filter((b) => b.id !== tempId));
      pushToast("error", "Erro ao adicionar bloco.");
    }
  };

  const handleUpdateBlock = useCallback(
    async (blockId: string, content: unknown) => {
      if (!page) return;

      const previousBlocks = blocks;
      setBlocks((current) =>
        current.map((b) => (b.id === blockId ? { ...b, content } : b)),
      );

      try {
        const res = await fetch(`/api/pages/${page.id}/blocks/${blockId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (!res.ok) {
          setBlocks(previousBlocks);
          pushToast("error", "Falha ao atualizar bloco.");
          return;
        }

        pushToast("success", "Bloco atualizado.");
      } catch (error) {
        console.error("Error updating block:", error);
        setBlocks(previousBlocks);
        pushToast("error", "Erro ao atualizar bloco.");
      }
    },
    [page, blocks, pushToast],
  );

  const handleDeleteBlock = useCallback(
    async (blockId: string) => {
      if (!page) return;

      const previousBlocks = blocks;
      setBlocks((current) => current.filter((b) => b.id !== blockId));

      try {
        const res = await fetch(`/api/pages/${page.id}/blocks/${blockId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          setBlocks(previousBlocks);
          pushToast("error", "Falha ao remover bloco.");
          return;
        }

        pushToast("success", "Bloco removido.");
      } catch (error) {
        console.error("Error deleting block:", error);
        setBlocks(previousBlocks);
        pushToast("error", "Erro ao remover bloco.");
      }
    },
    [page, blocks, pushToast],
  );

  const handleToggleVisibility = useCallback(
    async (blockId: string) => {
      if (!page) return;

      const block = blocks.find((b) => b.id === blockId);
      if (!block) return;

      const previousBlocks = blocks;
      const newVisible = !block.visible;

      setBlocks((current) =>
        current.map((b) =>
          b.id === blockId ? { ...b, visible: newVisible } : b,
        ),
      );

      try {
        const res = await fetch(`/api/pages/${page.id}/blocks/${blockId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visible: newVisible }),
        });

        if (!res.ok) {
          setBlocks(previousBlocks);
          pushToast("error", "Falha ao alterar visibilidade.");
          return;
        }
      } catch (error) {
        console.error("Error toggling visibility:", error);
        setBlocks(previousBlocks);
        pushToast("error", "Erro ao alterar visibilidade.");
      }
    },
    [page, blocks, pushToast],
  );

  const handleMoveBlock = useCallback(
    async (blockId: string, direction: "up" | "down") => {
      if (!page) return;

      const index = blocks.findIndex((b) => b.id === blockId);
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === blocks.length - 1)
      ) {
        return;
      }

      const previousBlocks = blocks;
      const newBlocks = [...blocks];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newBlocks[index], newBlocks[targetIndex]] = [
        newBlocks[targetIndex],
        newBlocks[index],
      ];

      const updatedBlocks = newBlocks.map((b, i) => ({ ...b, order: i }));
      setBlocks(updatedBlocks);

      try {
        const res = await fetch(`/api/pages/${page.id}/blocks`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blocks: updatedBlocks.map((b) => ({ id: b.id, order: b.order })),
          }),
        });

        if (!res.ok) {
          setBlocks(previousBlocks);
          pushToast("error", "Falha ao reordenar blocos.");
        }
      } catch (error) {
        console.error("Error reordering blocks:", error);
        setBlocks(previousBlocks);
        pushToast("error", "Erro ao reordenar blocos.");
      }
    },
    [page, blocks, pushToast],
  );

  const draftStorageKey = page ? `pulse:draft:${page.id}` : null;

  useEffect(() => {
    if (!page || !draftStorageKey || hasDraftRecoveryChoice) return;

    const rawDraft = localStorage.getItem(draftStorageKey);
    if (!rawDraft) {
      setHasDraftRecoveryChoice(true);
      return;
    }

    try {
      const parsed = JSON.parse(rawDraft) as {
        displayName: string;
        bio: string;
        avatar: string;
        blocks: Block[];
        themeSettings: ThemeSettings;
      };

      const currentSerialized = JSON.stringify({
        displayName,
        bio,
        avatar,
        blocks,
        themeSettings,
      });
      const savedSerialized = JSON.stringify(parsed);

      if (currentSerialized !== savedSerialized) {
        setPendingRecoveredDraft(parsed);
      }
    } catch (error) {
      console.error("Error reading draft:", error);
      localStorage.removeItem(draftStorageKey);
    } finally {
      setHasDraftRecoveryChoice(true);
    }
  }, [
    page,
    draftStorageKey,
    hasDraftRecoveryChoice,
    displayName,
    bio,
    avatar,
    blocks,
    themeSettings,
  ]);

  useEffect(() => {
    if (!page || !draftStorageKey) return;

    const timeout = setTimeout(() => {
      const payload = {
        displayName,
        bio,
        avatar,
        blocks,
        themeSettings,
      };
      localStorage.setItem(draftStorageKey, JSON.stringify(payload));
    }, 500);

    return () => clearTimeout(timeout);
  }, [page, draftStorageKey, displayName, bio, avatar, blocks, themeSettings]);

  // If no page exists, show creation form
  if (!page) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle>Onboarding rápido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs text-muted-foreground">
              Passo {onboardingStep} de 2
            </div>

            {onboardingStep === 1 ? (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Título/Nome da página
                  </label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ex: Roberto Studio"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Escolha seu username
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">pulse.vercel.app/p/</span>
                    <Input
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9_-]/g, ""),
                        )
                      }
                      placeholder="seu-username"
                      className="flex-1"
                    />
                  </div>
                </div>

                <Button
                  variant="gradient"
                  className="w-full"
                  disabled={!username.trim() || !displayName.trim()}
                  onClick={() => setOnboardingStep(2)}
                >
                  Continuar
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoria</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "creator", label: "Creator" },
                      { id: "business", label: "Business" },
                      { id: "personal", label: "Pessoal" },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setOnboardingCategory(option.id)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm",
                          onboardingCategory === option.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Primeira seção
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: "LINK" as BlockType, label: "Links" },
                      { type: "TEXT" as BlockType, label: "Welcome" },
                      { type: "CATALOG" as BlockType, label: "Catálogo" },
                      { type: "FORM" as BlockType, label: "Formulário" },
                    ].map((option) => (
                      <button
                        key={option.type}
                        onClick={() => setOnboardingFirstSection(option.type)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm",
                          onboardingFirstSection === option.type
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Bio (opcional)</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Uma breve descrição sobre você..."
                    className="w-full min-h-[80px] rounded-lg border border-input bg-background px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setOnboardingStep(1)}>
                    Voltar
                  </Button>
                  <Button
                    variant="gradient"
                    className="flex-1"
                    onClick={handleCreatePage}
                    disabled={!username.trim() || isCreating}
                    isLoading={isCreating}
                  >
                    Criar página
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="fixed right-3 top-3 z-50 space-y-2 max-w-[calc(100vw-1.5rem)] sm:right-4 sm:top-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm shadow-sm bg-background",
              toast.type === "success"
                ? "border-emerald-300 text-emerald-700"
                : "border-red-300 text-red-700",
            )}
          >
            {toast.text}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-[calc(100vh-7rem)] lg:h-[calc(100vh-8rem)]">
      {/* Mobile View Toggle */}
      <div className="lg:hidden flex border rounded-lg overflow-hidden shrink-0 sticky top-0 z-10 bg-background">
        <button
          onClick={() => setMobileView("editor")}
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors",
            mobileView === "editor"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80",
          )}
        >
          Editor
        </button>
        <button
          onClick={() => setMobileView("preview")}
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors",
            mobileView === "preview"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80",
          )}
        >
          Preview
        </button>
      </div>

      {/* Editor Panel */}
      <div
        className={cn(
          "flex-1 overflow-y-auto pr-0 lg:pr-2 pb-24 lg:pb-0", 
          mobileView === "preview" ? "hidden lg:block" : "",
        )}
      >
        {pendingRecoveredDraft && (
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
            <p className="text-sm font-medium text-amber-900">
              Encontramos um rascunho não publicado desta página.
            </p>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDisplayName(pendingRecoveredDraft.displayName);
                  setBio(pendingRecoveredDraft.bio);
                  setAvatar(pendingRecoveredDraft.avatar || "");
                  setBlocks(pendingRecoveredDraft.blocks);
                  setThemeSettings(pendingRecoveredDraft.themeSettings);
                  setPendingRecoveredDraft(null);
                  pushToast("success", "Rascunho recuperado.");
                }}
              >
                Recuperar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (draftStorageKey) {
                    localStorage.removeItem(draftStorageKey);
                  }
                  setPendingRecoveredDraft(null);
                  pushToast("success", "Rascunho descartado.");
                }}
              >
                Descartar
              </Button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6 w-fit">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "content"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Conteúdo
          </button>
          <button
            onClick={() => setActiveTab("theme")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "theme"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Palette className="h-4 w-4" />
            Tema
          </button>
        </div>

        {activeTab === "content" ? (
          <div className="space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("profile.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={displayName || "Avatar"}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                      {displayName?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      URL da foto
                    </label>
                    <Input
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("profile.displayName")}
                  </label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("profile.bio")}
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Uma breve descrição..."
                    className="w-full min-h-[80px] rounded-lg border border-input bg-background px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Blocks Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{t("blocks.title")}</CardTitle>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => setShowBlockPicker(!showBlockPicker)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {t("blocks.add")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showBlockPicker && (
                  <div className="mb-4 space-y-3 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Biblioteca de seções</p>
                      <p className="text-xs text-muted-foreground">
                        Atalhos inspirados no fluxo Keepo
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sectionLibrary.map((section) => {
                        const Icon = section.icon;
                        return (
                          <button
                            key={section.key}
                            onClick={() =>
                              handleAddBlock(section.type, section.template)
                            }
                            className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors text-left"
                          >
                            <Icon className="h-5 w-5 text-primary mt-0.5" />
                            <span>
                              <span className="block text-sm font-medium">
                                {section.label}
                              </span>
                              <span className="block text-xs text-muted-foreground">
                                {section.description}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-2">
                        Blocos avançados
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {blockTypes.map(({ type, icon: Icon, label }) => (
                          <button
                            key={type}
                            onClick={() => handleAddBlock(type)}
                            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors"
                          >
                            <Icon className="h-5 w-5 text-primary" />
                            <span className="text-xs">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {blocks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {t("blocks.empty")}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {blocks.map((block, index) => (
                      <BlockEditor
                        key={block.id}
                        block={block}
                        onUpdate={handleUpdateBlock}
                        onDelete={handleDeleteBlock}
                        onToggleVisibility={handleToggleVisibility}
                        onMoveUp={(id) => handleMoveBlock(id, "up")}
                        onMoveDown={(id) => handleMoveBlock(id, "down")}
                        isFirst={index === 0}
                        isLast={index === blocks.length - 1}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <ThemeEditor
            settings={themeSettings}
            onChange={setThemeSettings}
            isPlusUser={isPlusUser}
          />
        )}

        {/* Action buttons */}
        <div className="flex gap-2 sm:gap-3 mt-6 sticky bottom-0 bg-background/95 backdrop-blur py-3 border-t">
          <Button
            variant="gradient"
            className="flex-1"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar alterações
          </Button>
          <Button
            variant={published ? "outline" : "default"}
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Globe className="h-4 w-4 mr-2" />
            )}
            {published ? "Despublicar" : "Publicar"}
          </Button>
        </div>

        {publishSuccessUrl && (
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 mt-2">
            <p className="text-sm font-medium text-emerald-800">
              Publicado com sucesso 🎉
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={copyPublishedLink}
                disabled={isCopyingPublishedLink}
              >
                {isCopyingPublishedLink ? "Copiando..." : "Copiar link"}
              </Button>
              <a
                href={publishSuccessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-600 px-3 text-sm font-medium text-white"
              >
                Ver website
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Preview Panel */}
      <div
        className={cn(
          "w-full lg:w-80 flex flex-col",
          mobileView === "editor" ? "hidden lg:flex" : "",
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">{t("preview")}</span>
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`p-1.5 rounded ${previewMode === "mobile" ? "bg-background shadow-sm" : ""}`}
            >
              <Smartphone className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`p-1.5 rounded ${previewMode === "desktop" ? "bg-background shadow-sm" : ""}`}
            >
              <Monitor className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-muted rounded-2xl p-2 overflow-hidden">
          <div className="h-full rounded-xl overflow-y-auto">
            <ThemedPreview
              settings={themeSettings}
              displayName={displayName}
              bio={bio}
              avatarUrl={avatar}
              blocks={blocks}
            />
          </div>
        </div>

        <div className="mt-4">
          <a
            href={`/p/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-10 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Eye className="h-4 w-4" />
            Ver página ao vivo
          </a>
        </div>
      </div>
    </div>
  </>
  );
}
