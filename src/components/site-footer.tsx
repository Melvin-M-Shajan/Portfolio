import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <p>Have a hard AI systems problem?</p>
        <h2>Let&apos;s make it reliable enough to ship.</h2>
        <Link className="button button-primary" href="/contact">
          Start a conversation <ArrowUpRight weight="bold" />
        </Link>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.name}</span>
        <div>
          {siteConfig.social.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
