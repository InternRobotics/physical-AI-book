"use client";

import { useEffect, useState } from "react";
import { isReadingAvailable } from "@/data/publication";
import { CLICK_EVENT, CLICK_STORAGE_KEY, analyticsConfig, emptyClickData, httpsEndpoint, normalizeClickData, readLocalClicks, type ClickData } from "@/lib/analytics";

export function useClickData() {
  const available = isReadingAvailable();
  const global = available && Boolean(analyticsConfig.summaryEndpoint);
  const [data, setData] = useState<ClickData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let alive = true, revision = 0;
    const controller = new AbortController();
    const refresh = async () => {
      const request = ++revision;
      if (alive) setLoading(true);
      try {
        let snapshot: ClickData;
        if (!available) snapshot = emptyClickData();
        else if (global) {
          const endpoint = httpsEndpoint(analyticsConfig.summaryEndpoint);
          if (!endpoint) throw new Error("The summary endpoint needs a valid HTTPS URL.");
          const response = await fetch(endpoint, { signal: controller.signal, cache: "no-store", credentials: "omit" });
          if (!response.ok) throw new Error("The global summary is unavailable. Please try again later.");
          const raw = await response.json();
          if (!raw || raw.version !== 1 || !raw.daily || typeof raw.daily !== "object" || Array.isArray(raw.daily)) throw new Error("The summary service returned an unsupported data format.");
          snapshot = normalizeClickData(raw);
        } else snapshot = readLocalClicks(window.localStorage);
        if (alive && request === revision) { setData(snapshot); setError(null); }
      } catch (cause) {
        if (alive && request === revision) {
          setData(null);
          setError(global ? cause instanceof Error ? cause.message : "The summary service is unavailable." : "Browser storage is unavailable. Click counts cannot be saved or read here.");
        }
      } finally { if (alive && request === revision) setLoading(false); }
    };
    const storageChanged = (event: StorageEvent) => { if (event.key === CLICK_STORAGE_KEY) void refresh(); };
    const visible = () => { if (document.visibilityState === "visible") void refresh(); };
    void refresh();
    window.addEventListener(CLICK_EVENT, refresh);
    window.addEventListener("storage", storageChanged);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", visible);
    return () => { alive = false; controller.abort(); window.removeEventListener(CLICK_EVENT, refresh); window.removeEventListener("storage", storageChanged); window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", visible); };
  }, [global, available, refreshKey]);

  return { data, loading, error, available, global, refresh: () => setRefreshKey((key) => key + 1) };
}
