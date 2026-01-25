"use client";

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
import type { BlockType, LinkBlockContent } from "@/types/blocks";

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

        <div className="flex items-center gap-1">
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
            <div className="flex-1">
              <p className="font-medium">{linkLabel}</p>
              <p className="text-sm text-muted-foreground truncate">
                {linkUrl}
              </p>
            </div>
          </div>
        );
      case "HIGHLIGHT":
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
                Texto do botão
              </label>
              <Input
                value={(c.label as string) || ""}
                onChange={(e) => updateField("label", e.target.value)}
                placeholder="Meu link"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">URL</label>
              <Input
                value={(c.url as string) || ""}
                onChange={(e) => updateField("url", e.target.value)}
                placeholder="https://..."
              />
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
            </div>
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
            Editor não disponível para este tipo de bloco.
          </p>
        );
    }
  };

  return (
    <div className="space-y-4">
      {renderForm()}
      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancelar
        </Button>
        <Button variant="gradient" size="sm" onClick={onSave}>
          <Check className="h-4 w-4 mr-1" />
          Salvar
        </Button>
      </div>
    </div>
  );
}
