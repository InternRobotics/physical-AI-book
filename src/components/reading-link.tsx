"use client";

import type { ReactNode } from "react";
import { isReadingAvailable } from "@/data/publication";
import { trackReadingClick } from "@/lib/analytics";
import { assetPath } from "@/lib/asset-path";

export function ReadingLink({ href, children, className }: { href: string | null; children: ReactNode; className?: string }) {
  if (!href || !isReadingAvailable(href)) {
    return <button className={className} disabled type="button" title="The open-access edition will be available here when released." data-reading-state="unavailable">{children}</button>;
  }
  return (
    <a className={className} href={assetPath(href)} target="_blank" rel="noopener noreferrer" data-analytics-event="reading_click"
      onClick={(event) => { if (event.button === 0) void trackReadingClick(href); }}
      onAuxClick={(event) => { if (event.button === 1) void trackReadingClick(href); }}
    >{children}</a>
  );
}
