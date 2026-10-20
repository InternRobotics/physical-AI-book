"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const manualInput = useRef<HTMLInputElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current !== null) clearTimeout(resetTimer.current);
  }, []);

  useEffect(() => {
    if (status === "failed") {
      manualInput.current?.focus();
      manualInput.current?.select();
    }
  }, [status]);

  async function copy() {
    if (resetTimer.current !== null) clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
      resetTimer.current = setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="contact-action flex max-w-full flex-col items-start gap-3 sm:items-end">
      <Button className="min-w-36" onClick={copy} title={`Copy ${email}`}>
        {status === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {status === "copied" ? "Copied" : "Copy Email"}
      </Button>
      <span aria-live="polite" role="status" className="sr-only">
        {status === "copied" ? "Email address copied to clipboard." : status === "failed" ? "Automatic copying is unavailable. The email address is selected below for manual copying." : ""}
      </span>
      {status === "failed" ? (
        <label className="flex max-w-full flex-col gap-2 text-sm text-muted-foreground">
          Copy the address below:
          <input
            aria-label="Email address to copy manually"
            className="w-64 max-w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
            onFocus={(event) => event.currentTarget.select()}
            readOnly
            ref={manualInput}
            type="text"
            value={email}
          />
        </label>
      ) : null}
    </div>
  );
}
