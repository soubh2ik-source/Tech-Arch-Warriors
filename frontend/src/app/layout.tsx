import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

import { AppNavbar } from "@/components/AppNavbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PalmoAI — Precision Clinical Thoracic Oncology",
  description: "AI-assisted analysis of chest CT images, classifying pulmonary scans across four diagnostic categories with 90.16% accuracy.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=3", sizes: "16x16", type: "image/png" },
      { url: "/favicon.png?v=3", type: "image/png" },
      { url: "/favicon.ico?v=3", sizes: "any" },
    ],
    shortcut: "/favicon-32x32.png?v=3",
    apple: "/apple-touch-icon.png?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable} ${playfair.variable}`}>
        <div className="site-layout">
          <AppNavbar />
          <main className="site-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
