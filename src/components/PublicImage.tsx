import type { ComponentProps } from "react";
import { publicImageUrl } from "@/lib/public-image";

type Props = Omit<ComponentProps<"img">, "src" | "alt"> & { src: string; alt: string; maxWidth?: number; priority?: boolean };
export default function PublicImage({ src, alt, maxWidth = 1200, priority = false, ...props }: Props) {
  const optimized = publicImageUrl(src, maxWidth);
  return <img {...props} src={optimized} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" />;
}
