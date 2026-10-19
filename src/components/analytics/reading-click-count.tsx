"use client";

import { useClickData } from "@/components/analytics/use-click-data";
import { totalClicks } from "@/lib/analytics";

const countFormat = new Intl.NumberFormat("en-US");

export function ReadingClickCount() {
  const { data, available, global } = useClickData();
  const count = data ? countFormat.format(totalClicks(data)) : available ? "—" : "0";
  const note = !available ? "Counting starts when the public reading link is enabled." :
    global ? "Combined clicks on both reading buttons, across all devices and browsers." : "Clicks recorded in this browser.";
  return (
    <p className="reading-click-count" title={note} aria-live="polite" aria-atomic="true">
      <span className="reading-click-number">{count}</span>{" "}<span className="reading-click-label">clicks</span>
    </p>
  );
}
