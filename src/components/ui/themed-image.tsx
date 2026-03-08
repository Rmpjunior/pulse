"use client";

import Image, { ImageProps } from "next/image";
import { useTheme } from "@/components/providers/theme-provider";

interface ThemedImageProps extends Omit<ImageProps, "src"> {
  lightSrc: string;
  darkSrc: string;
}

export function ThemedImage({
  lightSrc,
  darkSrc,
  alt,
  ...props
}: ThemedImageProps) {
  const { resolvedTheme } = useTheme();
  const src = resolvedTheme === "dark" ? darkSrc : lightSrc;

  return <Image key={src} src={src} alt={alt} {...props} />;
}
