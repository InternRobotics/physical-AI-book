// Set a public reading URL (PDF or publication page) and available: true together.
export const bookPublication = {
  url: null as string | null,
  available: false,
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
