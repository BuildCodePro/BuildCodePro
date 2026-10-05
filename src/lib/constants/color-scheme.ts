export type ColorSchemeId = "brand" | "night" | "slate";

export const DEFAULT_COLOR_SCHEME: ColorSchemeId = "brand";

export const COLOR_SCHEME_OPTIONS: ReadonlyArray<{
  id: ColorSchemeId;
  label: string;
  description: string;
  swatches: readonly string[];
}> = [
  { id: "brand", label: "Brand", description: "White surfaces with the red BuildCodePro accent.", swatches: ["#ffffff", "#f8fafc", "#e53935", "#111827"] },
  { id: "night", label: "Night", description: "Dark navy surfaces for low-light work.", swatches: ["#0b1220", "#111a2b", "#ef5350", "#e5e7eb"] },
  { id: "slate", label: "Calm slate", description: "Neutral slate buttons; red is kept for problems only.", swatches: ["#ffffff", "#f1f5f9", "#1e293b", "#e53935"] },
];

export function isColorSchemeId(value: unknown): value is ColorSchemeId {
  return value === "brand" || value === "night" || value === "slate";
}
