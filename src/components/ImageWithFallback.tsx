"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc = "/placeholder.svg",
  alt,
  className = "",
  onError,
  ...rest
}: ImageWithFallbackProps) {
  const resolvedInitialSrc = src && typeof src === "string" && src.trim() !== "" ? src : fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string>(resolvedInitialSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const validSrc = src && typeof src === "string" && src.trim() !== "" ? src : fallbackSrc;
    setImgSrc(validSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt || "HIGHTECH Sports Image"}
      className={className}
      onError={(e) => {
        if (!hasError && imgSrc !== fallbackSrc) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
        if (onError) {
          onError(e);
        }
      }}
    />
  );
}
