"use client";

import Image from "next/image";
import { useState } from "react";
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
}: BlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(block.content);

  const handleSave = () => {
    onUpdate(block.id, editContent);
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
      CATALOG: "Catálogo",
      FORM: "Formulário",
    };
    return labels[type];
  };

  return (
    <div className={`border rounded-lg ${!block.visible ? "opacity-50" : ""}`}>
      {/* Header */}
      <div className="flex items-center gap-2 p-3 bg-muted/50 border-b">
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />

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
          <p className="text-muted-foreground">
            {icons.length} ícones configurados
          </p>
        );
      case "CATALOG":
        const items =
          (c.items as Array<{ name?: string; price?: string }>) || [];
        return (
          <div>
            <p className="font-medium">{items.length} item(ns) no catálogo</p>
            {items[0] && (
              <p className="text-sm text-muted-foreground">
                Primeiro item: {items[0].name || "Sem nome"}
                {items[0].price ? ` • ${items[0].price}` : ""}
              </p>
            )}
          </div>
        );
      case "FORM":
        const fields =
          (c.fields as Array<{ label?: string; required?: boolean }>) || [];
        return (
          <div>
            <p className="font-medium">{(c.title as string) || "Formulário"}</p>
            <p className="text-sm text-muted-foreground">
              {fields.length} campo(s) configurado(s)
            </p>
          </div>
        );
      case "MEDIA":
        return (
          <p className="text-muted-foreground">
            {c.mediaType as string}: {(c.embedUrl as string) || "Sem URL"}
          </p>
        );
      default:
        return <p className="text-muted-foreground">Bloco {type}</p>;
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
                URL (opcional)
              </label>
              <Input
                value={(c.url as string) || ""}
                onChange={(e) => updateField("url", e.target.value)}
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
          const nextItems = [
            ...catalogItems,
            {
              id: crypto.randomUUID(),
              name: "",
              description: "",
              price: "",
              image: "",
              url: "",
            },
          ];
          updateField("items", nextItems);
        };

        const removeCatalogItem = (id: string) => {
          updateField(
            "items",
            catalogItems.filter((item) => item.id !== id),
          );
        };

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Itens do catálogo</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCatalogItem}
              >
                Adicionar item
              </Button>
            </div>

            {catalogItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum item ainda. Adicione seu primeiro produto/serviço.
              </p>
            ) : (
              <div className="space-y-3">
                {catalogItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-lg border p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Item {index + 1}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeCatalogItem(item.id)}
                      >
                        Remover
                      </Button>
                    </div>
                    <Input
                      value={item.name || ""}
                      onChange={(e) =>
                        updateCatalogItem(item.id, "name", e.target.value)
                      }
                      placeholder="Nome do item"
                    />
                    <Input
                      value={item.price || ""}
                      onChange={(e) =>
                        updateCatalogItem(item.id, "price", e.target.value)
                      }
                      placeholder="Preço (ex: R$ 49,90)"
                    />
                    <textarea
                      value={item.description || ""}
                      onChange={(e) =>
                        updateCatalogItem(
                          item.id,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Descrição curta"
                      className="w-full min-h-[60px] rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground block">
                        Imagem
                      </label>
                      <ImageUpload
                        value={item.image || ""}
                        onChange={(url) =>
                          updateCatalogItem(item.id, "image", url)
                        }
                        placeholder="Imagem do item"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground block">
                        URL de destino
                      </label>
                      <Input
                        value={item.url || ""}
                        onChange={(e) =>
                          updateCatalogItem(item.id, "url", e.target.value)
                        }
                        placeholder="https://..."
                      />
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

      case "FORM":
        const fields =
          (c.fields as Array<{
            id: string;
            label: string;
            type: "text" | "email" | "textarea";
            required: boolean;
          }>) || [];

        const updateFormField = (
          id: string,
          patch: Partial<{
            label: string;
            type: "text" | "email" | "textarea";
            required: boolean;
          }>,
        ) => {
          updateField(
            "fields",
            fields.map((field) =>
              field.id === id ? { ...field, ...patch } : field,
            ),
          );
        };

        const addFormField = () => {
          updateField("fields", [
            ...fields,
            {
              id: crypto.randomUUID(),
              label: "",
              type: "text",
              required: false,
            },
          ]);
        };

        const removeFormField = (id: string) => {
          updateField(
            "fields",
            fields.filter((field) => field.id !== id),
          );
        };

        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Título do formulário
              </label>
              <Input
                value={(c.title as string) || ""}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Entre em contato"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Texto do botão enviar
              </label>
              <Input
                value={(c.submitLabel as string) || ""}
                onChange={(e) => updateField("submitLabel", e.target.value)}
                placeholder="Enviar"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Campos</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFormField}
              >
                Adicionar campo
              </Button>
            </div>

            {fields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum campo configurado.
              </p>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-lg border p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Campo {index + 1}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFormField(field.id)}
                      >
                        Remover
                      </Button>
                    </div>

                    <Input
                      value={field.label}
                      onChange={(e) =>
                        updateFormField(field.id, { label: e.target.value })
                      }
                      placeholder="Rótulo do campo"
                    />

                    <div className="flex gap-2 flex-wrap">
                      {(["text", "email", "textarea"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => updateFormField(field.id, { type })}
                          className={`px-3 py-1.5 rounded-md text-sm border ${
                            field.type === type
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border"
                          }`}
                        >
                          {type === "text"
                            ? "Texto"
                            : type === "email"
                              ? "E-mail"
                              : "Texto longo"}
                        </button>
                      ))}
                    </div>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateFormField(field.id, {
                            required: e.target.checked,
                          })
                        }
                      />
                      Campo obrigatório
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <p className="text-muted-foreground">
            Editor não disponível para este tipo de bloco.
          </p>
        );
    }
  };

  const isLink = type === "LINK";
  const isMedia = type === "MEDIA";
  const isSocial = type === "SOCIAL_ICONS";

  const linkLabel = ((c.label as string) || "").trim();
  const linkUrl = ((c.url as string) || "").trim();
  const linkIsValid = !isLink || Boolean(linkLabel) || false;
  const linkUrlIsValid = !isLink || /^https?:\/\/.+/.test(linkUrl);

  const mediaUrl = ((c.embedUrl as string) || "").trim();
  const mediaUrlIsValid =
    !isMedia || mediaUrl.length === 0 || /^https?:\/\/.+/.test(mediaUrl);

  const socialLinks =
    (c.icons as Array<{ platform: string; url: string }>) || [];
  const socialUrlsAreValid =
    !isSocial ||
    socialLinks.every((icon) => /^https?:\/\/.+/.test((icon.url || "").trim()));

  const canSave =
    linkIsValid && linkUrlIsValid && mediaUrlIsValid && socialUrlsAreValid;

  return (
    <div className="space-y-4">
      {renderForm()}
      {isLink && !canSave && (
        <p className="text-xs text-destructive">
          Preencha título e URL válida (http/https) para salvar o link.
        </p>
      )}
      {isMedia && !mediaUrlIsValid && (
        <p className="text-xs text-destructive">
          Use uma URL válida (http/https) para o embed de mídia.
        </p>
      )}
      {isSocial && !socialUrlsAreValid && (
        <p className="text-xs text-destructive">
          Todos os links de redes sociais precisam começar com http:// ou
          https://.
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
