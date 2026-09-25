"use client";
import React from "react";

/**
 * Readers 24 Clean & Simple Logo Component
 * 
 * Color Palette:
 * - Brand Accent Red: #9b2226 (Matches breaking line color & site theme)
 * - Text Primary: #0f172a / #181818 (Dark theme) or #ffffff (Light theme)
 */
export default function Logo({
  size = "md",
  variant = "dark",
  iconOnly = false,
  showText = true,
  siteName = "Readers 24",
  className = "",
}) {
  const dimensions = {
    sm: { height: 26, iconSize: 24, fontSize: "1.15rem", badgeSize: "0.75rem", badgePadding: "1px 5px" },
    md: { height: 34, iconSize: 30, fontSize: "1.6rem", badgeSize: "0.85rem", badgePadding: "2px 7px" },
    lg: { height: 44, iconSize: 38, fontSize: "2.1rem", badgeSize: "1.05rem", badgePadding: "3px 9px" },
    xl: { height: 54, iconSize: 48, fontSize: "2.6rem", badgeSize: "1.25rem", badgePadding: "4px 11px" },
  };

  const currentSize = typeof size === "string" ? dimensions[size] || dimensions.md : {
    height: size,
    iconSize: Math.round(size * 0.85),
    fontSize: `${(size / 20).toFixed(2)}rem`,
    badgeSize: `${(size / 36).toFixed(2)}rem`,
    badgePadding: "2px 6px"
  };

  const isDarkBg = variant === "light"; // White text for dark backgrounds (e.g. dark sidebars)
  const textColor = isDarkBg ? "#ffffff" : "#0f172a";

  return (
    <div 
      className={`readers24-logo ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        textDecoration: "none",
        userSelect: "none",
        lineHeight: 1,
      }}
    >
      {/* Handcrafted Editorial Icon Mark */}
      <svg
        className="readers24-icon"
        width={currentSize.iconSize}
        height={currentSize.iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, display: "block" }}
        aria-hidden="true"
      >
        {/* Solid Editorial Accent Square (#9b2226 matching breaking bar) */}
        <rect
          width="40"
          height="40"
          rx="8"
          fill="#9b2226"
        />

        {/* Clean, Minimalist Open Book / Newspaper Icon */}
        <path
          d="M9 12C13 12 16.5 13.5 20 15.5C23.5 13.5 27 12 31 12V26.5C27 26.5 23.5 28 20 30C16.5 28 13 26.5 9 26.5V12Z"
          fill="#ffffff"
        />
        {/* Center fold spine */}
        <line
          x1="20"
          y1="15.5"
          x2="20"
          y2="30"
          stroke="#9b2226"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Left page editorial lines */}
        <line x1="12.5" y1="16.5" x2="16.5" y2="16.5" stroke="#9b2226" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="12.5" y1="19.5" x2="16.5" y2="19.5" stroke="#9b2226" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="12.5" y1="22.5" x2="15.5" y2="22.5" stroke="#9b2226" strokeWidth="1.2" strokeLinecap="round" />

        {/* Right page editorial lines */}
        <line x1="23.5" y1="16.5" x2="27.5" y2="16.5" stroke="#9b2226" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="23.5" y1="19.5" x2="27.5" y2="19.5" stroke="#9b2226" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="23.5" y1="22.5" x2="26.5" y2="22.5" stroke="#9b2226" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

      {/* Pure Editorial Wordmark */}
      {showText && !iconOnly && (
        <span
          className="readers24-wordmark"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontFamily: "var(--font-serif), 'Playfair Display', Georgia, serif",
            fontWeight: 800,
            fontSize: currentSize.fontSize,
            letterSpacing: "-0.03em",
            color: textColor,
          }}
        >
          <span className="readers24-text">Readers</span>
          <span
            className="readers24-badge"
            style={{
              display: "inline-block",
              backgroundColor: "#9b2226",
              color: "#ffffff",
              padding: currentSize.badgePadding,
              borderRadius: "4px",
              fontSize: currentSize.badgeSize,
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
              verticalAlign: "middle",
            }}
          >
            24
          </span>
        </span>
      )}
    </div>
  );
}
