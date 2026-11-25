/* eslint-disable @next/next/no-img-element -- Custom image optimization via publicImageUrl, including external preview URLs. */
import type { ComponentProps } from "react";
import { publicImageUrl } from "@/lib/public-image";

type Props = Omit<ComponentProps<"img">, "src" | "alt"> & {
  src: string;
  alt: string;
  maxWidth?: number;
  priority?: boolean;
};
export default function PublicImage({
  src,
  alt,
  maxWidth = 1200,
  priority = false,
  ...props
}: Props) {
  const optimized = publicImageUrl(src, maxWidth);
  // Cloudinary and local WebP transformations are handled by publicImageUrl; arbitrary preview URLs are supported.
  return (
    <img
      {...props}
      src={optimized}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
