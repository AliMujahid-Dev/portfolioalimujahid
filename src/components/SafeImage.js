"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=75&w=800";

/**
 * SafeImage: Resilient, High-Performance Image Component with:
 * 1. Automatic WebP/AVIF conversion and responsive scaling via next/image to eliminate mobile data waste.
 * 2. Automatic no-referrer to bypass news site hotlink blocking (403 Forbidden).
 * 3. Instant client-side fallback if an external news CDN token expires or fails.
 * 4. Priority preloading support for Hero LCP optimization.
 */
export default function SafeImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt = "Readers 24 Editorial",
  className = "",
  style = {},
  priority = false,
  width,
  height,
  fill = false,
  sizes,
  onLoad
}) {
  const initialSrc = src || fallbackSrc || DEFAULT_FALLBACK;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [isFallback, setIsFallback] = useState(false);
  const [useRawImg, setUseRawImg] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc || DEFAULT_FALLBACK);
    setIsFallback(false);
    setUseRawImg(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!isFallback) {
      setIsFallback(true);
      setCurrentSrc(fallbackSrc || DEFAULT_FALLBACK);
    } else {
      setUseRawImg(true);
    }
  };

  const responsiveSizes = sizes || (fill
    ? (priority ? "(max-width: 768px) 100vw, 800px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px")
    : undefined);

  if (useRawImg) {
    const combinedStyle = fill
      ? {
          position: 'absolute',
          height: '100%',
          width: '100%',
          inset: 0,
          objectFit: 'cover',
          ...style
        }
      : style;

    return (
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        style={combinedStyle}
        referrerPolicy="no-referrer"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={onLoad}
      />
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      className={className}
      width={fill ? undefined : (width || 800)}
      height={fill ? undefined : (height || 450)}
      fill={fill}
      sizes={responsiveSizes}
      priority={priority}
      style={{ objectFit: fill ? 'cover' : undefined, ...style }}
      referrerPolicy="no-referrer"
      onError={handleError}
      onLoad={onLoad}
    />
  );
}
