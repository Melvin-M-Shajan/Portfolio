import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNav } from "@/components/site-nav";
import { siteConfig } from "@/content/site";
import "@fontsource-variable/outfit";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — AI Engineer`, template: `%s — ${siteConfig.name}` },
  description: siteConfig.summary,
  keywords: ["AI Engineer", "Agentic AI", "Graph-RAG", "Multi-Agent Systems", "LangGraph", "LLM Infrastructure"],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website", title: `${siteConfig.name} — AI Engineer`, description: siteConfig.summary,
    url: siteConfig.url, siteName: siteConfig.name,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${siteConfig.name}, AI Engineer` }],
  },
  twitter: {
    card: "summary_large_image", title: `${siteConfig.name} — AI Engineer`,
    description: siteConfig.summary, images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Person", name: siteConfig.name,
    jobTitle: siteConfig.role, email: `mailto:${siteConfig.email}`,
    sameAs: siteConfig.social.map((item) => item.href),
    knowsAbout: ["Agentic AI", "Graph-RAG", "Multi-Agent Systems", "LLM Evaluation", "LangGraph"],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <SiteNav />
          <main id="main-content" className="page-shell">{children}</main>
          {siteConfig.analyticsEnabled ? <Analytics /> : null}
        </ThemeProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
