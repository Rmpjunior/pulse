"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
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
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Send,
  X,
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
  maxSections?: number;
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
  { type: "CATALOG", icon: ShoppingBag, label: "Coleção" },
  { type: "SOCIAL_ICONS", icon: Share2, label: "Redes Sociais" },
  { type: "TEXT", icon: Type, label: "Texto" },
  { type: "DIVIDER", icon: Minus, label: "Divisor" },
];

const USERNAME_PATTERN = /^[a-z0-9_-]{3,20}$/;

function normalizeUsernameValue(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
}

const sectionLibrary = [
  {
    key: "WELCOME",
    label: "Boas-vindas",
    description: "Introdução com título curto",
    icon: Type,
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
    label: "Sobre",
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
    label: "Coleção",
    description: "Produtos, portfólio ou agenda",
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
    label: "Redes sociais",
    description: "Redes sociais",
    icon: Share2,
    type: "SOCIAL_ICONS" as BlockType,
  },
];

function getQuickStartPresetBlocks(
  preset: "creator" | "business" | "personal",
) {
  if (preset === "business") {
    return [
      {
        type: "TEXT" as BlockType,
        content: {
          variant: "WELCOME",
          displayName: "",
          featuredTitle: "Soluções para seu negócio",
          secondTitle: "Atendimento rápido e profissional",
          ctaText: "Solicitar orçamento",
          ctaLink: "",
        },
      },
      {
        type: "CATALOG" as BlockType,
        content: {
          items: [
            {
              id: crypto.randomUUID(),
              name: "Serviço principal",
              description: "Descrição curta do serviço",
              price: "R$ 199,00",
              image: "",
              url: "",
            },
          ],
        },
      },
      {
        type: "LINK" as BlockType,
        content: {
          label: "Falar no WhatsApp",
          url: "https://wa.me/",
          style: "gradient",
          thumbnailType: "emoji",
          thumbnailValue: "💬",
        },
      },
    ];
  }

  if (preset === "personal") {
    return [
      {
        type: "TEXT" as BlockType,
        content: {
          variant: "WELCOME",
          displayName: "",
          featuredTitle: "Bem-vindo ao meu espaço",
          secondTitle: "Compartilho meus projetos e contatos",
          ctaText: "Meu trabalho",
          ctaLink: "",
        },
      },
      {
        type: "LINK" as BlockType,
        content: {
          label: "Portfólio",
          url: "https://",
          style: "default",
          thumbnailType: "emoji",
          thumbnailValue: "🧩",
        },
      },
      {
        type: "SOCIAL_ICONS" as BlockType,
        content: {
          icons: [
            { platform: "instagram", url: "https://instagram.com/" },
            { platform: "linkedin", url: "https://linkedin.com/in/" },
          ],
        },
      },
    ];
  }

  return [
    {
      type: "TEXT" as BlockType,
      content: {
        variant: "WELCOME",
        displayName: "",
        featuredTitle: "Crie, publique e cresça",
        secondTitle: "Seu hub de links em minutos",
        ctaText: "Ver links",
        ctaLink: "",
      },
    },
    {
      type: "LINK" as BlockType,
      content: {
        label: "Meu link principal",
        url: "https://",
        style: "default",
        thumbnailType: "emoji",
        thumbnailValue: "🚀",
      },
    },
    {
      type: "SOCIAL_ICONS" as BlockType,
      content: {
        icons: [{ platform: "instagram", url: "https://instagram.com/" }],
      },
    },
  ];
}

