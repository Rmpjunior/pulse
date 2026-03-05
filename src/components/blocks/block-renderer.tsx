"use client";

import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import type { BlockType } from "@/types/blocks";

interface BlockRendererProps {
  block: {
    id: string;
    type: BlockType;
    content: unknown;
  };
  onBlockClick?: (blockId: string) => void;
}

export function BlockRenderer({ block, onBlockClick }: BlockRendererProps) {
  const content = block.content as Record<string, unknown>;

  const handleClick = () => {
    if (onBlockClick) {
      onBlockClick(block.id);
    }
  };

  switch (block.type) {
    case "LINK":
      const linkStyle = (content.style as string) || "default";
      const linkClasses = {
        default: "bg-card border border-border hover:border-primary/50",
        outline: "bg-transparent border-2 border-primary hover:bg-primary/10",
        gradient: "gradient-primary text-white border-0",
      };

      return (
        <a
          href={(content.url as string) || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className={`block w-full p-4 rounded-xl hover:shadow-lg transition-all duration-200 group ${linkClasses[linkStyle as keyof typeof linkClasses]}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {(content.thumbnailType as string) === "emoji" && (content.thumbnailValue as string) ? (
                <span className="text-lg">{content.thumbnailValue as string}</span>
              ) : (content.thumbnailType as string) === "image" && (content.thumbnailValue as string) ? (
                <Image
                  src={content.thumbnailValue as string}
                  alt="Thumbnail"
                  width={28}
                  height={28}
                  unoptimized
                  className="h-7 w-7 rounded object-cover"
                />
              ) : null}
              <span className="font-medium truncate">
                {(content.label as string) || "Link"}
              </span>
            </div>
            <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </a>
      );

    case "HIGHLIGHT":
      const highlightImage = content.image as string | undefined;
      const highlightUrl = content.url as string | undefined;
      const highlightDescription = content.description as string | undefined;

      return (
        <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 border border-border">
          {highlightImage && (
            <Image
              src={highlightImage}
              alt={(content.title as string) || ""}
              width={640}
              height={160}
              unoptimized
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
          )}
          <h3 className="font-semibold text-lg">
            {(content.title as string) || "Destaque"}
          </h3>
          {highlightDescription && (
            <p className="text-sm text-muted-foreground mt-2">
              {highlightDescription}
            </p>
          )}
          {highlightUrl && (
            <a
              href={highlightUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="inline-flex items-center gap-1 text-sm text-primary mt-3 hover:underline"
            >
              Saiba mais
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      );

    case "TEXT":
      const textAlign = (content.align as string) || "center";
      const alignClasses = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      };

      return (
        <div
          className={`py-3 ${alignClasses[textAlign as keyof typeof alignClasses]}`}
        >
          <p className="text-muted-foreground whitespace-pre-wrap">
            {(content.text as string) || ""}
          </p>
        </div>
      );

    case "DIVIDER":
      const dividerStyle = (content.style as string) || "line";

      if (dividerStyle === "space") {
        return <div className="h-6" />;
      }

      if (dividerStyle === "dots") {
        return (
          <div className="flex justify-center gap-2 py-4">
            <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          </div>
        );
      }

      return <hr className="border-border my-4" />;

    case "MEDIA":
      const mediaType = content.mediaType as string;
      const embedUrl = content.embedUrl as string;

      if (!embedUrl) {
        return (
          <div className="p-8 rounded-xl bg-muted/50 border border-dashed border-border text-center">
            <Play className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Mídia não configurada
            </p>
          </div>
        );
      }

      // Extract embed ID and create proper embed URL
      const getEmbedSrc = () => {
        if (mediaType === "youtube") {
          const videoId = extractYouTubeId(embedUrl);
          return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }
        if (mediaType === "spotify") {
          // Handle Spotify URLs
          if (embedUrl.includes("open.spotify.com")) {
            return embedUrl.replace(
              "open.spotify.com",
              "open.spotify.com/embed",
            );
          }
          return embedUrl;
        }
        if (mediaType === "vimeo") {
          const vimeoId = embedUrl.match(/vimeo\.com\/(\d+)/)?.[1];
          return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : null;
        }
        return null;
      };

      const embedSrc = getEmbedSrc();

      if (!embedSrc) {
        return (
          <div className="p-8 rounded-xl bg-muted/50 border border-border text-center">
            <p className="text-sm text-muted-foreground">
              URL inválida para {mediaType}
            </p>
          </div>
        );
      }

      return (
        <div className="rounded-xl overflow-hidden aspect-video">
          <iframe
            src={embedSrc}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );

    case "SOCIAL_ICONS":
      const icons =
        (content.icons as Array<{ platform: string; url: string }>) || [];

      if (icons.length === 0) {
        return (
          <div className="flex justify-center gap-4 py-4">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
              +
            </div>
          </div>
        );
      }

      return (
        <div className="flex justify-center gap-4 py-4">
          {icons.map((icon, i) => (
            <a
              key={i}
              href={icon.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors"
            >
              <span className="text-xs font-medium uppercase">
                {icon.platform.slice(0, 2)}
              </span>
            </a>
          ))}
        </div>
      );

    case "CATALOG":
      const items =
        (content.items as Array<{
          id?: string;
          name?: string;
          description?: string;
          price?: string;
          image?: string;
          url?: string;
        }>) || [];

      if (items.length === 0) {
        return (
          <div className="p-4 rounded-xl bg-muted/50 border border-dashed border-border text-center">
            <p className="text-sm text-muted-foreground">Catálogo vazio</p>
          </div>
        );
      }

      return (
        <div className="space-y-3">
          {items.map((item, i) => {
            const card = (
              <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors">
                <div className="flex gap-3">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name || `Item ${i + 1}`}
                      width={64}
                      height={64}
                      unoptimized
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">
                      {item.name || `Item ${i + 1}`}
                    </p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    )}
                    {item.price && (
                      <p className="text-sm font-semibold text-primary mt-2">
                        {item.price}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );

            if (!item.url) {
              return <div key={item.id || i}>{card}</div>;
            }

            return (
              <a
                key={item.id || i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="block"
              >
                {card}
              </a>
            );
          })}
        </div>
      );

    case "FORM":
      const title = (content.title as string) || "Formulário";
      const submitLabel = (content.submitLabel as string) || "Enviar";
      const fields =
        (content.fields as Array<{
          id?: string;
          label?: string;
          type?: "text" | "email" | "textarea";
          required?: boolean;
        }>) || [];

      if (fields.length === 0) {
        return (
          <div className="p-4 rounded-xl bg-muted/50 border border-dashed border-border text-center">
            <p className="text-sm text-muted-foreground">Formulário vazio</p>
          </div>
        );
      }

      return (
        <form className="space-y-3 p-4 rounded-xl bg-card border border-border">
          <p className="font-semibold">{title}</p>
          {fields.map((field, index) => {
            const fieldLabel = field.label || `Campo ${index + 1}`;
            const commonProps = {
              placeholder: fieldLabel,
              required: Boolean(field.required),
              className:
                "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
            };

            return (
              <div key={field.id || index} className="space-y-1">
                <label className="text-sm font-medium">
                  {fieldLabel}
                  {field.required ? " *" : ""}
                </label>
                {field.type === "textarea" ? (
                  <textarea {...commonProps} rows={3} />
                ) : (
                  <input
                    {...commonProps}
                    type={field.type === "email" ? "email" : "text"}
                  />
                )}
              </div>
            );
          })}
          <button
            type="button"
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {submitLabel}
          </button>
        </form>
      );

    default:
      return (
        <div className="p-4 rounded-xl bg-muted/50 border border-dashed border-border text-center">
          <p className="text-sm text-muted-foreground">Bloco {block.type}</p>
        </div>
      );
  }
}

// Helper to extract YouTube video ID
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}
