import React, { useState } from "react";
import {
  Wifi,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Heart,
  Star,
  Crown,
  Bell,
  Flame,
  Smartphone,
  ChevronRight,
} from "lucide-react";
import logoMark from "../../assets/adminlogo/noblebond-mark.png";
import type {
  DevicePreviewMode,
  PreviewWallpaperKey,
} from "../../types/notificationsManagement.types";
import {
  renderSampleVariables,
  WALLPAPER_BACKGROUNDS,
} from "./notificationsUiUtils";

export interface IPhone18ProMaxPreviewProps {
  mode: DevicePreviewMode;
  onChangeMode: (m: DevicePreviewMode) => void;
  title: string;
  message: string;
  imageUrl?: string;
  iconKey?: "heart" | "star" | "crown" | "bell" | "flame";
  ctaLabel?: string;
  deepLinkRoute?: string;
  appName?: string;
  appIconUrl?: string;
  categoryLabel?: string;
}

export const IPhone18ProMaxPreview: React.FC<IPhone18ProMaxPreviewProps> = ({
  mode,
  onChangeMode,
  title,
  message,
  imageUrl,
  iconKey = "bell",
  ctaLabel,
  deepLinkRoute,
  appName = "NobleBond",
  appIconUrl = logoMark,
  categoryLabel = "Announcement",
}) => {
  const [phoneTheme, setPhoneTheme] = useState<"dark" | "light">("dark");
  const [wallpaper, setWallpaper] = useState<PreviewWallpaperKey>("rose_twilight");
  const [expanded, setExpanded] = useState(true);

  const resolvedTitle = renderSampleVariables(title.trim() || "Notification Title Preview");
  const resolvedMessage = renderSampleVariables(
    message.trim() || "Start typing your notification message to see it live on iPhone 18 Pro Max."
  );

  const isPhoneDark = phoneTheme === "dark";
  const notifCardBg = isPhoneDark ? "rgba(33, 24, 36, 0.86)" : "rgba(255, 255, 255, 0.9)";
  const notifBorder = isPhoneDark ? "rgba(255, 255, 255, 0.14)" : "rgba(41, 27, 39, 0.1)";
  const notifTextMain = isPhoneDark ? "#FFF8FC" : "#291B27";
  const notifTextSub = isPhoneDark ? "#D7C9D7" : "#615160";

  const renderCategoryIcon = () => {
    if (iconKey === "heart") return <Heart size={15} color="#FFFFFF" fill="#FFFFFF" />;
    if (iconKey === "star") return <Star size={15} color="#FFFFFF" fill="#FFFFFF" />;
    if (iconKey === "crown") return <Crown size={15} color="#FFFFFF" />;
    if (iconKey === "flame") return <Flame size={15} color="#FFFFFF" />;
    return <Bell size={15} color="#FFFFFF" />;
  };

  const iconBg =
    iconKey === "star"
      ? "#7972E6"
      : iconKey === "flame"
        ? "#D97706"
        : iconKey === "bell"
          ? "#8E51EB"
          : "#F15B8D";

  const isAndroid = mode === "android_preview";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
      {/* Preview Mode Switcher Pills */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 5,
          justifyContent: "center",
          width: "100%",
        }}
      >
        {(
          [
            { key: "iphone_lock_screen", label: "Lock Screen" },
            { key: "iphone_banner", label: "Banner" },
            { key: "iphone_notification_center", label: "Notification Center" },
            { key: "in_app_preview", label: "In-App UI" },
            { key: "android_preview", label: "Android" },
          ] as Array<{ key: DevicePreviewMode; label: string }>
        ).map((m) => {
          const active = mode === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => onChangeMode(m.key)}
              style={{
                padding: "5px 9px",
                borderRadius: 999,
                border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
                background: active ? "var(--primary)" : "var(--bg-surface-elevated)",
                color: active ? "#FFFFFF" : "var(--text-secondary)",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Preview Controls Strip (Independent Light/Dark, Wallpaper, Expand) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <button
          type="button"
          onClick={() => setPhoneTheme((p) => (p === "dark" ? "light" : "dark"))}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 9px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg-card)",
            color: "var(--text-main)",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isPhoneDark ? <Moon size={12} /> : <Sun size={12} />}
          <span>Device: {isPhoneDark ? "Dark" : "Light"}</span>
        </button>

        {!isAndroid && mode !== "in_app_preview" && (
          <select
            aria-label="Preview Lock Screen Wallpaper"
            value={wallpaper}
            onChange={(e) => setWallpaper(e.target.value as PreviewWallpaperKey)}
            style={{
              padding: "5px 8px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {(Object.keys(WALLPAPER_BACKGROUNDS) as PreviewWallpaperKey[]).map((wk) => (
              <option key={wk} value={wk}>
                {WALLPAPER_BACKGROUNDS[wk].label}
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          onClick={() => setExpanded((p) => !p)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 9px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg-card)",
            color: "var(--text-main)",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          <span>{expanded ? "Collapse" : "Expand"}</span>
        </button>
      </div>

      {/* Hardware Shell: iPhone 18 Pro Max (or Android Flagship Frame) */}
      <div
        style={{
          width: "min(330px, 100%)",
          aspectRatio: "9 / 19.2",
          minHeight: 540,
          maxHeight: 620,
          borderRadius: isAndroid ? 34 : 46,
          padding: 9,
          background: isAndroid
            ? "linear-gradient(145deg, #2B2D35 0%, #16181D 100%)"
            : "linear-gradient(145deg, #4A444F 0%, #26222B 55%, #3B3641 100%)",
          boxShadow: "0 20px 44px rgba(15, 8, 22, 0.36), inset 0 0 0 1.5px rgba(255,255,255,0.18)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Screen Viewport */}
        <div
          style={{
            flex: 1,
            borderRadius: isAndroid ? 26 : 38,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            background:
              mode === "in_app_preview"
                ? isPhoneDark
                  ? "#151019"
                  : "#FFF8F6"
                : isAndroid
                  ? isPhoneDark
                    ? "#121318"
                    : "#F3F4F8"
                  : WALLPAPER_BACKGROUNDS[wallpaper].gradient,
            color: mode === "in_app_preview" ? notifTextMain : "#FFFFFF",
          }}
        >
          {/* OS Status Bar + Dynamic Island (or Punch-hole on Android) */}
          <div
            style={{
              height: 44,
              padding: "10px 20px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 5,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color:
                  mode === "in_app_preview" || isAndroid
                    ? isPhoneDark
                      ? "#FFFFFF"
                      : "#1F1721"
                    : "#FFFFFF",
              }}
            >
              9:41
            </span>

            {isAndroid ? (
              <div
                aria-label="Android Front Camera"
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  background: "#0A0B0D",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                }}
              />
            ) : (
              <div
                aria-label="iPhone 18 Pro Max Dynamic Island"
                style={{
                  width: mode === "iphone_banner" ? 114 : 96,
                  height: 25,
                  borderRadius: 999,
                  background: "#070709",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 8px",
                  transition: "width 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#1A1B2E",
                    boxShadow: "inset 0 0 3px #4D6BFF",
                  }}
                />
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: mode === "iphone_banner" ? "#F15B8D" : "transparent",
                  }}
                />
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color:
                  mode === "in_app_preview" || isAndroid
                    ? isPhoneDark
                      ? "#FFFFFF"
                      : "#1F1721"
                    : "#FFFFFF",
              }}
            >
              {/* Signal Bars */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 10 }}>
                <span style={{ width: 2.5, height: 4, background: "currentColor", borderRadius: 1 }} />
                <span style={{ width: 2.5, height: 6, background: "currentColor", borderRadius: 1 }} />
                <span style={{ width: 2.5, height: 8, background: "currentColor", borderRadius: 1 }} />
                <span style={{ width: 2.5, height: 10, background: "currentColor", borderRadius: 1 }} />
              </div>
              <Wifi size={12} />
              <div
                style={{
                  width: 20,
                  height: 10,
                  borderRadius: 3,
                  border: "1px solid currentColor",
                  padding: 1.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80%", height: "100%", background: "currentColor", borderRadius: 1 }} />
              </div>
            </div>
          </div>

          {/* MODE 1, 2, 3: iPhone Lock Screen / Banner / Notification Center */}
          {(mode === "iphone_lock_screen" ||
            mode === "iphone_banner" ||
            mode === "iphone_notification_center") && (
            <div
              style={{
                flex: 1,
                padding: "10px 14px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: mode === "iphone_banner" ? "flex-start" : "space-between",
                gap: 12,
              }}
            >
              {mode === "iphone_lock_screen" && (
                <div style={{ textAlign: "center", marginTop: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9 }}>
                    Tuesday, November 10
                  </div>
                  <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.05 }}>
                    9:41
                  </div>
                </div>
              )}

              {mode === "iphone_notification_center" && (
                <div style={{ fontSize: 18, fontWeight: 700, paddingTop: 6 }}>
                  Notification Center
                </div>
              )}

              {/* Active Interactive Notification Card */}
              <div
                className="animate-fade-in"
                style={{
                  background: notifCardBg,
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  border: `1px solid ${notifBorder}`,
                  borderRadius: 20,
                  padding: 12,
                  color: notifTextMain,
                  boxShadow: "0 10px 26px rgba(0, 0, 0, 0.28)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <img
                      src={appIconUrl}
                      alt={appName}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 5,
                        objectFit: "cover",
                        background: "#FFFFFF",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        opacity: 0.85,
                      }}
                    >
                      {appName.toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: notifTextSub }}>now</span>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        lineHeight: 1.25,
                        marginBottom: 3,
                        wordBreak: "break-word",
                      }}
                    >
                      {resolvedTitle}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: notifTextSub,
                        lineHeight: 1.38,
                        wordBreak: "break-word",
                        ...(expanded
                          ? {}
                          : {
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }),
                      }}
                    >
                      {resolvedMessage}
                    </div>
                  </div>

                  {imageUrl && imageUrl.trim().length > 0 && !expanded && (
                    <img
                      src={imageUrl}
                      alt="Notification Attachment"
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 9,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>

                {imageUrl && imageUrl.trim().length > 0 && expanded && (
                  <img
                    src={imageUrl}
                    alt="Notification Banner Attachment"
                    style={{
                      width: "100%",
                      height: 112,
                      borderRadius: 12,
                      objectFit: "cover",
                      marginTop: 8,
                    }}
                  />
                )}

                {ctaLabel && ctaLabel.trim().length > 0 && expanded && (
                  <div
                    style={{
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: `1px solid ${notifBorder}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#F15B8D" }}>
                      {ctaLabel}
                    </span>
                    <span style={{ fontSize: 10, color: notifTextSub }}>
                      {deepLinkRoute || "/discover"}
                    </span>
                  </div>
                )}
              </div>

              {mode === "iphone_notification_center" && (
                <div
                  style={{
                    background: notifCardBg,
                    border: `1px solid ${notifBorder}`,
                    borderRadius: 18,
                    padding: 11,
                    opacity: 0.72,
                    color: notifTextMain,
                  }}
                >
                  <div style={{ fontSize: 11.5, fontWeight: 700 }}>
                    Yesterday • NobleBond Matches
                  </div>
                  <div style={{ fontSize: 11, color: notifTextSub, marginTop: 2 }}>
                    You have a new match notification waiting inside your feed.
                  </div>
                </div>
              )}

              {/* Bottom Home Indicator Bar */}
              <div
                style={{
                  alignSelf: "center",
                  width: 110,
                  height: 4,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.65)",
                  marginTop: "auto",
                }}
              />
            </div>
          )}

          {/* MODE 4: IN-APP NOTIFICATION PREVIEW (Synced with Mobile NotificationCard.tsx UI) */}
          {mode === "in_app_preview" && (
            <div
              style={{
                flex: 1,
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: notifTextMain }}>
                  Notifications
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#EA4F87" }}>
                  In-App Feed
                </span>
              </div>

              {/* Mobile Gradient Tabs Replication */}
              <div style={{ display: "flex", gap: 6, overflow: "hidden" }}>
                <span
                  style={{
                    background: "linear-gradient(90deg, #EA4F87 0%, #8E51EB 100%)",
                    color: "#FFFFFF",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: 999,
                  }}
                >
                  All
                </span>
                {["Matches", "Messages", "Other"].map((t) => (
                  <span
                    key={t}
                    style={{
                      background: isPhoneDark ? "#211825" : "#F4EDF2",
                      color: notifTextSub,
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "5px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Authentic In-App NotificationCard */}
              <div
                className="animate-fade-in"
                style={{
                  background: isPhoneDark ? "#211825" : "#FFFFFF",
                  border: `1px solid ${isPhoneDark ? "#332437" : "#F1E6ED"}`,
                  borderRadius: 16,
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {renderCategoryIcon()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: notifTextMain }}>
                      {resolvedTitle}
                    </div>
                    <div style={{ fontSize: 11, color: notifTextSub }}>{categoryLabel} • Just now</div>
                  </div>

                  <ChevronRight size={15} style={{ color: notifTextSub, flexShrink: 0 }} />
                </div>

                <div style={{ fontSize: 12, color: notifTextSub, lineHeight: 1.45 }}>
                  {resolvedMessage}
                </div>

                {imageUrl && imageUrl.trim().length > 0 && (
                  <img
                    src={imageUrl}
                    alt="In-App Banner"
                    style={{ width: "100%", height: 96, borderRadius: 10, objectFit: "cover" }}
                  />
                )}

                {ctaLabel && (
                  <div
                    style={{
                      background: "linear-gradient(90deg, #C12F66 0%, #8E51EB 100%)",
                      color: "#FFFFFF",
                      textAlign: "center",
                      padding: "7px 12px",
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {ctaLabel}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODE 5: ANDROID NOTIFICATION PREVIEW ("noblebond-default" channel) */}
          {mode === "android_preview" && (
            <div style={{ flex: 1, padding: "14px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: notifTextSub }}>
                Android Notification Shade
              </div>

              <div
                className="animate-fade-in"
                style={{
                  background: isPhoneDark ? "#23252C" : "#FFFFFF",
                  borderRadius: 20,
                  padding: 13,
                  border: `1px solid ${notifBorder}`,
                  color: isPhoneDark ? "#F3F4F6" : "#1F2937",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.16)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#C12F66",
                      color: "#FFFFFF",
                      fontSize: 10,
                      fontWeight: 800,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    N
                  </span>
                  <span style={{ fontSize: 11.5, fontWeight: 600 }}>
                    {appName} • noblebond-default
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: notifTextSub }}>now</span>
                </div>

                <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 3 }}>
                  {resolvedTitle}
                </div>
                <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.4 }}>{resolvedMessage}</div>

                {imageUrl && imageUrl.trim().length > 0 && expanded && (
                  <img
                    src={imageUrl}
                    alt="Android BigPicture"
                    style={{
                      width: "100%",
                      height: 100,
                      borderRadius: 12,
                      objectFit: "cover",
                      marginTop: 8,
                    }}
                  />
                )}

                {ctaLabel && (
                  <div style={{ marginTop: 9, fontSize: 12, fontWeight: 700, color: "#F15B8D" }}>
                    {ctaLabel.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Caption */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 11.5,
          color: "var(--text-muted)",
        }}
      >
        <Smartphone size={13} />
        <span>
          {isAndroid
            ? "Android Material Notification Preview"
            : mode === "in_app_preview"
              ? "In-App NobleBond Feed Replication"
              : "iPhone 18 Pro Max Dynamic Island Live Mockup"}
        </span>
      </div>
    </div>
  );
};

