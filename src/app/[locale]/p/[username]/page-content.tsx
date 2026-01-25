"use client";

import { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { Sparkles, ExternalLink } from "lucide-react";
import {
  themePresets,
  fontOptions,
  buttonStyleOptions,
  defaultThemeSettings,
  type ThemeSettings,
  type ThemeColors,
} from "@/types/theme";

interface Block {
  id: string;
  type: string;
  order: number;
  visible: boolean;
  content: unknown;
}

interface PageData {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatar: string | null;
  theme: unknown;
  blocks: Block[];
}

interface PublicPageContentProps {
  page: PageData;
  showWatermark: boolean;
}

export function PublicPageContent({
  page,
  showWatermark,
}: PublicPageContentProps) {
  const themeSettings: ThemeSettings =
    (page.theme as ThemeSettings) || defaultThemeSettings;
  const preset =
    themePresets.find((p) => p.id === themeSettings.presetId) ||
    themePresets[0];
  const colors: ThemeColors = themeSettings.customColors || preset.colors;
  const fontClass =
    fontOptions.find((f) => f.id === themeSettings.font)?.className ||
    "font-sans";
  const buttonRadius =
    buttonStyleOptions.find((b) => b.id === themeSettings.buttonStyle)
      ?.borderRadius || "0.75rem";

  const handleBlockClick = async (blockId: string) => {
    try {
      await fetch("/api/analytics/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockId }),
      });
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  const containerStyle: CSSProperties = {
    backgroundColor: colors.background,
    color: colors.text,
    minHeight: "100vh",
  };

  return (
    <div style={containerStyle} className={fontClass}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: colors.accent }}
        />
      </div>

      <div className="relative max-w-md mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {page.avatar ? (
            <img
              src={page.avatar}
              alt={page.displayName || page.username}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              style={{
                boxShadow: `0 0 0 4px ${colors.background}, 0 0 0 6px ${colors.primary}40`,
              }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                boxShadow: `0 0 0 4px ${colors.background}, 0 0 0 6px ${colors.primary}40`,
              }}
            >
              <span className="text-3xl font-bold text-white">
                {(page.displayName || page.username)[0]?.toUpperCase()}
              </span>
            </div>
          )}

          <h1 className="text-xl font-bold" style={{ color: colors.text }}>
            {page.displayName || `@${page.username}`}
          </h1>

          {page.bio && (
            <p
              className="mt-2 text-sm max-w-xs mx-auto opacity-70"
              style={{ color: colors.text }}
            >
              {page.bio}
            </p>
          )}
        </div>

        {/* Blocks */}
        <div className="space-y-3">
          {page.blocks.map((block) => (
            <ThemedBlock
              key={block.id}
              block={block}
              colors={colors}
              buttonRadius={buttonRadius}
              onBlockClick={handleBlockClick}
            />
          ))}
        </div>

        {/* Watermark */}
        {showWatermark && (
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: colors.text }}
            >
              <Sparkles className="h-3 w-3" />
              Feito com Pulse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

interface ThemedBlockProps {
  block: Block;
  colors: ThemeColors;
  buttonRadius: string;
  onBlockClick: (blockId: string) => void;
}

