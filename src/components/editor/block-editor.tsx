"use client";

import Image from "next/image";
import { useState } from "react";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GripVertical,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Pencil,
  X,
  Check,
} from "lucide-react";
import type { BlockType } from "@/types/blocks";
import { ImageUpload } from "@/components/ui/image-upload";
import { SocialIcon } from "@/components/ui/social-icon";
import { ensureUrlProtocol, isValidHttpUrlLike } from "@/lib/url";

interface BlockEditorProps {
  block: {
    id: string;
    type: BlockType;
    order: number;
    visible: boolean;
    content: unknown;
  };
  onUpdate: (id: string, content: unknown) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;
}

export function BlockEditor({
  block,
  onUpdate,
  onDelete,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  dragHandleProps,
  isDragging = false,
}: BlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(block.content);

  const handleSave = () => {
    onUpdate(block.id, normalizeBlockContent(block.type, editContent));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(block.content);
    setIsEditing(false);
  };

  const getBlockLabel = (type: BlockType) => {
    const labels: Record<BlockType, string> = {
      LINK: "Link",
      HIGHLIGHT: "Destaque",
      MEDIA: "Mídia",
      SOCIAL_ICONS: "Redes Sociais",
      TEXT: "Texto",
      DIVIDER: "Divisor",
      CATALOG: "Coleção",
      FORM: "Módulo legado",
    };
    return labels[type];
  };

  return (
    <div
      className={`border rounded-xl bg-card/80 shadow-sm transition-shadow ${!block.visible ? "opacity-50" : ""} ${isDragging ? "shadow-lg ring-1 ring-primary/30" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-3 bg-muted/40 border-b">
        <button
          type="button"
          className="rounded-md p-1 text-muted-foreground cursor-grab active:cursor-grabbing hover:bg-background/80"
          aria-label="Arrastar módulo"
          {...dragHandleProps}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <span className="text-sm font-medium flex-1">
          {getBlockLabel(block.type)}
        </span>

        <div className="hidden sm:flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMoveUp(block.id)}
            disabled={isFirst}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMoveDown(block.id)}
            disabled={isLast}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggleVisibility(block.id)}
          >
            {block.visible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(block.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="sm:hidden grid grid-cols-4 gap-2 px-3 py-2 border-b bg-background">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => onMoveUp(block.id)}
          disabled={isFirst}
        >
          ↑ Subir
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => onMoveDown(block.id)}
          disabled={isLast}
        >
          ↓ Descer
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => onToggleVisibility(block.id)}
        >
          {block.visible ? "Ocultar" : "Mostrar"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-destructive hover:text-destructive"
          onClick={() => onDelete(block.id)}
        >
          Remover
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <BlockEditForm
            type={block.type}
            content={editContent}
            onChange={setEditContent}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <BlockPreview
            type={block.type}
            content={block.content}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  );
}

interface BlockPreviewProps {
  type: BlockType;
  content: unknown;
  onEdit: () => void;
}

function BlockPreview({ type, content, onEdit }: BlockPreviewProps) {
  const c = content as Record<string, unknown>;

  const renderPreview = () => {
    switch (type) {
      case "LINK":
        const linkLabel = (c.label as string) || "Link sem título";
        const linkUrl = (c.url as string) || "Sem URL";
        return (
          <div className="flex items-center gap-3">
            {(c.thumbnailType as string) === "emoji" &&
            (c.thumbnailValue as string) ? (
              <span className="text-xl">{c.thumbnailValue as string}</span>
            ) : (c.thumbnailType as string) === "image" &&
              (c.thumbnailValue as string) ? (
              <Image
                src={c.thumbnailValue as string}
                alt="Miniatura"
                width={32}
                height={32}
                unoptimized
                className="h-8 w-8 rounded object-cover"
              />
            ) : null}
            <div className="flex-1">
              <p className="font-medium">{linkLabel}</p>
              <p className="text-sm text-muted-foreground truncate">
                {linkUrl}
              </p>
            </div>
          </div>
        );
      case "HIGHLIGHT":
        if (c.variant === "ABOUT") {
          return (
            <div>
              <p className="font-medium">
                {(c.pageTitle as string) || "Sobre"}
              </p>
              {(c.featuredTitle as string) && (
                <p className="text-sm">{c.featuredTitle as string}</p>
              )}
            </div>
          );
        }
        const highlightTitle = (c.title as string) || "Destaque";
        const highlightDesc = c.description as string | undefined;
        return (
          <div>
            <p className="font-medium">{highlightTitle}</p>
            {highlightDesc && (
              <p className="text-sm text-muted-foreground">{highlightDesc}</p>
            )}
            {(c.buttonLabel as string) && (
              <p className="text-xs text-primary mt-2">
                Botão: {c.buttonLabel as string}
              </p>
            )}
          </div>
        );
      case "TEXT":
        if (c.variant === "WELCOME") {
          return (
            <div>
              <p className="font-medium">
                {(c.featuredTitle as string) || "Boas-vindas"}
              </p>
              <p className="text-sm text-muted-foreground">
                {(c.secondTitle as string) || "Sem subtítulo"}
              </p>
            </div>
          );
        }
        return (
          <p className="text-muted-foreground">
            {(c.text as string) || "Texto vazio"}
          </p>
        );
      case "DIVIDER":
        return <hr className="border-border" />;
      case "SOCIAL_ICONS":
        const icons = (c.icons as Array<{ platform: string }>) || [];
        return (
          <div className="flex items-center gap-2">
            {icons.slice(0, 4).map((icon, index) => (
              <span
                key={`${icon.platform}-${index}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted/40"
              >
                <SocialIcon platform={icon.platform} className="h-3.5 w-3.5" />
              </span>
            ))}
            <p className="text-muted-foreground text-sm">
              {icons.length} rede(s) configurada(s)
            </p>
          </div>
        );
      case "CATALOG":
        const items =
          (c.items as Array<{ name?: string; price?: string }>) || [];
        return (
          <div>
            <p className="font-medium">{(c.title as string) || "Coleção"}</p>
            <p className="text-sm text-muted-foreground">
              {items.length} item(ns) nesta seção
            </p>
            {items[0] && (
              <p className="text-sm text-muted-foreground">
                Primeiro item: {items[0].name || "Sem nome"}
                {items[0].price ? ` • ${items[0].price}` : ""}
              </p>
            )}
          </div>
        );
      case "MEDIA":
        return (
          <p className="text-muted-foreground">
            {c.mediaType as string}: {(c.embedUrl as string) || "Sem URL"}
          </p>
        );
      default:
        return <p className="text-muted-foreground">Módulo {type}</p>;
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">{renderPreview()}</div>
      <Button variant="ghost" size="sm" onClick={onEdit}>
        <Pencil className="h-4 w-4 mr-1" />
        Editar
      </Button>
    </div>
  );
}

