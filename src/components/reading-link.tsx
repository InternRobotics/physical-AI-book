"use client";

import type { ReactNode } from "react";
import { isReadingAvailable } from "@/data/publication";
import { trackReadingClick, type ReadingClickEvent } from "@/lib/analytics";
import { assetPath } from "@/lib/asset-path";

export function ReadingLink({ href, children, className, source = "preprint_resource" }: { href: string | null; children: ReactNode; className?: string; source?: ReadingClickEvent["source"] }) {
  if (!href || !isReadingAvailable(href)) {
    return <button className={className} disabled type="button" title="The reading link is currently unavailable." data-reading-state="unavailable">{children}</button>;
  }
  return (
    <a className={className} href={assetPath(href)} target="_blank" rel="noopener noreferrer" data-analytics-event="reading_click"
      onClick={(event) => { if (event.button === 0) void trackReadingClick(href, source); }}
      onAuxClick={(event) => { if (event.button === 1) void trackReadingClick(href, source); }}
    >{children}</a>
  );
}