function ThemedBlock({
  block,
  colors,
  buttonRadius,
  onBlockClick,
}: ThemedBlockProps) {
  const content = block.content as Record<string, unknown>;

  const handleClick = () => {
    onBlockClick(block.id);
  };

  switch (block.type) {
    case "LINK":
      const linkStyle = (content.style as string) || "default";
      const linkStyles: Record<string, CSSProperties> = {
        default: {
          backgroundColor: `${colors.primary}15`,
          borderColor: `${colors.primary}40`,
          borderWidth: "1px",
          borderStyle: "solid",
          color: colors.text,
          borderRadius: buttonRadius,
        },
        outline: {
          backgroundColor: "transparent",
          borderColor: colors.primary,
          borderWidth: "2px",
          borderStyle: "solid",
          color: colors.primary,
          borderRadius: buttonRadius,
        },
        gradient: {
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
          color: "#fff",
          borderRadius: buttonRadius,
        },
      };

      return (
        <a
          href={(content.url as string) || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block w-full p-4 transition-all hover:scale-[1.02] hover:shadow-lg"
          style={linkStyles[linkStyle] || linkStyles.default}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {(content.label as string) || "Link"}
            </span>
            <ExternalLink className="h-4 w-4 opacity-50" />
          </div>
        </a>
      );

    case "HIGHLIGHT":
      const highlightImage = content.image as string | undefined;
      const highlightUrl = content.url as string | undefined;
      const highlightDescription = content.description as string | undefined;

      return (
        <div
          className="p-5"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
            borderColor: `${colors.primary}30`,
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: buttonRadius,
          }}
        >
          {highlightImage && (
            <img
              src={highlightImage}
              alt={(content.title as string) || ""}
              className="w-full h-40 object-cover mb-4"
              style={{ borderRadius: buttonRadius }}
            />
          )}
          <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
            {(content.title as string) || "Destaque"}
          </h3>
          {highlightDescription && (
            <p
              className="text-sm mt-2 opacity-70"
              style={{ color: colors.text }}
            >
              {highlightDescription}
            </p>
          )}
          {highlightUrl && (
            <a
              href={highlightUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="inline-flex items-center gap-1 text-sm mt-3 hover:underline"
              style={{ color: colors.primary }}
            >
              Saiba mais
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      );

    case "TEXT":
      const textAlign =
        (content.align as "left" | "center" | "right") || "center";
      return (
        <div className="py-3" style={{ textAlign, color: colors.text }}>
          <p className="opacity-70 whitespace-pre-wrap">
            {(content.text as string) || ""}
          </p>
        </div>
      );

    case "DIVIDER":
      const dividerStyle = (content.style as string) || "line";
      if (dividerStyle === "space") return <div className="h-6" />;
      if (dividerStyle === "dots") {
        return (
          <div className="flex justify-center gap-2 py-4">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: `${colors.text}30` }}
            />
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: `${colors.text}30` }}
            />
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: `${colors.text}30` }}
            />
          </div>
        );
      }
      return (
        <hr className="my-4" style={{ borderColor: `${colors.text}20` }} />
      );

    case "MEDIA":
      const mediaType = content.mediaType as string;
      const embedUrl = content.embedUrl as string;

      if (!embedUrl) {
        return (
          <div
            className="p-8 text-center opacity-50"
            style={{
              backgroundColor: `${colors.primary}10`,
              borderRadius: buttonRadius,
              color: colors.text,
            }}
          >
            <p className="text-sm">Mídia não configurada</p>
          </div>
        );
      }

      const getEmbedSrc = () => {
        if (mediaType === "youtube") {
          const videoId = embedUrl.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
          )?.[1];
          return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }
        if (mediaType === "spotify") {
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
          <div
            className="p-8 text-center"
            style={{
              backgroundColor: `${colors.primary}10`,
              borderRadius: buttonRadius,
              color: colors.text,
            }}
          >
            <p className="text-sm">URL inválida para {mediaType}</p>
          </div>
        );
      }

      return (
        <div
          className="aspect-video overflow-hidden"
          style={{ borderRadius: buttonRadius }}
        >
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
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `${colors.primary}20`,
                color: colors.primary,
              }}
            >
              <span className="text-xs">+</span>
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
              className="h-10 w-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{
                backgroundColor: `${colors.primary}20`,
                color: colors.primary,
              }}
            >
              <span className="text-xs font-medium uppercase">
                {icon.platform.slice(0, 2)}
              </span>
            </a>
          ))}
        </div>
      );

    default:
      return (
        <div
          className="p-4 text-center border border-dashed"
          style={{
            borderColor: `${colors.text}30`,
            borderRadius: buttonRadius,
            color: colors.text,
          }}
        >
          <p className="text-sm opacity-50">Bloco {block.type}</p>
        </div>
      );
  }
}
