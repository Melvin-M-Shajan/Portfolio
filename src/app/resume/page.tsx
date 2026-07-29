import { DownloadSimple, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/content/site";

export const metadata = { title: "Resume", description: "View or download Melvin M Shajan's AI Engineer resume." };

export default function ResumePage() {
  return (
    <>
      <section className="page-hero compact chapter"><p className="eyebrow">Resume</p><h1>Experience at a glance.</h1>
        <div className="hero-actions">
          <a className="button button-primary" href={siteConfig.resumeUrl} download>Download PDF <DownloadSimple /></a>
          <a className="button button-secondary" href={siteConfig.resumeUrl} target="_blank" rel="noreferrer">Open in new tab <ArrowSquareOut /></a>
        </div></section>
      <section className="resume-frame chapter"><iframe title="Melvin M Shajan resume" src={siteConfig.resumeUrl} />
        <p>If the inline viewer is unavailable, <a href={siteConfig.resumeUrl}>open the PDF directly</a>.</p></section>
    </>
  );
}
