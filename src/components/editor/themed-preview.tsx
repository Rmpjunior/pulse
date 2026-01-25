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
