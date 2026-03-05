import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  size?: number;
};

export function BrandLogo({
  className,
  imageClassName,
  size = 32,
}: BrandLogoProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card border border-border/60 overflow-hidden",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/icon.png"
        alt="Pulse"
        width={size}
        height={size}
        className={cn("h-full w-full object-cover", imageClassName)}
      />
    </div>
  );
}
