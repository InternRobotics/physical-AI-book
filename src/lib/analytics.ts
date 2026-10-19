import { isReadingAvailable } from "@/data/publication";

// Isolate official-release clicks from the earlier placeholder test records.
export const CLICK_STORAGE_KEY = "physicalai:reading-clicks:published:v1";
export const CLICK_EVENT = "physicalai:analytics";
export const ANALYTICS_TIME_ZONE = "Asia/Shanghai";

export const analyticsConfig = {
  eventEndpoint: process.env.NEXT_PUBLIC_ANALYTICS_EVENT_ENDPOINT || null,
  summaryEndpoint: process.env.NEXT_PUBLIC_ANALYTICS_SUMMARY_ENDPOINT || null,
  // One public counter shared by both reading buttons, all URLs and all devices.
  counterKey: "internrobotics_physical_ai_book_reading_clicks_v1_6f492cd8" as string | null,
};

export type ClickData = { version: 1; daily: Record<string, number>; updatedAt: string | null; total?: number; historyAvailable?: boolean };
export type ClickDay = { date: string; clicks: number };
export type ReadingClickEvent = {
  event: "reading_click"; event_id: string; occurred_at: string;
  source: "hero" | "preprint_resource"; destination: string;
};
type ClickStorage = Pick<Storage, "getItem" | "setItem">;

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: ANALYTICS_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
});

export function dateKey(at = new Date()) {
  const parts = dayFormatter.formatToParts(at);
  const value = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function emptyClickData(): ClickData {
  return { version: 1, daily: {}, updatedAt: null };
}

export function normalizeClickData(value: unknown): ClickData {
  const data = emptyClickData();
  if (!value || typeof value !== "object") return data;
  const input = value as Partial<ClickData>;
  if (input.version !== 1 || !input.daily || typeof input.daily !== "object" || Array.isArray(input.daily)) return data;
  for (const [key, count] of Object.entries(input.daily)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
    const day = new Date(`${key}T00:00:00Z`);
    if (!Number.isFinite(day.getTime()) || day.toISOString().slice(0, 10) !== key) continue;
    if (typeof count === "number" && Number.isSafeInteger(count) && count >= 0) data.daily[key] = count;
  }
  if (typeof input.updatedAt === "string" && Number.isFinite(Date.parse(input.updatedAt))) data.updatedAt = input.updatedAt;
  return data;
}

export function readLocalClicks(storage: ClickStorage): ClickData {
  const raw = storage.getItem(CLICK_STORAGE_KEY);
  if (!raw) return emptyClickData();
  try { return normalizeClickData(JSON.parse(raw)); } catch { return emptyClickData(); }
}

export function incrementLocalClicks(storage: ClickStorage, at = new Date()): ClickData {
  const data = readLocalClicks(storage);
  const day = dateKey(at);
  data.daily[day] = Math.min(Number.MAX_SAFE_INTEGER, (data.daily[day] ?? 0) + 1);
  data.updatedAt = at.toISOString();
  storage.setItem(CLICK_STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function clickSeries(data: ClickData, days: number, at = new Date()): ClickDay[] {
  const end = Date.parse(`${dateKey(at)}T00:00:00Z`);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(end - (days - index - 1) * 86400000).toISOString().slice(0, 10);
    return { date, clicks: data.daily[date] ?? 0 };
  });
}

export function totalClicks(data: ClickData) {
  if (typeof data.total === "number") return data.total;
  return Object.values(data.daily).reduce((sum, count) => Math.min(Number.MAX_SAFE_INTEGER, sum + count), 0);
}

export function clickCsv(data: ClickData) {
  if (data.historyAvailable === false) return `scope,reading_clicks\nall_visitors_both_reading_buttons,${totalClicks(data)}\n`;
  return "date,reading_clicks\n" + Object.entries(data.daily).sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => `${date},${count}`).join("\n") + "\n";
}

export function usesSharedCounter() {
  return Boolean(analyticsConfig.counterKey && !analyticsConfig.summaryEndpoint);
}

export async function sharedClickData(increment = false, signal?: AbortSignal): Promise<ClickData> {
  if (!analyticsConfig.counterKey) throw new Error("The shared counter is not configured.");
  const operation = increment ? "hit" : "get";
  const endpoint = `https://countapi.mileshilliard.com/api/v1/${operation}/${encodeURIComponent(analyticsConfig.counterKey)}`;
  const response = await fetch(endpoint, {
    signal, cache: "no-store", credentials: "omit", keepalive: increment,
    referrerPolicy: "no-referrer",
  });
  // A new key has no record until its first click. Reads must never increment it.
  if (!increment && response.status === 404) return { ...emptyClickData(), total: 0, historyAvailable: false };
  if (!response.ok) throw new Error("The shared click counter is temporarily unavailable.");
  const raw = await response.json();
  const value = raw?.value;
  if (!(typeof value === "number" || typeof value === "string" && /^\d+$/.test(value)) || !Number.isSafeInteger(Number(value)) || Number(value) < 0) {
    throw new Error("The shared counter returned an invalid count.");
  }
  return { ...emptyClickData(), total: Number(value), historyAvailable: false };
}

export function httpsEndpoint(endpoint: string | null): string | null {
  if (!endpoint) return null;
  try {
    const url = new URL(endpoint);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

// Only active after a collection endpoint is explicitly configured.
export function sendClickEvent(event: ReadingClickEvent) {
  if (!isReadingAvailable(event.destination)) return;
  const endpoint = httpsEndpoint(analyticsConfig.eventEndpoint);
  if (!endpoint) return;
  const body = JSON.stringify(event);
  try {
    if (typeof navigator.sendBeacon === "function" && navigator.sendBeacon(endpoint, body)) return;
  } catch { /* Fall back to a navigation-safe request. */ }
  try {
    void fetch(endpoint, { method: "POST", body, keepalive: true, credentials: "omit", headers: { "Content-Type": "text/plain;charset=UTF-8" } }).catch(() => {});
  } catch { /* Tracking must never interrupt the reading link. */ }
}

export async function trackReadingClick(destination: string, source: ReadingClickEvent["source"] = "preprint_resource") {
  if (typeof window === "undefined" || !isReadingAvailable(destination)) return;
  if (usesSharedCounter()) {
    try {
      // The server performs the increment; no device-local total is used here.
      const snapshot = await sharedClickData(true);
      window.dispatchEvent(new CustomEvent(CLICK_EVENT, { detail: { snapshot, source, destination } }));
    } catch {
      // Do not retry an ambiguous increment: the server may already have counted it.
      try { window.dispatchEvent(new CustomEvent(CLICK_EVENT)); } catch { /* Reading remains available. */ }
    }
    return;
  }
  const at = new Date();
  let saved = false;
  const save = () => { incrementLocalClicks(window.localStorage, at); saved = true; };
  try {
    // Serialize writes from multiple book tabs when Web Locks is available.
    if (navigator.locks?.request) await navigator.locks.request(CLICK_STORAGE_KEY, save);
    else save();
  } catch { /* Storage can be unavailable; navigation remains functional. */ }
  let eventId = `${at.getTime()}-${Math.random().toString(16).slice(2)}`;
  try { eventId = crypto.randomUUID(); } catch { /* A non-identifying fallback works in older browsers. */ }
  const event: ReadingClickEvent = {
    event: "reading_click", event_id: eventId, occurred_at: at.toISOString(),
    source, destination,
  };
  try { window.dispatchEvent(new CustomEvent(CLICK_EVENT, { detail: { ...event, local_recorded: saved } })); } catch { /* Optional integration hook. */ }
  sendClickEvent(event);
}
