import { projectInfo } from "@/data/project-page";
import { assetPath } from "@/lib/asset-path";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const normalizePathCase = `(function () {
  var canonical = ${JSON.stringify(basePath)};
  var pathname = window.location.pathname;
  var prefix = pathname.split("/")[1];
  if (!canonical || !prefix || "/" + prefix === canonical || ("/" + prefix).toLowerCase() !== canonical.toLowerCase()) return;
  var suffix = pathname.slice(prefix.length + 1) || "/";
  window.location.replace(canonical + suffix + window.location.search + window.location.hash);
})();`;

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-5 px-6 py-16" data-physical-ai-404="case-alias-v1">
      <script dangerouslySetInnerHTML={{ __html: normalizePathCase }} />
      <p className="section-eyebrow">{projectInfo.name}</p>
      <h1 className="text-4xl font-semibold tracking-tight">Page Not Found</h1>
      <p className="leading-8 text-muted-foreground">This page could not be found. You can continue from the monograph website.</p>
      <a className="w-fit font-semibold text-primary underline-offset-4 hover:underline" href={assetPath("/")}>Back to the monograph →</a>
    </main>
  );
}
