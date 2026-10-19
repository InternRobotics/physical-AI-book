"use client";

import { ArrowLeft, Download, MousePointer2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useClickData } from "@/components/analytics/use-click-data";
import { ANALYTICS_TIME_ZONE, clickCsv, clickSeries, dateKey, emptyClickData, totalClicks, usesSharedCounter, type ClickDay } from "@/lib/analytics";
import { assetPath } from "@/lib/asset-path";

const countFormat = new Intl.NumberFormat("en-US");
const clickLabel = (count: number) => `${countFormat.format(count)} ${count === 1 ? "click" : "clicks"}`;
const axisFormat = new Intl.NumberFormat("en-US", { notation: "compact" });
const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
const displayDate = (date: string) => dateFormat.format(new Date(`${date}T00:00:00Z`));

function ClickChart({ series }: { series: ClickDay[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const resize = () => setCompact(media.matches);
    resize(); media.addEventListener("change", resize);
    return () => media.removeEventListener("change", resize);
  }, []);
  const width = compact ? 420 : 960, height = compact ? 300 : 280, left = 52, right = 16, top = 20, bottom = 38;
  const plotWidth = width - left - right, plotHeight = height - top - bottom;
  const max = Math.max(4, Math.ceil(Math.max(...series.map((day) => day.clicks), 0) / 4) * 4);
  const slot = plotWidth / series.length;
  const barWidth = Math.min(48, slot * 0.7);
  const selected = active === null ? null : series[active];
  const hasClicks = series.some((day) => day.clicks > 0);
  return (
    <div className="click-chart" onPointerLeave={() => setActive(null)}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Daily reading-link clicks over the last ${series.length} days`}>
        <desc>{clickLabel(series.reduce((sum, day) => sum + day.clicks, 0))} in this date range. A daily data table is available below.</desc>
        {[0, 1, 2, 3, 4].map((tick) => {
          const y = top + plotHeight - tick * plotHeight / 4;
          return <g key={tick}><line x1={left} x2={width - right} y1={y} y2={y} className="click-chart-grid" /><text x={left - 12} y={y + 4} textAnchor="end" className="click-chart-label">{axisFormat.format(max * tick / 4)}</text></g>;
        })}
        {series.map((day, index) => {
          const x = left + index * slot + (slot - barWidth) / 2;
          const barHeight = day.clicks ? Math.max(2, day.clicks / max * plotHeight) : 0;
          return <g key={day.date} onPointerEnter={() => setActive(index)}>
            <rect x={x} y={top + plotHeight - barHeight} width={barWidth} height={barHeight} rx={Math.min(3, barWidth / 2)} className={active === index ? "click-chart-bar is-active" : "click-chart-bar"} />
            <rect x={left + index * slot} y={top} width={slot} height={plotHeight} fill="transparent" tabIndex={day.clicks ? 0 : -1} onFocus={() => setActive(index)} onBlur={() => setActive(null)} aria-label={`${day.date}: ${clickLabel(day.clicks)}`}><title>{day.date}: {clickLabel(day.clicks)}</title></rect>
          </g>;
        })}
        {[0, Math.floor((series.length - 1) / 2), series.length - 1].map((index) => <text key={index} x={left + (index + 0.5) * slot} y={height - 10} textAnchor={index === 0 ? "start" : index === series.length - 1 ? "end" : "middle"} className="click-chart-label">{displayDate(series[index].date)}</text>)}
      </svg>
      {!hasClicks ? <div className="click-chart-empty"><MousePointer2 aria-hidden="true" className="size-6 text-primary" /><p>No clicks in this date range</p><span>Reading-link clicks will appear here as they are recorded.</span></div> : null}
      {selected && hasClicks ? <div className="click-chart-tooltip" style={{ left: `${Math.max(9, Math.min(91, (left + ((active ?? 0) + 0.5) * slot) / width * 100))}%` }}><span>{selected.date}</span><strong>{clickLabel(selected.clicks)}</strong></div> : null}
    </div>
  );
}

export function ClickDashboard() {
  const { data, loading, error, available, global, refresh } = useClickData();
  const [range, setRange] = useState(30);
  const totalOnly = global && usesSharedCounter();

  const snapshot = data ?? emptyClickData();
  const series = clickSeries(snapshot, range);
  const periodTotal = series.reduce((sum, day) => sum + day.clicks, 0);
  const metrics = [
    { label: "Total Clicks", value: totalClicks(snapshot), detail: "All recorded dates" },
    { label: "Today", value: snapshot.daily[dateKey()] ?? 0, detail: available && data ? `Date: ${dateKey()}` : "Asia/Shanghai (UTC+8)" },
    { label: "Last 7 Days", value: clickSeries(snapshot, 7).reduce((sum, day) => sum + day.clicks, 0), detail: "Including today" },
  ];
  const exportCsv = () => {
    if (!data) return;
    const url = URL.createObjectURL(new Blob([clickCsv(data)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `physical-ai-reading-clicks-${dateKey()}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="mx-auto max-w-[1120px]" id="top">
      <a className="analytics-back" href={assetPath("/#preprint-manuscript")}><ArrowLeft aria-hidden="true" className="size-4" />Back to the Book</a>
      <header className="analytics-heading">
        <div><p className="section-eyebrow">Website Analytics</p><h1>Reading Link Clicks</h1><p className="analytics-lead">Clicks on the Read the monograph buttons on the book website.</p></div>
        <span className="analytics-scope">{!available ? "Awaiting online edition" : global ? "All visitor data" : "Local browser data"}</span>
      </header>
      <p className="analytics-scope-note">{!available ? "The open-access edition is not available online yet. Counts stay at 0 and no clicks are recorded until the reading link is enabled." : global ? "Both reading buttons contribute to one shared total across all visitors, devices and browsers. Viewing or refreshing the website does not add a click." : "These counts belong to this browser only. Visitors and devices are not combined. Global analytics is ready to connect when a service is configured."}</p>
      {error ? <p role="alert" className="analytics-error">{error}</p> : null}
      {totalOnly ? (
        <section className="analytics-panel mt-8" aria-labelledby="shared-total-title">
          <div className="analytics-panel-heading">
            <div><h2 id="shared-total-title">Total Reading Clicks</h2><p>Homepage reading button + Open-Access Edition reading button</p></div>
            <Button size="sm" variant="outline" onClick={refresh} disabled={loading}><RefreshCw aria-hidden="true" />Refresh</Button>
          </div>
          <p aria-live="polite" className="my-6 text-6xl font-semibold tabular-nums text-primary">{data ? countFormat.format(totalClicks(data)) : "—"}</p>
          <p className="text-sm leading-7 text-muted-foreground">All visitors. All devices. One shared count.</p>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-border pt-5">
            <p className="max-w-[75ch] text-sm leading-7 text-muted-foreground">Global counting starts with this integration. Earlier browser-local records are excluded. The counter supplies a cumulative total; daily history is not available.</p>
            <Button size="sm" variant="outline" onClick={exportCsv} disabled={!data}><Download aria-hidden="true" />Export Total</Button>
          </div>
        </section>
      ) : <>
      <div className="analytics-metrics" aria-live="polite">
        {metrics.map((metric) => <article className="analytics-metric" key={metric.label}><h2>{metric.label}</h2><p>{data || !available ? countFormat.format(metric.value) : "—"}</p><span>{metric.detail}</span></article>)}
      </div>
      <section className="analytics-panel" aria-labelledby="click-trend-title">
        <div className="analytics-panel-heading">
          <div><h2 id="click-trend-title">Daily Clicks</h2><p>{data ? `${clickLabel(periodTotal)} in the selected period` : loading ? "Loading counts…" : "Counts unavailable"}</p></div>
          <div className="analytics-periods" aria-label="Date range">{[7, 30, 90].map((days) => <button key={days} type="button" aria-pressed={range === days} onClick={() => setRange(days)}>{days} days</button>)}</div>
        </div>
        {data ? <ClickChart key={range} series={series} /> : <div className="analytics-chart-loading">{loading ? "Loading chart…" : "The chart will appear when data is available."}</div>}
        <div className="analytics-panel-footer"><span>Dates use {ANALYTICS_TIME_ZONE} (UTC+8).</span><span>{data?.updatedAt ? `Last click: ${new Intl.DateTimeFormat("en-GB", { timeZone: ANALYTICS_TIME_ZONE, dateStyle: "medium", timeStyle: "short" }).format(new Date(data.updatedAt))}` : "No clicks recorded yet"}</span></div>
      </section>
      <section className="analytics-panel analytics-data-panel" aria-labelledby="daily-data-title">
        <div className="analytics-panel-heading"><div><h2 id="daily-data-title">Daily Data</h2><p>Daily counts for the selected period. CSV exports include all recorded dates.</p></div><div className="analytics-data-actions"><Button size="sm" variant="outline" onClick={refresh} disabled={loading}><RefreshCw aria-hidden="true" />Refresh</Button><Button size="sm" variant="outline" onClick={exportCsv} disabled={!data}><Download aria-hidden="true" />Export CSV</Button></div></div>
        <details className="analytics-data-details"><summary>View daily counts</summary><div className="analytics-table-scroll"><table><thead><tr><th scope="col">Date</th><th scope="col">Reading Link Clicks</th></tr></thead><tbody>{data ? [...series].reverse().map((day) => <tr key={day.date}><th scope="row">{day.date}</th><td>{countFormat.format(day.clicks)}</td></tr>) : <tr><td colSpan={2}>Counts unavailable</td></tr>}</tbody></table></div></details>
      </section>
      </>}
      <p className="analytics-note">Only clicks on the enabled public reading link are counted. Earlier placeholder test records are excluded. Counts do not represent unique readers or successful downloads.{available && !global ? " Clearing browser data removes these local records." : ""}</p>
    </div>
  );
}
