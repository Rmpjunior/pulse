"use client";

import { CSSProperties } from "react";
import {
  themePresets,
  fontOptions,
  buttonStyleOptions,
  type ThemeSettings,
  type ThemeColors,
} from "@/types/theme";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import type { BlockType } from "@/types/blocks";

interface ThemedPreviewProps {
  settings: ThemeSettings;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  blocks: Array<{
    id: string;
    type: string;
    content: unknown;
    visible: boolean;
  }>;
}

export function ThemedPreview({
  settings,
  displayName,
  bio,
  avatarUrl,
  blocks,
}: ThemedPreviewProps) {
  const preset =
    themePresets.find((p) => p.id === settings.presetId) || themePresets[0];
  const colors: ThemeColors = settings.customColors || preset.colors;
  const fontClass =
    fontOptions.find((f) => f.id === settings.font)?.className || "font-sans";
  const buttonRadius =
    buttonStyleOptions.find((b) => b.id === settings.buttonStyle)
      ?.borderRadius || "0.75rem";

  const containerStyle: CSSProperties = {
    backgroundColor: colors.background,
    color: colors.text,
    "--theme-primary": colors.primary,
    "--theme-secondary": colors.secondary,
    "--theme-accent": colors.accent,
    "--theme-button-radius": buttonRadius,
  } as CSSProperties;

  return (
    <div
      className={`min-h-full p-6 transition-colors ${fontClass}`}
      style={containerStyle}
    >
      {/* Profile Header */}
      <div className="text-center mb-6">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName || 'Avatar'}
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            style={{
              boxShadow: `0 0 0 4px ${colors.background}, 0 0 0 6px ${colors.secondary}40`,
            }}
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              boxShadow: `0 0 0 4px ${colors.background}, 0 0 0 6px ${colors.secondary}40`,
            }}
          >
            <span className="text-2xl font-bold text-white">
              {displayName?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
        )}

        <h2 className="font-semibold text-lg" style={{ color: colors.text }}>
          {displayName || "Seu Nome"}
        </h2>

        {bio && (
          <p className="text-sm mt-1 opacity-70" style={{ color: colors.text }}>
            {bio}
          </p>
        )}
      </div>

      {/* Themed Blocks */}
      <div className="space-y-3">
        {blocks
          .filter((b) => b.visible)
          .map((block) => (
            <ThemedBlockWrapper
              key={block.id}
              block={block}
              colors={colors}
              buttonRadius={buttonRadius}
            />
          ))}
      </div>
    </div>
  );
}

interface ThemedBlockWrapperProps {
  block: {
    id: string;
    type: string;
    content: unknown;
  };
  colors: ThemeColors;
  buttonRadius: string;
}

function ThemedBlockWrapper({
  block,
  colors,
  buttonRadius,
}: ThemedBlockWrapperProps) {
  const content = block.content as Record<string, unknown>;

  // Apply theme to specific block types
  switch (block.type) {
    case "LINK":
      const linkStyle = (content.style as string) || "default";
      const linkStyles: Record<string, CSSProperties> = {
        default: {
          backgroundColor: `${colors.primary}15`,
          borderColor: colors.primary,
          color: colors.text,
          borderRadius: buttonRadius,
        },
        outline: {
          backgroundColor: "transparent",
          borderColor: colors.primary,
          borderWidth: "2px",
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
          className="block w-full p-4 border transition-all hover:scale-[1.02]"
          style={linkStyles[linkStyle] || linkStyles.default}
        >
          <div className="flex items-center justify-center">
            <span className="font-medium">
              {(content.label as string) || "Link"}
            </span>
          </div>
        </a>
      );

    case "HIGHLIGHT":
      if (content.variant === "ABOUT") {
        return (
          <div
            className="p-5 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
              borderColor: `${colors.primary}30`,
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: buttonRadius,
            }}
          >
            {(content.image as string) && (
              <img
                src={content.image as string}
                alt={(content.pageTitle as string) || 'About'}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
              {(content.pageTitle as string) || "Sobre"}
            </h3>
            {(content.featuredTitle as string) && (
              <p className="text-sm mt-1" style={{ color: colors.text }}>
                {content.featuredTitle as string}
              </p>
            )}
            {(content.description as string) && (
              <p className="text-sm mt-2 opacity-70" style={{ color: colors.text }}>
                {content.description as string}
              </p>
            )}
          </div>
        );
      }
      const highlightDesc = content.description as string | undefined;
      return (
        <div
          className="p-5 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
            borderColor: `${colors.primary}30`,
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: buttonRadius,
          }}
        >
          <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
            {(content.title as string) || "Destaque"}
          </h3>
          {highlightDesc && (
            <p
              className="text-sm mt-2 opacity-70"
              style={{ color: colors.text }}
            >
              {highlightDesc}
            </p>
          )}
        </div>
      );

    case "TEXT":
      if (content.variant === "WELCOME") {
        return (
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${colors.primary}10` }}>
            {(content.profilePhoto as string) ? (
              <img
                src={content.profilePhoto as string}
                alt={(content.displayName as string) || 'Welcome'}
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
              />
            ) : null}
            <p className="text-sm opacity-70">{(content.displayName as string) || 'Seu nome'}</p>
            <p className="font-semibold text-lg mt-1">{(content.featuredTitle as string) || 'Seu destaque'}</p>
            {(content.secondTitle as string) && (
              <p className="text-sm opacity-70 mt-1">{content.secondTitle as string}</p>
            )}
            {(content.ctaText as string) && (
              <span className="inline-block mt-3 rounded-md px-3 py-1 text-sm" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                {content.ctaText as string}
              </span>
            )}
          </div>
        );
      }
      const textAlign =
        (content.align as "left" | "center" | "right") || "center";
      return (
        <div className={`py-3`} style={{ textAlign, color: colors.text }}>
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

    case "SOCIAL_ICONS":
      const icons =
        (content.icons as Array<{ platform: string; url: string }>) || [];
      return (
        <div className="flex justify-center gap-4 py-4">
          {icons.length === 0 ? (
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <span className="text-xs" style={{ color: colors.primary }}>
                +
              </span>
            </div>
          ) : (
            icons.map((icon, i) => (
              <a
                key={i}
                href={icon.url}
                target="_blank"
                rel="noopener noreferrer"
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
            ))
          )}
        </div>
      );

    default:
      return (
        <BlockRenderer
          block={{
            id: block.id,
            type: block.type as BlockType,
            content: block.content,
          }}
        />
      );
  }
}
