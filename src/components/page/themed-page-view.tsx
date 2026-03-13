"use client";

import Image from "next/image";
import { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { ExternalLink, Sparkles } from "lucide-react";
import {
  themePresets,
  fontOptions,
  buttonStyleOptions,
  defaultThemeSettings,
  type ThemeSettings,
  type ThemeColors,
} from "@/types/theme";
import { SocialIcon } from "@/components/ui/social-icon";

interface ThemedPageBlock {
  id: string;
  type: string;
  visible: boolean;
  content: unknown;
}

interface ThemedPageViewProps {
  settings?: ThemeSettings | null;
  displayName?: string | null;
  username?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  blocks: ThemedPageBlock[];
  showWatermark?: boolean;
  onBlockClick?: (blockId: string) => void;
  fullHeight?: boolean;
}

export function resolveThemeAppearance(settings?: ThemeSettings | null): {
  colors: ThemeColors;
  fontClass: string;
  buttonRadius: string;
} {
  const resolvedSettings = settings || defaultThemeSettings;
  const preset =
    themePresets.find((item) => item.id === resolvedSettings.presetId) ||
    themePresets[0];
  const baseColors = resolvedSettings.customColors || preset.colors;
  const colors = resolvedSettings.darkMode
    ? { ...baseColors, background: "#0f172a", text: "#f1f5f9" }
    : baseColors;
  const fontClass =
    fontOptions.find((item) => item.id === resolvedSettings.font)?.className ||
    "font-sans";
  const buttonRadius =
    buttonStyleOptions.find((item) => item.id === resolvedSettings.buttonStyle)
      ?.borderRadius || "0.75rem";

  return { colors, fontClass, buttonRadius };
}

export function ThemedPageView({
  settings,
  displayName,
  username,
  bio,
  avatarUrl,
  blocks,
  showWatermark = false,
  onBlockClick,
  fullHeight = false,
}: ThemedPageViewProps) {
  const { colors, fontClass, buttonRadius } = resolveThemeAppearance(settings);
  const visibleBlocks = blocks.filter((block) => block.visible);
  const containerStyle: CSSProperties = {
    backgroundColor: colors.background,
    color: colors.text,
    minHeight: fullHeight ? "100vh" : "100%",
  };
  const heading = displayName || (username ? `@${username}` : "Seu Nome");

  return (
    <div style={containerStyle} className={`relative ${fontClass}`}>
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

      <main
        className="relative max-w-md mx-auto px-4 py-12"
        aria-label="Página pública"
      >
        <div className="text-center mb-8">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={heading}
              width={96}
              height={96}
              unoptimized
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
                {heading[0]?.toUpperCase() || "?"}
              </span>
            </div>
          )}

          <h1 className="text-xl font-bold" style={{ color: colors.text }}>
            {heading}
          </h1>

          {bio ? (
            <p
              className="mt-2 text-sm max-w-xs mx-auto opacity-70"
              style={{ color: colors.text }}
            >
              {bio}
            </p>
          ) : null}
        </div>

        <div className="space-y-3">
          {visibleBlocks.map((block) => (
            <ThemedBlock
              key={block.id}
              block={block}
              colors={colors}
              buttonRadius={buttonRadius}
              onBlockClick={onBlockClick}
            />
          ))}
        </div>

        {showWatermark ? (
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
        ) : null}
      </main>
    </div>
  );
}

interface ThemedBlockProps {
  block: {
    id: string;
    type: string;
    content: unknown;
  };
  colors: ThemeColors;
  buttonRadius: string;
  onBlockClick?: (blockId: string) => void;
}

