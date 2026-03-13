"use client";

import { ThemedPageView } from "@/components/page/themed-page-view";
import { type ThemeSettings } from "@/types/theme";

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

  return (
    <ThemedPageView
      settings={page.theme as ThemeSettings}
      displayName={page.displayName}
      username={page.username}
      bio={page.bio}
      avatarUrl={page.avatar}
      blocks={page.blocks}
      showWatermark={showWatermark}
      onBlockClick={handleBlockClick}
      fullHeight
    />
  );
}
