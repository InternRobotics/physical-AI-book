import { ArrowUpRight, BookOpen, Code2, FileText, Mail } from "lucide-react";

import { ProjectImage } from "@/components/media/project-image";
import { CopyCitation } from "@/components/research-page/copy-citation";
import { FigureCard } from "@/components/site/figure-card";
import { SectionShell } from "@/components/site/section-shell";
import { Button, buttonClasses } from "@/components/ui/button";
import { ReadingLink } from "@/components/reading-link";
import { ReadingClickCount } from "@/components/analytics/reading-click-count";
import contents from "@/data/contents.json";
import backMatter from "@/data/back-matter.json";
import { aboutParagraphs, bibtex, citationText, contactInfo, coreElements, figures, partDescriptions, projectInfo, resources, rightsNotice } from "@/data/project-page";
import { assetPath } from "@/lib/asset-path";

export function AboutSection() {
  return (
    <SectionShell eyebrow="About the Book" id="about" title="A Unified View of Physical AI" leadClassName="about-questions" headingClassName="max-w-none" lead={<><span>What is Physical AI?</span><span>What does its technical landscape look like?</span><span>What challenges stand between today&apos;s systems and general physical intelligence?</span></>}>
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-5 text-base leading-8 text-muted-foreground">
          {aboutParagraphs.map((paragraph, index) => <p key={paragraph}>{index === 0 ? <><span className="opening-initial">{paragraph[0]}</span>{paragraph.slice(1)}</> : paragraph}</p>)}
        </div>
        <FigureCard caption="The system-level framework of Physical AI: models and control connected to the physical world through feedback. From Figure 1.3 of the monograph.">
          <ProjectImage {...figures.framework} />
        </FigureCard>
      </div>
      <div className="definition-note mt-8">
        <p className="section-eyebrow">The Organizing Idea</p>
        <p className="organizing-statement mt-3 text-foreground">Perception, prediction, decision-making, action, and adaptation form a continuous loop through the physical world.</p>
        <p className="mt-3 text-sm font-medium text-muted-foreground">An organizing framework introduced in Chapter 1.</p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {coreElements.map((element) => <article className="step-card" key={element.number}><span>{element.number}</span><h3>{element.title}</h3><p>{element.body}</p></article>)}
      </div>
    </SectionShell>
  );
}

