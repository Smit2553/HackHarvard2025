import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VapiProvider } from "@/components/VapiProvider";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://offscript.codestacx.com/"),
  title: {
    default: "Offscript - Practice Technical Interviews with AI",
    template: "%s | Offscript",
  },
  description:
    "The best answers aren't scripted. Practice technical interviews the way they actually happen — through natural conversation with AI. Built at HackHarvard 2025.",
  keywords: [
    "technical interviews",
    "mock interviews",
    "AI interviewer",
    "coding interview practice",
    "voice interview",
    "leetcode practice",
    "interview preparation",
    "software engineering interviews",
    "HackHarvard",
  ],
  authors: [{ name: "Offscript Team" }],
  creator: "Offscript Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://offscript.codestacx.com/",
    title: "Offscript - Practice Technical Interviews with AI",
    description:
      "The best answers aren't scripted. Practice technical interviews through natural conversation with AI.",
    siteName: "Offscript",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Offscript - AI-powered interview practice platform",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <VapiProvider>
          <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
            {children}
          </ThemeProvider>
        </VapiProvider>
      </body>
    </html>
  );
}
