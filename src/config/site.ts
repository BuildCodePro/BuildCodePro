export const siteConfig = {
  name: "BuildCode Pro",
  description:
    "AI-powered fire alarm estimation platform for contractors. Upload construction drawings and receive NFPA 72 compliant design recommendations.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;