function ContentsPartCard({ part }: {
  part: (typeof contents)[number];
}) {
  return (
    <article className="contents-part" data-part={part.id} aria-label={`Part ${part.number}: ${part.title}`}>
        <div className="contents-part-header">
          <div className="contents-part-kicker"><span className="part-number">Part {part.number}</span><span>{part.chapters.length} chapters</span></div>
          <h3>{part.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{partDescriptions[part.id]}</p>
        </div>
      <div className="contents-chapters" role="region" aria-label={`Part ${part.number} chapters`} tabIndex={0}>
        {part.chapters.map((chapter) => (
          <details className="chapter-details" key={chapter.number}>
            <summary>
              <span className="chapter-number">{String(chapter.number).padStart(2, "0")}</span>
              <span className="chapter-heading">
                <span className="chapter-title">{chapter.title}</span>
                <span className="chapter-meta">{chapter.sections.length} sections <span aria-hidden="true">·</span> p. {chapter.page}</span>
              </span>
              <span aria-hidden="true" className="chapter-chevron" />
            </summary>
            <div className="chapter-content">
              <ol className="chapter-sections">
                {chapter.sections.map((section) => <li className="chapter-section-row" key={section.number}><span className="text-primary">{section.number}</span><span>{section.title}</span><span className="chapter-page">{section.page}</span></li>)}
              </ol>
            </div>
          </details>
        ))}
      </div>
    </article>
  );
}

export function ContentsSection() {
  return (
    <SectionShell className="bg-muted/35" eyebrow="Inside the Monograph" id="contents" title="Table of Contents" headingClassName="max-w-none" lead={<>Three parts trace a path from concepts and foundations, through the technical stack, to future directions.<br className="desktop-lead-break" />{" "}Expand a chapter to explore its sections.</>}>
      <div className="contents-grid">
        {contents.map((part) => <ContentsPartCard key={part.id} part={part} />)}
      </div>
      <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-sm font-medium" aria-label="Back matter">
        {backMatter.map((entry) => <li key={entry.title}>{entry.title}<span className="ml-2 text-muted-foreground">p. {entry.page}</span></li>)}
      </ul>
      <p className="results-note">Expand a chapter to view its sections. Page numbers match the final PDF edition.</p>
    </SectionShell>
  );
}

export function AuthorsSection() {
  return (
    <SectionShell eyebrow="Authors" id="authors" title="About the Authors" lead="Physical Intelligence Team, Shanghai AI Laboratory">
      <div className="space-y-4 leading-8 text-muted-foreground">
        <p>The monograph is authored by the Physical Intelligence Team, Shanghai AI Laboratory.{" "}<span className="authors-summary">It brings together the concepts, techniques, and challenges of intelligence that interacts with the physical world.</span></p>
        <p className="text-sm">Individual author profiles and acknowledgments will be added when available.</p>
      </div>
    </SectionShell>
  );
}

const resourceIcons = { pdf: BookOpen, code: Code2 };

export function ResourcesSection() {
  return (
    <SectionShell className="bg-muted/35" eyebrow="Read & Explore" id="resources" title="The Book and Code" headingClassName="max-w-none" leadClassName="desktop-single-line-lead" lead="Read the final PDF edition. Code and examples will be shared here when available.">
      <div className="grid gap-5 md:grid-cols-2">
        {resources.map((resource) => {
          const Icon = resourceIcons[resource.icon];
          return (
            <article className="step-card resource-card" key={resource.id} id={resource.id === "preprint" ? "preprint-manuscript" : undefined}>
              <Icon aria-hidden="true" className="size-6 text-primary" strokeWidth={1.5} />
              <h3>{resource.title}</h3><p>{resource.description}</p>
              <div className="mt-6">
                {resource.id === "preprint" ? (
                  <div className="reading-action resource-preprint-action">
                    <ReadingLink className={buttonClasses({ size: "sm" })} href={projectInfo.readingUrl}><BookOpen aria-hidden="true" />Read the monograph</ReadingLink>
                    <ReadingClickCount />
                  </div>
                ) : resource.href ? <a className={buttonClasses({ variant: "outline", size: "sm" })} href={assetPath(resource.href)} target="_blank" rel="noopener noreferrer"><ArrowUpRight aria-hidden="true" />{resource.label}</a> : <span className="resource-status">{resource.label}</span>}
              </div>
            </article>
          );
        })}
      </div>
      <div className="publication-details mt-8">
        <div><p className="section-eyebrow">Publication</p><h3 className="mt-3 text-xl font-semibold">Final Edition, with Open Access</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">The final PDF edition is available to read and download. Publisher and print edition details will be added when confirmed.</p></div>
        <dl className="publication-facts">
          <div><dt>Publisher</dt><dd>{projectInfo.publisher ?? "To be announced"}</dd></div>
          <div><dt>PDF edition date</dt><dd>{projectInfo.publicationDate ?? "To be announced"}</dd></div>
          <div><dt>Print edition</dt><dd>{projectInfo.purchaseUrl ? <a className="text-primary" href={projectInfo.purchaseUrl} target="_blank" rel="noopener noreferrer">Order the book</a> : "Coming soon"}</dd></div>
        </dl>
      </div>
    </SectionShell>
  );
}

export function BibtexSection() {
  return (
    <SectionShell eyebrow="Citation" id="bibtex" title="Cite the Monograph" lead="Please use the following citation for the final PDF edition.">
      <p className="citation-prose mb-7 text-base leading-8 text-muted-foreground">{citationText}</p>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4"><h3 className="flex items-center gap-2 font-semibold"><FileText aria-hidden="true" className="size-4 text-primary" />BibTeX</h3><CopyCitation text={bibtex} /></div>
      <pre className="bibtex-code rounded-lg border border-border bg-card p-5 text-sm leading-7 text-foreground"><code>{bibtex}</code></pre>
      <p className="results-note">Citation details refer to the final PDF edition dated October 19, 2026.</p>
      <aside className="rights-notice" aria-labelledby="rights-title"><h3 id="rights-title">Rights and Permissions</h3><p>{rightsNotice}</p><a className="text-primary text-sm" href="#contact">Contact the team</a></aside>
    </SectionShell>
  );
}

export function ContactSection() {
  return (
    <SectionShell eyebrow="Contact" id="contact" title="Get in Touch" lead="For questions about the monograph and its companion materials.">
      <div className="contact-card">
        <Mail aria-hidden="true" className="size-7 text-primary" strokeWidth={1.5} />
        <div><h3 className="text-xl font-semibold">{contactInfo.name}</h3><p className="mt-2 text-sm text-muted-foreground">{contactInfo.email ?? "Our contact email will be announced here."}</p></div>
        {contactInfo.email ? <a className={buttonClasses({ className: "contact-action" })} href={`mailto:${contactInfo.email}`}>Contact us</a> : <Button className="contact-action" disabled title="Our contact email will be announced here.">Contact us</Button>}
      </div>
    </SectionShell>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/35 px-5 py-8">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 text-sm leading-6 text-muted-foreground"><p>{projectInfo.fullTitle}<br />{projectInfo.team}</p><a className="text-primary" href="#top">Back to top ↑</a></div>
    </footer>
  );
}
