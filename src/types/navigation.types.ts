import React from "react";

export interface NavigationItem {
  id: string;
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string; strokeWidth?: number }>;
  badge?: {
    text: string;
    variant: "primary" | "warning" | "error" | "live" | "neutral";
  };
  description: string;
}

export interface NavigationGroup {
  id: string;
  label: string;
  items: NavigationItem[];
}

