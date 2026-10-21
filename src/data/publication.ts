// Public reading destination. Keep the release switch and URL in sync.
export const bookPublication = {
  url: "https://arxiv.org/abs/2610.27045" as string | null,
  available: true,
};

export function isReadingAvailable(destination = bookPublication.url) {
  if (!bookPublication.available || !destination || destination !== bookPublication.url) return false;
  try {
    if (destination.startsWith("/") && !destination.startsWith("//")) {
      const local = new URL(destination, "https://physical-ai-book.invalid");
      return local.origin === "https://physical-ai-book.invalid" && local.pathname.toLowerCase().endsWith(".pdf");
    }
    const url = new URL(destination);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}