function ThemedBlock({
  block,
  colors,
  buttonRadius,
  onBlockClick,
}: ThemedBlockProps) {
  const content = block.content as Record<string, unknown>;

  const handleClick = () => {
    onBlockClick?.(block.id);
  };

  switch (block.type) {
    case "LINK": {
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
          href={normalizeExternalUrl((content.url as string) || "#")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block w-full p-4 transition-all hover:scale-[1.02] hover:shadow-lg"
          style={linkStyles[linkStyle] || linkStyles.default}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {(content.thumbnailType as string) === "emoji" &&
              (content.thumbnailValue as string) ? (
                <span className="text-lg">{content.thumbnailValue as string}</span>
              ) : (content.thumbnailType as string) === "image" &&
                (content.thumbnailValue as string) ? (
                <Image
                  src={content.thumbnailValue as string}
                  alt="Miniatura"
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
            <ExternalLink className="h-4 w-4 opacity-50" />
          </div>
        </a>
      );
    }

    case "HIGHLIGHT": {
      if (content.variant === "ABOUT") {
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
            {(content.image as string) ? (
              <Image
                src={content.image as string}
                alt={(content.pageTitle as string) || "Sobre"}
                width={640}
                height={160}
                unoptimized
                className="w-full h-40 object-cover mb-4"
                style={{ borderRadius: buttonRadius }}
              />
            ) : null}
            <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
              {(content.pageTitle as string) || "Sobre"}
            </h3>
            {(content.featuredTitle as string) ? (
              <p className="text-sm mt-1" style={{ color: colors.text }}>
                {content.featuredTitle as string}
              </p>
            ) : null}
            {(content.description as string) ? (
              <p className="text-sm mt-2 opacity-70" style={{ color: colors.text }}>
                {content.description as string}
              </p>
            ) : null}
          </div>
        );
      }

      const highlightImage = content.image as string | undefined;
      const highlightButtonLabel = content.buttonLabel as string | undefined;
      const highlightButtonUrl = content.buttonUrl as string | undefined;
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
          {highlightImage ? (
            <Image
              src={highlightImage}
              alt={(content.title as string) || ""}
              width={640}
              height={160}
              unoptimized
              className="w-full h-40 object-cover mb-4"
              style={{ borderRadius: buttonRadius }}
            />
          ) : null}
          <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
            {(content.title as string) || "Destaque"}
          </h3>
          {highlightDescription ? (
            <p className="text-sm mt-2 opacity-70" style={{ color: colors.text }}>
              {highlightDescription}
            </p>
          ) : null}
          {highlightButtonLabel && highlightButtonUrl ? (
            <a
              href={normalizeExternalUrl(highlightButtonUrl)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="inline-flex items-center gap-1 text-sm mt-4 rounded-full px-4 py-2 font-medium transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: colors.primary,
                color: getContrastColor(colors.primary),
              }}
            >
              {highlightButtonLabel}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </div>
      );
    }

    case "TEXT": {
      if (content.variant === "WELCOME") {
        const ctaText = content.ctaText as string | undefined;
        const ctaLink = content.ctaLink as string | undefined;

        return (
          <div
            className="p-5 text-center"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
              borderColor: `${colors.primary}30`,
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: buttonRadius,
            }}
          >
            {(content.profilePhoto as string) ? (
              <Image
                src={content.profilePhoto as string}
                alt={(content.displayName as string) || "Boas-vindas"}
                width={64}
                height={64}
                unoptimized
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
              />
            ) : null}
            <p className="text-sm opacity-70" style={{ color: colors.text }}>
              {(content.displayName as string) || "Seu nome"}
            </p>
            <p className="text-lg font-semibold mt-1" style={{ color: colors.text }}>
              {(content.featuredTitle as string) || "Seu destaque"}
            </p>
            {(content.secondTitle as string) ? (
              <p className="text-sm opacity-70 mt-1" style={{ color: colors.text }}>
                {content.secondTitle as string}
              </p>
            ) : null}
            {ctaText && ctaLink ? (
              <a
                href={normalizeExternalUrl(ctaLink)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="inline-flex items-center gap-1 text-sm mt-3 hover:underline"
                style={{ color: colors.primary }}
              >
                {ctaText}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </div>
        );
      }

      const textAlign =
        (content.align as "left" | "center" | "right") || "center";

      return (
        <div className="py-3" style={{ textAlign, color: colors.text }}>
          <p className="opacity-70 whitespace-pre-wrap">
            {(content.text as string) || ""}
          </p>
        </div>
      );
    }

    case "DIVIDER": {
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

      return <hr className="my-4" style={{ borderColor: `${colors.text}20` }} />;
    }

    case "MEDIA": {
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

      const embedSrc = getEmbedSrc(mediaType, embedUrl);

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
            title={`Embed ${mediaType}`}
            loading="lazy"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    case "SOCIAL_ICONS": {
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
          {icons.map((icon, index) => (
            <a
              key={index}
              href={normalizeExternalUrl(icon.url)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir ${icon.platform}`}
              onClick={handleClick}
              className="h-10 w-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{
                backgroundColor: `${colors.primary}20`,
                color: colors.primary,
              }}
            >
              <SocialIcon platform={icon.platform} className="h-4 w-4" />
            </a>
          ))}
        </div>
      );
    }

    case "CATALOG": {
      const sectionTitle = (content.title as string) || "Coleção";
      const sectionDescription = content.description as string | undefined;
      const catalogItems =
        (content.items as Array<{
          id?: string;
          name?: string;
          description?: string;
          price?: string;
          image?: string;
          url?: string;
        }>) || [];

      if (catalogItems.length === 0) {
        return (
          <div
            className="p-4 text-center"
            style={{
              backgroundColor: `${colors.primary}10`,
              borderRadius: buttonRadius,
              color: colors.text,
              opacity: 0.5,
            }}
          >
            <p className="text-sm">{sectionTitle} vazia</p>
          </div>
        );
      }

      return (
        <div
          style={{
            backgroundColor: `${colors.primary}08`,
            borderColor: `${colors.primary}25`,
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: buttonRadius,
            padding: "0.875rem",
          }}
        >
          <div className="mb-3">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: colors.text, opacity: 0.45 }}
            >
              {sectionTitle}
            </p>
            {sectionDescription ? (
              <p
                className="mt-1 text-sm"
                style={{ color: colors.text, opacity: 0.68 }}
              >
                {sectionDescription}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            {catalogItems.map((item, index) => {
              const priceDisplay = item.price
                ? item.price.startsWith("R$")
                  ? item.price
                  : `R$ ${item.price}`
                : null;

              const card = (
                <div
                  style={{
                    backgroundColor: colors.background,
                    borderColor: `${colors.primary}20`,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderRadius: `calc(${buttonRadius} * 0.75)`,
                    padding: "0.75rem",
                  }}
                >
                  <div className="flex gap-3">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name || `Item ${index + 1}`}
                        width={60}
                        height={60}
                        unoptimized
                        className="object-cover shrink-0"
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: `calc(${buttonRadius} * 0.5)`,
                        }}
                      />
                    ) : (
                      <div
                        className="shrink-0"
                        style={{
                          width: 60,
                          height: 60,
                          backgroundColor: `${colors.primary}20`,
                          borderRadius: `calc(${buttonRadius} * 0.5)`,
                        }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm" style={{ color: colors.text }}>
                        {item.name || `Item ${index + 1}`}
                      </p>
                      {item.description ? (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: colors.text, opacity: 0.65 }}
                        >
                          {item.description}
                        </p>
                      ) : null}
                      {priceDisplay ? (
                        <p
                          className="text-sm font-bold mt-1"
                          style={{ color: colors.primary }}
                        >
                          {priceDisplay}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );

              if (!item.url) return <div key={item.id || index}>{card}</div>;

              return (
                <a
                  key={item.id || index}
                  href={normalizeExternalUrl(item.url)}
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
        </div>
      );
    }

    case "FORM":
      return null;

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
          <p className="text-sm opacity-50">Módulo {block.type}</p>
        </div>
      );
  }
}

function getEmbedSrc(mediaType: string, embedUrl: string) {
  if (mediaType === "youtube") {
    const videoId = embedUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    )?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  if (mediaType === "spotify") {
    return embedUrl.includes("open.spotify.com")
      ? embedUrl.replace("open.spotify.com", "open.spotify.com/embed")
      : embedUrl;
  }

  if (mediaType === "vimeo") {
    const vimeoId = embedUrl.match(/vimeo\.com\/(\d+)/)?.[1];
    return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : null;
  }

  return null;
}

function normalizeExternalUrl(url: string) {
  if (!url || url === "#") return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function getContrastColor(hexColor: string) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}
