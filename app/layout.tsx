import type { Metadata } from "next";
import "./globals.css";
import CometCursor from "./components/CometCursor";

export const metadata: Metadata = {
  title: "Somyadeep Tarat — Student Developer & Aspiring Entrepreneur",
  description: "The interactive portfolio of Somyadeep Tarat, building intelligent systems across machine learning, data and products.",
  icons: { icon: "/assets/st-monogram.webp" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><CometCursor />{children}</body>
    </html>
  );
}
