// NobleBond Brand Design Tokens
// Web implementation aligned with official NobleBond mobile palette

export const lightColors = {
  background: "#FFF8F6",
  surface: "#FFFFFF",
  surfaceElevated: "#F8EDF1",
  primary: "#C12F66",
  primaryHover: "#A82455",
  primaryGlow: "rgba(193, 47, 102, 0.2)",
  text: "#291B27",
  textSecondary: "#766674",
  textMuted: "#9E8E9C",
  accentLavender: "#7C68E8",
  accentChampagne: "#B58B42",
  success: "#14845F",
  successBg: "rgba(20, 132, 95, 0.1)",
  warning: "#D97706",
  warningBg: "rgba(217, 119, 6, 0.1)",
  error: "#C9364F",
  errorBg: "rgba(201, 54, 79, 0.1)",
  border: "#E8DDE3",
  borderLight: "#F0E5EB",
  cardBg: "#FFFFFF",
  sidebarBg: "#FFFFFF",
  headerBg: "rgba(255, 248, 246, 0.85)",
  shadowSm: "0 1px 3px rgba(41, 27, 39, 0.05)",
  shadowMd: "0 4px 14px rgba(41, 27, 39, 0.08)",
  shadowLg: "0 10px 30px rgba(41, 27, 39, 0.12)",
} as const;

export const darkColors = {
  background: "#151019",
  surface: "#211824",
  surfaceElevated: "#2B2030",
  primary: "#F15B8D",
  primaryHover: "#FF6E9D",
  primaryGlow: "rgba(241, 91, 141, 0.25)",
  text: "#FFF8FC",
  textSecondary: "#C7B9C7",
  textMuted: "#8E7E91",
  accentLavender: "#B8A8FF",
  accentChampagne: "#E5C57B",
  success: "#46D6A1",
  successBg: "rgba(70, 214, 161, 0.12)",
  warning: "#FBBF24",
  warningBg: "rgba(251, 191, 36, 0.12)",
  error: "#FF7080",
  errorBg: "rgba(255, 112, 128, 0.15)",
  border: "#403244",
  borderLight: "#2F2333",
  cardBg: "#211824",
  sidebarBg: "#1C1420",
  headerBg: "rgba(21, 16, 25, 0.85)",
  shadowSm: "0 1px 4px rgba(0, 0, 0, 0.3)",
  shadowMd: "0 4px 16px rgba(0, 0, 0, 0.4)",
  shadowLg: "0 10px 35px rgba(0, 0, 0, 0.55)",
} as const;

export const AppRadius = {
  xs: "6px",
  sm: "10px",
  md: "14px",
  lg: "18px",
  xl: "24px",
  full: "9999px",
} as const;

export type ThemeMode = "light" | "dark";

