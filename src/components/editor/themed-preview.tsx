"use client";

import { ThemedPageView } from "@/components/page/themed-page-view";
import { type ThemeSettings } from "@/types/theme";

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
  return (
    <ThemedPageView
      settings={settings}
      displayName={displayName}
      bio={bio}
      avatarUrl={avatarUrl}
      blocks={blocks}
    />
  );
}
