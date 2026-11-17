import type { Metadata } from "next";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "./globals.css";
import { profile } from "./data/profile";
export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: "Somyadeep Tarat — Developer & AI Systems Builder",
  description:
    "Explore Somyadeep Tarat’s work in backend engineering, AI research agents, energy simulation, and graph-based machine learning. Computer science student at VIT.",
  alternates: { canonical: "/" },
  icons: {
    icon: "/assets/st-monogram.webp",
    apple: "/assets/st-monogram.webp",
  },
  openGraph: {
    type: "website",
    url: profile.site,
    siteName: "Somyadeep Tarat",
    title: "Somyadeep Tarat — A Personal Workspace",
    description: profile.headline,
    images: [
      {
        url: "/assets/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Somyadeep Tarat — Thoughtful systems. Useful software.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Somyadeep Tarat — Developer & AI Systems Builder",
    description: profile.headline,
    images: ["/assets/social-preview.png"],
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
