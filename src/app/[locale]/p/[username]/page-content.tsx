"use client";

import { Link } from "@/i18n/navigation";
import { Sparkles } from "lucide-react";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import type { BlockType } from "@/types/blocks";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {page.avatar ? (
            <img
              src={page.avatar}
              alt={page.displayName || page.username}
              className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-border object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 gradient-primary flex items-center justify-center ring-4 ring-border">
              <span className="text-3xl font-bold text-white">
                {(page.displayName || page.username)[0]?.toUpperCase()}
              </span>
            </div>
          )}

          <h1 className="text-xl font-bold">
            {page.displayName || `@${page.username}`}
          </h1>

          {page.bio && (
            <p className="text-muted-foreground mt-2 text-sm max-w-xs mx-auto">
              {page.bio}
            </p>
          )}
        </div>

        {/* Blocks */}
        <div className="space-y-3">
          {page.blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={{
                id: block.id,
                type: block.type as BlockType,
                content: block.content,
              }}
              onBlockClick={handleBlockClick}
            />
          ))}
        </div>

        {/* Watermark */}
        {showWatermark && (
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
