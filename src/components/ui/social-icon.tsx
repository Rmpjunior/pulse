"use client";

import {
  Dribbble,
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Music2,
  Send,
  Twitch,
  Video,
  Youtube,
} from "lucide-react";

interface SocialIconProps {
  platform: string;
  className?: string;
}

const iconMap = {
  behance: Globe,
  discord: MessageCircle,
  dribbble: Dribbble,
  email: Mail,
  facebook: Facebook,
  github: Github,
  instagram: Instagram,
  linkedin: Linkedin,
  medium: Globe,
  spotify: Music2,
  telegram: Send,
  tiktok: Video,
  twitch: Twitch,
  twitter: Globe,
  vimeo: Video,
  whatsapp: MessageCircle,
  x: Globe,
  youtube: Youtube,
} as const;

export function SocialIcon({ platform, className }: SocialIconProps) {
  const normalized = platform.trim().toLowerCase();
  const Icon = iconMap[normalized as keyof typeof iconMap] || Globe;
  return <Icon className={className} aria-hidden="true" />;
}
