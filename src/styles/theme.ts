export interface AppTheme {
  name: "light" | "dark";
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  accentSoft: string;
  success: string;
  warning: string;
  danger: string;
  shadow: string;
  heroGradient: string;
  editorTheme: "light" | "dark";
}

export const lightTheme: AppTheme = {
  name: "light",
  background: "#f6f7f3",
  surface: "#ffffff",
  surfaceElevated: "#f0f4e8",
  text: "#1e2430",
  textMuted: "#4d5564",
  border: "#c6cfbd",
  accent: "#115e59",
  accentSoft: "#d6f3ee",
  success: "#1b7f45",
  warning: "#9a5f00",
  danger: "#b42318",
  shadow: "0 14px 32px rgba(24, 39, 75, 0.14)",
  heroGradient: "linear-gradient(130deg, #d9f3eb 0%, #f6f7f3 55%, #ffe5c7 100%)",
  editorTheme: "light",
};

export const darkTheme: AppTheme = {
  name: "dark",
  background: "#111518",
  surface: "#171d22",
  surfaceElevated: "#1f272d",
  text: "#f4f7f8",
  textMuted: "#c2c8ce",
  border: "#3f4a53",
  accent: "#8ce3d8",
  accentSoft: "#203536",
  success: "#6edd9a",
  warning: "#f2c46d",
  danger: "#ff8f87",
  shadow: "0 18px 36px rgba(0, 0, 0, 0.5)",
  heroGradient: "linear-gradient(120deg, #1d2b2a 0%, #111518 50%, #2f2620 100%)",
  editorTheme: "dark",
};

export type ThemeType = AppTheme;
