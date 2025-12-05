import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VeriTalent - AI-Powered Talent Screening & Verified Career Profiles",
    template: "%s | VeriTalent",
  },
  description:
    "VeriTalent helps employers hire faster, reduce bias, and select the right candidates with intelligent screening and AI-driven insights. Empower talents to showcase verified career profiles enriched with actionable growth intelligence.",
  keywords: "talent screening, AI hiring, reduce bias recruiting, verified profiles, career growth intelligence, employer tools",
  authors: [{ name: "VeriTalent" }],
  openGraph: {
    title: "VeriTalent - Intelligent Hiring & Talent Empowerment",
    description:
      "Hire faster with AI insights and empower talents with verified profiles.",
    type: "website",
    locale: "en_US",
    siteName: "VeriTalent",
  },
  twitter: {
    card: "summary_large_image",
    title: "VeriTalent",
    description:
      "AI-driven hiring and verified talent profiles for faster, fairer recruitment.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Essential for mobile responsiveness (SEO ranking factor) */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon (add your own files) */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Optional: Canonical URL to avoid duplicates */}
        <link rel="canonical" href="https://www.veritalent.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning // Optional: Suppresses warnings from font loading
      >
        {/* Optional accessibility enhancement: Skip link (improves keyboard navigation & indirect SEO) */}
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>

        {children}

        {/* If you have a main content wrapper in pages, id="main-content" there */}
      </body>
    </html>
  );
}