import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NirmaanCloud",
  description: "Cloud-based AI-powered Construction ERP platform for India.",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B3A6B"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
