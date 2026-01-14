import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import StoreHydration from "@/components/layout/StoreHydration";

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

const plus_jarkata_sans = Plus_Jakarta_Sans(
  {
    weight:['200',"300","400","500","600","700","800"],
    style: "normal",
    subsets:["latin"]
  }
)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Remove server-side user fetching - this should be handled in dashboard layout
  // where authentication is actually required

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
        className={`max-h-dvh h-dvh ${plus_jarkata_sans.className} antialiased`}
        suppressHydrationWarning // Optional: Suppresses warnings from font loading
      >
        {/* Optional accessibility enhancement: Skip link (improves keyboard navigation & indirect SEO) */}
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        
        {/* Store hydration without server data - client will handle auth state */}
        <StoreHydration userData={null} />

        {children}

        {/* If you have a main content wrapper in pages, id="main-content" there */}
      </body>
    </html>
  );
}