import { BookOpen, FileText, Library, List } from "lucide-react";
import Image from "next/image";

import { InteractiveBookCover } from "@/components/research-page/interactive-book-cover";
import { ReadingLink } from "@/components/reading-link";
import { buttonClasses } from "@/components/ui/button";
import { bookCover, heroActions, projectInfo, teamLogos } from "@/data/project-page";
import { assetPath } from "@/lib/asset-path";

const icons: Record<string, React.ReactNode> = {
  pdf: <BookOpen aria-hidden="true" />,
  contents: <List aria-hidden="true" />,
  resources: <Library aria-hidden="true" />,
  citation: <FileText aria-hidden="true" />,
};

export function HeroSection() {
  return (
    <section className="hero-section book-hero-section px-5" id="top">
      <div aria-hidden="true" className="hero-background" />
      <div className="book-hero-layout mx-auto max-w-[1120px]">
        <div className="book-hero-copy">
          <p className="publication-badge">{projectInfo.status}</p>
          <h1 className="hero-title text-balance"><span className="title-gradient">{projectInfo.name}</span></h1>
          <p className="hero-subtitle">{projectInfo.subtitle.join(" ")}</p>
          <div className="book-author-row">
            <p className="book-byline">By <strong>Physical Intelligence Team,</strong><span><strong>Shanghai AI Laboratory</strong></span></p>
            <div aria-label="Affiliations" className="book-author-logos">
              {teamLogos.map((logo) => logo.src ? (
                <Image alt={logo.alt} className="book-author-logo" height={logo.height} key={logo.id} src={assetPath(logo.src)} width={logo.width} />
              ) : null)}
            </div>
          </div>
          <p className="book-hero-description">{projectInfo.description}</p>
          <div className="book-hero-actions">
            {heroActions.map((action, index) => index === 0 ? (
              <ReadingLink className={buttonClasses({ size: "md" })} href={action.href} key={action.label}>
                {icons[action.icon]}{action.label}
              </ReadingLink>
            ) : action.href ? (
              <a
                className={buttonClasses({ size: "md", variant: index === 0 ? "default" : "outline" })}
                href={assetPath(action.href)}
                key={action.label}
              >
                {icons[action.icon]}{action.label}
              </a>
            ) : (
              <button className={buttonClasses({ size: "md", variant: index === 0 ? "default" : "outline" })} disabled key={action.label} type="button">
                {icons[action.icon]}{action.label}
              </button>
            ))}
          </div>
          <p className="book-edition-note">{projectInfo.editionNote}</p>
          <dl aria-label="About this edition" className="book-facts">
            <div><dt>Parts</dt><dd>3</dd></div>
            <div><dt>Chapters</dt><dd>12</dd></div>
            <div><dt>Pages</dt><dd>{projectInfo.pageCount}</dd></div>
          </dl>
        </div>
        <figure className="book-cover-figure">
          <InteractiveBookCover>
            {bookCover.src ? (
              <Image alt={bookCover.alt} className="book-cover-image" height={bookCover.height} priority src={assetPath(bookCover.src)} width={bookCover.width} />
            ) : (
              <div aria-label="Book cover placeholder. Final cover forthcoming." className="book-cover-placeholder" role="img">
                <div className="book-cover-placeholder-content">
                  <BookOpen aria-hidden="true" strokeWidth={1.2} />
                  <p>Book cover</p>
                  <span>Artwork forthcoming</span>
                </div>
              </div>
            )}
          </InteractiveBookCover>
          <figcaption>{bookCover.src ? projectInfo.fullTitle : "Final cover to be announced"}</figcaption>
        </figure>
      </div>
    </section>
  );
}