export function EditorContent({
  page,
  isPlusUser = false,
  maxSections = 8,
}: EditorContentProps) {
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
  const [onboardingPreset, setOnboardingPreset] = useState<
    "creator" | "business" | "personal"
  >("creator");
  const [onboardingFirstSection, setOnboardingFirstSection] =
    useState<BlockType>("LINK");
  const [publishSuccessUrl, setPublishSuccessUrl] = useState<string | null>(
    page?.published ? `/p/${page.username}` : null,
  );
  const [isCopyingPublishedLink, setIsCopyingPublishedLink] = useState(false);
  const [hasDraftRecoveryChoice, setHasDraftRecoveryChoice] = useState(false);
  const [pendingRecoveredDraft, setPendingRecoveredDraft] = useState<{
    displayName: string;
    bio: string;
    avatar: string;
    blocks: Block[];
    themeSettings: ThemeSettings;
  } | null>(null);
  const [upgradePromptReason, setUpgradePromptReason] = useState<string | null>(
    null,
  );
  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [shareModalPath, setShareModalPath] = useState<string | null>(null);

  const pushToast = useCallback((type: ToastMessage["type"], text: string) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, type, text }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const hasUnsavedMetaChanges =
    !!page &&
    (username !== page.username ||
      displayName !== (page.displayName || "") ||
      bio !== (page.bio || "") ||
      avatar !== (page.avatar || "") ||
      JSON.stringify(themeSettings) !==
        JSON.stringify((page.theme as ThemeSettings) || defaultThemeSettings));
  const livePagePath = publishSuccessUrl || (published ? `/p/${page?.username}` : null);

  const validateSlugAvailability = useCallback(
    async (candidate: string) => {
      if (!page) return false;

      const normalized = normalizeUsernameValue(candidate.trim());

      if (!USERNAME_PATTERN.test(normalized)) {
        return false;
      }

      const slugRes = await fetch(
        `/api/pages/slug?slug=${encodeURIComponent(normalized)}&pageId=${page.id}`,
      );

      if (!slugRes.ok) {
        throw new Error("slug-check-failed");
      }

      const slugData = (await slugRes.json()) as { available: boolean };
      return slugData.available;
    },
    [page],
  );

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
      const presetBlocks = getQuickStartPresetBlocks(onboardingPreset);

      const blocksToCreate = [
        {
          type: onboardingFirstSection,
          content: firstSectionContent,
        },
        ...presetBlocks,
      ].slice(0, maxSections);

      await Promise.all([
        ...blocksToCreate.map((block, index) =>
          fetch(`/api/pages/${createdPage.id}/blocks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: block.type,
              order: index,
              content: block.content,
            }),
          }),
        ),
        fetch(`/api/pages/${createdPage.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            theme: {
              onboarding: {
                category: onboardingCategory,
                preset: onboardingPreset,
                firstSection: onboardingFirstSection,
                completedAt: new Date().toISOString(),
              },
            },
          }),
        }),
      ]);

      pushToast("success", "Página criada com onboarding inicial.");
      router.push(`/dashboard/editor?pageId=${createdPage.id}`);
    } catch (error) {
      console.error("Error creating page:", error);
      pushToast("error", "Erro ao criar página.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSave = async () => {
    if (!page) return;

    const normalizedUsername = normalizeUsernameValue(username.trim());

    if (!USERNAME_PATTERN.test(normalizedUsername)) {
      setSlugStatus("invalid");
      pushToast(
        "error",
        "Username precisa ter entre 3 e 20 caracteres com letras, numeros, _ ou -.",
      );
      return;
    }

    try {
      const slugAvailable = await validateSlugAvailability(normalizedUsername);

      if (!slugAvailable) {
        setSlugStatus("taken");
        pushToast("error", "Esse username nao esta disponivel.");
        return;
      }
    } catch {
      pushToast("error", "Nao foi possivel validar o username.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: normalizedUsername,
          displayName,
          bio,
          avatar: avatar || undefined,
          theme: themeSettings,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: { message?: string } }
          | null;
        pushToast(
          "error",
          data?.error?.message || "Falha ao salvar alterações.",
        );
        return;
      }

      setSlugStatus("available");
      setUsername(normalizedUsername);
      if (published) {
        const sharePath = `/p/${normalizedUsername}`;
        setPublishSuccessUrl(sharePath);
        setShareModalPath(sharePath);
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
    if (!livePagePath) return;

    const absoluteUrl = `${window.location.origin}${livePagePath}`;
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
  }, [livePagePath, pushToast]);

  const handlePublish = async () => {
    if (!page) return;

    const normalizedUsername = normalizeUsernameValue(username.trim());

    if (!USERNAME_PATTERN.test(normalizedUsername)) {
      setSlugStatus("invalid");
      pushToast(
        "error",
        "Defina um username válido antes de publicar.",
      );
      return;
    }

    setIsPublishing(true);
    try {
      const nextPublished = !published;

      if (nextPublished) {
        const slugAvailable = await validateSlugAvailability(normalizedUsername);

        if (!slugAvailable) {
          setSlugStatus("taken");
          pushToast(
            "error",
            "Slug indisponível. Ajuste o username para publicar.",
          );
          return;
        }
      }

      const res = await fetch(`/api/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: normalizedUsername,
          displayName,
          bio,
          avatar: avatar || undefined,
          theme: themeSettings,
          published: nextPublished,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: { message?: string } }
          | null;
        pushToast(
          "error",
          data?.error?.message || "Falha ao alterar publicação.",
        );
        return;
      }

      setPublished(nextPublished);
      setUsername(normalizedUsername);
      setSlugStatus("available");

      if (nextPublished) {
        const liveUrl = `/p/${normalizedUsername}`;
        setPublishSuccessUrl(liveUrl);
        setShareModalPath(liveUrl);
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

    if (blocks.length >= maxSections) {
      const reason = `Seu plano permite até ${maxSections} seções. Faça upgrade para expandir.`;
      pushToast("error", reason);
      setUpgradePromptReason(reason);
      return;
    }

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
        pushToast("error", "Falha ao adicionar módulo.");
        return;
      }

      const newBlock = await res.json();
      setBlocks((current) =>
        current.map((b) => (b.id === tempId ? newBlock : b)),
      );
      pushToast("success", "Módulo adicionado.");
    } catch (error) {
      console.error("Error adding block:", error);
      setBlocks((current) => current.filter((b) => b.id !== tempId));
      pushToast("error", "Erro ao adicionar módulo.");
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
          pushToast("error", "Falha ao atualizar módulo.");
          return;
        }

        pushToast("success", "Módulo atualizado.");
      } catch (error) {
        console.error("Error updating block:", error);
        setBlocks(previousBlocks);
        pushToast("error", "Erro ao atualizar módulo.");
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
          pushToast("error", "Falha ao remover módulo.");
          return;
        }

        pushToast("success", "Módulo removido.");
      } catch (error) {
        console.error("Error deleting block:", error);
        setBlocks(previousBlocks);
        pushToast("error", "Erro ao remover módulo.");
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

  const persistModuleOrder = useCallback(
    async (updatedBlocks: Block[], previousBlocks: Block[]) => {
      if (!page) return;

      setBlocks(updatedBlocks);

      try {
        const res = await fetch(`/api/pages/${page.id}/blocks`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blocks: updatedBlocks.map((block) => ({
              id: block.id,
              order: block.order,
            })),
          }),
        });

        if (!res.ok) {
          setBlocks(previousBlocks);
          pushToast("error", "Falha ao reordenar módulos.");
        }
      } catch (error) {
        console.error("Error reordering modules:", error);
        setBlocks(previousBlocks);
        pushToast("error", "Erro ao reordenar módulos.");
      }
    },
    [page, pushToast],
  );

  const handleMoveBlock = useCallback(
    async (blockId: string, direction: "up" | "down") => {
      if (!page) return;

      const index = blocks.findIndex((block) => block.id === blockId);
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

      await persistModuleOrder(
        newBlocks.map((block, order) => ({ ...block, order })),
        previousBlocks,
      );
    },
    [page, blocks, persistModuleOrder],
  );

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      if (!result.destination || result.destination.index === result.source.index) {
        return;
      }

      const previousBlocks = blocks;
      const reordered = [...blocks];
      const [movedBlock] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, movedBlock);

      await persistModuleOrder(
        reordered.map((block, order) => ({ ...block, order })),
        previousBlocks,
      );
    },
    [blocks, persistModuleOrder],
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

  useEffect(() => {
    if (!page) return;

    const normalized = normalizeUsernameValue(username.trim());

    if (!normalized) {
      setSlugStatus("idle");
      return;
    }

    if (!USERNAME_PATTERN.test(normalized)) {
      setSlugStatus("invalid");
      return;
    }

    let active = true;
    setSlugStatus("checking");

    const timeout = setTimeout(async () => {
      try {
        const available = await validateSlugAvailability(normalized);
        if (!active) return;
        setSlugStatus(available ? "available" : "taken");
      } catch {
        if (!active) return;
        setSlugStatus("idle");
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [page, username, validateSlugAvailability]);

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
                  <div className="space-y-1 sm:flex sm:items-center sm:gap-2 sm:space-y-0">
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      {process.env.NEXT_PUBLIC_APP_URL}/p/
                    </span>
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
                      className="w-full sm:flex-1"
                    />
                  </div>
                </div>

                <Button
                  variant="default"
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
                  <label className="text-sm font-medium mb-2 block">
                    Categoria
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "creator", label: "Criador" },
                      { id: "business", label: "Negócios" },
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
                    Template rápido
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        id: "creator",
                        label: "Pacote Criador",
                        desc: "Boas-vindas + Link + Redes",
                      },
                      {
                        id: "business",
                        label: "Pacote Negócios",
                        desc: "Boas-vindas + Coleção + CTA",
                      },
                      {
                        id: "personal",
                        label: "Pacote Pessoal",
                        desc: "Boas-vindas + Portfólio + Redes",
                      },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() =>
                          setOnboardingPreset(
                            preset.id as "creator" | "business" | "personal",
                          )
                        }
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left",
                          onboardingPreset === preset.id
                            ? "border-primary bg-primary/10"
                            : "border-border",
                        )}
                      >
                        <span className="block text-sm font-medium">
                          {preset.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {preset.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Primeiro módulo
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: "LINK" as BlockType, label: "Links" },
                      { type: "TEXT" as BlockType, label: "Boas-vindas" },
                      { type: "CATALOG" as BlockType, label: "Coleção" },
                      { type: "SOCIAL_ICONS" as BlockType, label: "Redes sociais" },
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
                    <label className="text-sm font-medium mb-2 block">
                      Apresentação (opcional)
                    </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Uma breve descrição sobre você..."
                    className="w-full min-h-[80px] rounded-lg border border-input bg-background px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setOnboardingStep(1)}
                  >
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
      <div className="fixed bottom-20 right-3 z-50 flex w-full max-w-[calc(100vw-1.5rem)] flex-col items-end gap-2 sm:bottom-6 sm:right-4 sm:max-w-sm lg:bottom-24">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "w-full rounded-lg border px-3 py-2 text-sm shadow-sm backdrop-blur",
              toast.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
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
            <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
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

          {upgradePromptReason && !isPlusUser && (
            <div className="mb-4 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-3">
              <p className="text-sm text-indigo-700 dark:text-indigo-400">{upgradePromptReason}</p>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  Ver plano Plus
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setUpgradePromptReason(null)}
                >
                  Agora não
                </Button>
              </div>
            </div>
          )}

          <div className="mb-6 rounded-2xl border border-border/70 bg-card/70 px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                    published
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                  )}
                >
                  {published ? "Publicada" : "Rascunho"}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs",
                    hasUnsavedMetaChanges
                      ? "bg-orange-500/10 text-orange-600 dark:text-orange-300"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {hasUnsavedMetaChanges ? (
                    <>
                      <Clock3 className="h-3 w-3" />
                      Alterações pendentes
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Tudo sincronizado
                    </>
                  )}
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {blocks.length} módulos
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  Plano {isPlusUser ? "Plus" : "Free"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPublishedLink}
                  disabled={!livePagePath || isCopyingPublishedLink}
                >
                  <Copy className="h-4 w-4" />
                  {isCopyingPublishedLink ? "Copiando..." : "Copiar link"}
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                URL pública
              </label>
              <div className="rounded-xl border border-border bg-background/90 px-4 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className="text-xs text-muted-foreground sm:whitespace-nowrap">
                    {process.env.NEXT_PUBLIC_APP_URL}/p/
                  </span>
                  <Input
                    value={username}
                    onChange={(e) =>
                      setUsername(normalizeUsernameValue(e.target.value))
                    }
                    placeholder="seu-username"
                    className="border-0 bg-transparent px-0 text-base font-medium focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {slugStatus === "checking" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Validando disponibilidade...
                    </span>
                  </>
                ) : null}
                {slugStatus === "available" ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">
                      URL disponível
                    </span>
                  </>
                ) : null}
                {slugStatus === "taken" ? (
                  <>
                    <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">
                      URL indisponível
                    </span>
                  </>
                ) : null}
                {slugStatus === "invalid" ? (
                  <>
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-amber-700 dark:text-amber-400">
                      Use 3-20 caracteres com letras, numeros, _ ou -
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>

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
              onClick={() => {
                setActiveTab("theme");
                if (!isPlusUser) {
                  setUpgradePromptReason(
                    "Temas premium e customização avançada ficam liberados no plano Plus.",
                  );
                }
              }}
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
                  <CardTitle className="text-lg">
                    {t("profile.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Foto de perfil
                    </label>
                    <ImageUpload
                      value={avatar}
                      onChange={setAvatar}
                      placeholder="Fazer upload da foto"
                    />
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
                      Apresentação
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
                    <CardTitle className="text-lg">
                      {t("blocks.title")}
                    </CardTitle>
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => setShowBlockPicker(!showBlockPicker)}
                      disabled={blocks.length >= maxSections}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {t("blocks.add")} ({blocks.length}/{maxSections})
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showBlockPicker && (
                    <div className="mb-4 space-y-4 rounded-2xl border border-border bg-muted/40 p-4">
                      <div>
                        <p className="text-sm font-medium">
                          Biblioteca de módulos
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Estruturas rápidas para montar o minisite sem começar do zero.
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
                          Módulos adicionais
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
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="modules">
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="space-y-3"
                            >
                              {blocks.map((block, index) => (
                                <Draggable
                                  key={block.id}
                                  draggableId={block.id}
                                  index={index}
                                >
                                  {(dragProvided, snapshot) => (
                                    <div
                                      ref={dragProvided.innerRef}
                                      {...dragProvided.draggableProps}
                                      style={dragProvided.draggableProps.style}
                                    >
                                      <BlockEditor
                                        block={block}
                                        onUpdate={handleUpdateBlock}
                                        onDelete={handleDeleteBlock}
                                        onToggleVisibility={handleToggleVisibility}
                                        onMoveUp={(id) => handleMoveBlock(id, "up")}
                                        onMoveDown={(id) => handleMoveBlock(id, "down")}
                                        isFirst={index === 0}
                                        isLast={index === blocks.length - 1}
                                        dragHandleProps={dragProvided.dragHandleProps}
                                        isDragging={snapshot.isDragging}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
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
          <div className="mt-6 flex gap-2 border-t pt-3 sm:gap-3 lg:sticky lg:bottom-0 lg:bg-background/95 lg:py-3 lg:backdrop-blur">
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

        </div>

        {/* Preview Panel */}
        <div
          className={cn(
            "w-full flex flex-col transition-all duration-200",
            previewMode === "mobile" ? "lg:w-[376px]" : "lg:w-[440px]",
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
            <div
              className={cn(
                "h-full rounded-xl overflow-y-auto mx-auto transition-all duration-200",
                previewMode === "mobile" ? "max-w-[336px]" : "w-full",
              )}
            >
              <ThemedPreview
                settings={themeSettings}
                displayName={displayName}
                bio={bio}
                avatarUrl={avatar}
                blocks={blocks}
              />
            </div>
          </div>

          <div className="border-t pt-3">
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

      {shareModalPath ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          onClick={() => setShareModalPath(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-orange-500/12 via-background to-emerald-500/12 px-6 py-6">
              <button
                type="button"
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-background/70 hover:text-foreground"
                onClick={() => setShareModalPath(null)}
                aria-label="Fechar modal de compartilhamento"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-500">
                <Send className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Página pronta para compartilhar
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Abra a página ao vivo ou copie o link para enviar agora.
              </p>
            </div>
            <div className="space-y-4 px-6 py-6">
              <div className="rounded-2xl border border-border bg-muted/35 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Link
                </p>
                <p className="mt-2 break-all text-sm">
                  {process.env.NEXT_PUBLIC_APP_URL}
                  {shareModalPath}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="gradient"
                  className="flex-1"
                  onClick={copyPublishedLink}
                  disabled={isCopyingPublishedLink}
                >
                  <Copy className="h-4 w-4" />
                  {isCopyingPublishedLink ? "Copiando..." : "Copiar link"}
                </Button>
                <a
                  href={shareModalPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <Eye className="h-4 w-4" />
                  Ver página
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