interface BlockEditFormProps {
  type: BlockType;
  content: unknown;
  onChange: (content: unknown) => void;
  onSave: () => void;
  onCancel: () => void;
}

function BlockEditForm({
  type,
  content,
  onChange,
  onSave,
  onCancel,
}: BlockEditFormProps) {
  const c = content as Record<string, unknown>;

  const updateField = (field: string, value: unknown) => {
    onChange({ ...c, [field]: value });
  };

  const renderForm = () => {
    switch (type) {
      case "LINK":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Título (obrigatório)
              </label>
              <Input
                value={(c.label as string) || ""}
                onChange={(e) => updateField("label", e.target.value)}
                placeholder="Meu link"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                URL (obrigatória)
              </label>
              <Input
                value={(c.url as string) || ""}
                onChange={(e) => updateField("url", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Thumbnail
              </label>
              <div className="flex gap-2 mb-2">
                {[
                  { id: "none", label: "Sem" },
                  { id: "emoji", label: "Emoji" },
                  { id: "image", label: "Imagem" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => updateField("thumbnailType", option.id)}
                    className={`px-3 py-1.5 rounded-md text-sm border ${
                      (c.thumbnailType as string | undefined) === option.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {(c.thumbnailType as string) === "emoji" && (
                <Input
                  value={(c.thumbnailValue as string) || ""}
                  onChange={(e) =>
                    updateField("thumbnailValue", e.target.value)
                  }
                  placeholder="😀"
                />
              )}
              {(c.thumbnailType as string) === "image" && (
                <div className="mt-2 text-sm max-w-[240px]">
                  <ImageUpload
                    value={(c.thumbnailValue as string) || ""}
                    onChange={(url) => updateField("thumbnailValue", url)}
                    placeholder="Miniatura (opcional)"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Estilo</label>
              <div className="flex gap-2">
                {["default", "outline", "gradient"].map((style) => (
                  <button
                    key={style}
                    onClick={() => updateField("style", style)}
                    className={`px-3 py-1.5 rounded-md text-sm border ${
                      c.style === style
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border"
                    }`}
                  >
                    {style === "default"
                      ? "Padrão"
                      : style === "outline"
                        ? "Contorno"
                        : "Gradiente"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "HIGHLIGHT":
        if (c.variant === "ABOUT") {
          return (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Page title
                </label>
                <Input
                  value={(c.pageTitle as string) || ""}
                  onChange={(e) => updateField("pageTitle", e.target.value)}
                  placeholder="Sobre"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Featured title (opcional)
                </label>
                <Input
                  value={(c.featuredTitle as string) || ""}
                  onChange={(e) => updateField("featuredTitle", e.target.value)}
                  placeholder="Título em destaque"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Descrição completa
                </label>
                <textarea
                  value={(c.description as string) || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Conte sua história..."
                  className="w-full min-h-[90px] rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Imagem</label>
                <div className="max-w-[240px]">
                  <ImageUpload
                    value={(c.image as string) || ""}
                    onChange={(url) => updateField("image", url)}
                    placeholder="Imagem de destaque"
                  />
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Título</label>
              <Input
                value={(c.title as string) || ""}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Título do destaque"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Descrição
              </label>
              <textarea
                value={(c.description as string) || ""}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Descrição opcional..."
                className="w-full min-h-[60px] rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Label do botão
              </label>
              <Input
                value={(c.buttonLabel as string) || ""}
                onChange={(e) => updateField("buttonLabel", e.target.value)}
                placeholder="Saiba mais"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                URL do botão
              </label>
              <Input
                value={(c.buttonUrl as string) || ""}
                onChange={(e) => updateField("buttonUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        );

      case "TEXT":
        if (c.variant === "WELCOME") {
          return (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Foto de perfil
                </label>
                <div className="max-w-[240px]">
                  <ImageUpload
                    value={(c.profilePhoto as string) || ""}
                    onChange={(url) => updateField("profilePhoto", url)}
                    placeholder="Sua foto de perfil"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Display name
                </label>
                <Input
                  value={(c.displayName as string) || ""}
                  onChange={(e) => updateField("displayName", e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Featured title
                </label>
                <Input
                  value={(c.featuredTitle as string) || ""}
                  onChange={(e) => updateField("featuredTitle", e.target.value)}
                  placeholder="Título principal"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Second title
                </label>
                <Input
                  value={(c.secondTitle as string) || ""}
                  onChange={(e) => updateField("secondTitle", e.target.value)}
                  placeholder="Subtítulo"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={(c.ctaText as string) || ""}
                  onChange={(e) => updateField("ctaText", e.target.value)}
                  placeholder="Texto CTA"
                />
                <Input
                  value={(c.ctaLink as string) || ""}
                  onChange={(e) => updateField("ctaLink", e.target.value)}
                  placeholder="Link CTA"
                />
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Texto</label>
              <textarea
                value={(c.text as string) || ""}
                onChange={(e) => updateField("text", e.target.value)}
                placeholder="Seu texto aqui..."
                className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Alinhamento
              </label>
              <div className="flex gap-2">
                {["left", "center", "right"].map((align) => (
                  <button
                    key={align}
                    onClick={() => updateField("align", align)}
                    className={`px-3 py-1.5 rounded-md text-sm border ${
                      c.align === align
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border"
                    }`}
                  >
                    {align === "left"
                      ? "Esquerda"
                      : align === "center"
                        ? "Centro"
                        : "Direita"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "SOCIAL_ICONS": {
        const platforms = [
          "facebook",
          "instagram",
          "x",
          "youtube",
          "linkedin",
          "whatsapp",
          "behance",
          "dribbble",
          "medium",
          "twitch",
          "tiktok",
          "vimeo",
        ];

        const icons =
          (c.icons as Array<{ platform: string; url: string }>) || [];
        const iconsMap = Object.fromEntries(
          icons.map((icon) => [icon.platform.toLowerCase(), icon.url]),
        );

        const setPlatformUrl = (platform: string, url: string) => {
          const nextMap = { ...iconsMap, [platform]: url.trim() };
          const nextIcons = Object.entries(nextMap)
            .filter(([, value]) => Boolean(value))
            .map(([key, value]) => ({ platform: key, url: value as string }));
          updateField("icons", nextIcons);
        };

        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Preencha os links das plataformas que deseja exibir.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {platforms.map((platform) => (
                <div key={platform}>
                  <label className="text-xs uppercase text-muted-foreground mb-1 block">
                    {platform}
                  </label>
                  <Input
                    value={iconsMap[platform] || ""}
                    onChange={(e) => setPlatformUrl(platform, e.target.value)}
                    placeholder={`https://${platform}.com/...`}
                  />
                  {iconsMap[platform] &&
                  !/^https?:\/\/.+/.test(iconsMap[platform]) ? (
                    <p className="text-[11px] text-destructive mt-1">
                      URL inválida
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "MEDIA":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Tipo</label>
              <div className="flex gap-2 flex-wrap">
                {["youtube", "spotify", "vimeo", "soundcloud"].map(
                  (mediaType) => (
                    <button
                      key={mediaType}
                      onClick={() => updateField("mediaType", mediaType)}
                      className={`px-3 py-1.5 rounded-md text-sm border capitalize ${
                        c.mediaType === mediaType
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border"
                      }`}
                    >
                      {mediaType}
                    </button>
                  ),
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                URL do embed
              </label>
              <Input
                value={(c.embedUrl as string) || ""}
                onChange={(e) => updateField("embedUrl", e.target.value)}
                placeholder="Cole o link do vídeo ou música..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Suporte recomendado: YouTube, Spotify, Vimeo e SoundCloud com
                URL completa.
              </p>
            </div>
          </div>
        );

      case "CATALOG":
        const MAX_CATALOG_ITEMS = 5;
        const catalogTitle = (c.title as string) || "";
        const catalogDescription = (c.description as string) || "";
        const catalogItems =
          (c.items as Array<{
            id: string;
            name: string;
            description?: string;
            price?: string;
            image?: string;
            url?: string;
          }>) || [];

        const updateCatalogItem = (
          id: string,
          field: "name" | "description" | "price" | "image" | "url",
          value: string,
        ) => {
          const nextItems = catalogItems.map((item) =>
            item.id === id ? { ...item, [field]: value } : item,
          );
          updateField("items", nextItems);
        };

        const addCatalogItem = () => {
          if (catalogItems.length >= MAX_CATALOG_ITEMS) return;
          updateField("items", [
            ...catalogItems,
            { id: crypto.randomUUID(), name: "", description: "", price: "", image: "", url: "" },
          ]);
        };

        const removeCatalogItem = (id: string) => {
          updateField("items", catalogItems.filter((item) => item.id !== id));
        };

        return (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Nome da seção
                </label>
                <Input
                  value={catalogTitle}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Ex: Portfólio, Agenda, Produtos"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Descrição da seção
                </label>
                <Input
                  value={catalogDescription}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Texto curto opcional"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Itens da seção</label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {catalogItems.length}/{MAX_CATALOG_ITEMS} itens
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCatalogItem}
                disabled={catalogItems.length >= MAX_CATALOG_ITEMS}
              >
                Adicionar item
              </Button>
            </div>

            {catalogItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                Nenhum item ainda. Adicione o primeiro card desta seção.
              </p>
            ) : (
              <div className="space-y-4">
                {catalogItems.map((item, index) => (
                  <div key={item.id} className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Item {index + 1}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive h-7 px-2 text-xs"
                        onClick={() => removeCatalogItem(item.id)}
                      >
                        Remover
                      </Button>
                    </div>

                    {/* Name + Price row */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground block">
                          Nome <span className="text-destructive">*</span>
                        </label>
                        <Input
                          value={item.name || ""}
                          onChange={(e) => updateCatalogItem(item.id, "name", e.target.value)}
                          placeholder="Ex: Projeto A, Sessão 01, Serviço premium"
                        />
                        <p className="text-xs text-muted-foreground">Título do item</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground block">Preço ou valor</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none select-none">
                            R$
                          </span>
                          <Input
                            value={(item.price || "").replace(/^R\$\s*/, "")}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/^R\$\s*/, "");
                              updateCatalogItem(item.id, "price", raw ? `R$ ${raw}` : "");
                            }}
                            placeholder="49,90"
                            className="pl-8"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Opcional. Use quando fizer sentido.</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground block">Descrição</label>
                      <textarea
                        value={item.description || ""}
                        onChange={(e) => updateCatalogItem(item.id, "description", e.target.value)}
                        placeholder="Descrição curta do item"
                        className="w-full min-h-[60px] rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <p className="text-xs text-muted-foreground">
                        Texto complementar para contexto
                      </p>
                    </div>

                    {/* Image */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground block">Imagem</label>
                      <ImageUpload
                        value={item.image || ""}
                        onChange={(url) => updateCatalogItem(item.id, "image", url)}
                        placeholder="Capa do item"
                      />
                      <p className="text-xs text-muted-foreground">
                        Opcional. Pode ser foto, arte, capa ou thumbnail.
                      </p>
                    </div>

                    {/* Destination URL */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground block">
                        URL de destino
                      </label>
                      <Input
                        value={item.url || ""}
                        onChange={(e) => updateCatalogItem(item.id, "url", e.target.value)}
                        placeholder="https://..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Link opcional para abrir detalhes, compra ou agendamento
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "DIVIDER":
        return (
          <div>
            <label className="text-sm font-medium mb-1 block">Estilo</label>
            <div className="flex gap-2">
              {["line", "dots", "space"].map((style) => (
                <button
                  key={style}
                  onClick={() => updateField("style", style)}
                  className={`px-3 py-1.5 rounded-md text-sm border ${
                    c.style === style
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border"
                  }`}
                >
                  {style === "line"
                    ? "Linha"
                    : style === "dots"
                      ? "Pontos"
                      : "Espaço"}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <p className="text-muted-foreground">
            Editor não disponível para este módulo.
          </p>
        );
    }
  };

  const isLink = type === "LINK";
  const isMedia = type === "MEDIA";
  const isSocial = type === "SOCIAL_ICONS";
  const isHighlight = type === "HIGHLIGHT";

  const linkLabel = ((c.label as string) || "").trim();
  const linkUrl = ((c.url as string) || "").trim();
  const linkIsValid = !isLink || Boolean(linkLabel) || false;
  const linkUrlIsValid = !isLink || isValidHttpUrlLike(linkUrl);

  const mediaUrl = ((c.embedUrl as string) || "").trim();
  const mediaUrlIsValid =
    !isMedia || mediaUrl.length === 0 || isValidHttpUrlLike(mediaUrl);

  const socialLinks =
    (c.icons as Array<{ platform: string; url: string }>) || [];
  const socialUrlsAreValid =
    !isSocial || socialLinks.every((icon) => isValidHttpUrlLike(icon.url || ""));
  const highlightButtonLabel = ((c.buttonLabel as string) || "").trim();
  const highlightButtonUrl = ((c.buttonUrl as string) || "").trim();
  const highlightButtonIsValid =
    !isHighlight ||
    ((!highlightButtonLabel && !highlightButtonUrl) ||
      (Boolean(highlightButtonLabel) && isValidHttpUrlLike(highlightButtonUrl)));

  const canSave =
    linkIsValid &&
    linkUrlIsValid &&
    mediaUrlIsValid &&
    socialUrlsAreValid &&
    highlightButtonIsValid;

  return (
    <div className="space-y-4">
      {renderForm()}
      {isLink && !canSave && (
        <p className="text-xs text-destructive">
          Preencha título e uma URL válida para salvar o link.
        </p>
      )}
      {isMedia && !mediaUrlIsValid && (
        <p className="text-xs text-destructive">
          Use uma URL válida para o embed de mídia.
        </p>
      )}
      {isSocial && !socialUrlsAreValid && (
        <p className="text-xs text-destructive">
          Todos os links de redes sociais precisam ser URLs válidas.
        </p>
      )}
      {isHighlight && !highlightButtonIsValid && (
        <p className="text-xs text-destructive">
          Para usar o botão do destaque, preencha um label e uma URL válida.
        </p>
      )}
      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancelar
        </Button>
        <Button
          variant="gradient"
          size="sm"
          onClick={onSave}
          disabled={!canSave}
        >
          <Check className="h-4 w-4 mr-1" />
          Salvar
        </Button>
      </div>
    </div>
  );
}

function normalizeBlockContent(type: BlockType, content: unknown) {
  const current = content as Record<string, unknown>;

  switch (type) {
    case "LINK":
      return {
        ...current,
        url: ensureUrlProtocol((current.url as string) || ""),
      };

    case "HIGHLIGHT":
      return {
        ...current,
        buttonUrl: ensureUrlProtocol((current.buttonUrl as string) || ""),
      };

    case "MEDIA":
      return {
        ...current,
        embedUrl: ensureUrlProtocol((current.embedUrl as string) || ""),
      };

    case "SOCIAL_ICONS":
      return {
        ...current,
        icons: ((current.icons as Array<{ platform: string; url: string }>) || []).map(
          (icon) => ({
            ...icon,
            url: ensureUrlProtocol(icon.url || ""),
          }),
        ),
      };

    case "CATALOG":
      return {
        ...current,
        items: ((current.items as Array<Record<string, unknown>>) || []).map((item) => ({
          ...item,
          url: ensureUrlProtocol((item.url as string) || ""),
        })),
      };

    default:
      return current;
  }
}
