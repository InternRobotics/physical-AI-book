# Physical AI Monograph

The book website for the Physical Intelligence Team, Shanghai AI Laboratory.

[Website](https://internrobotics.github.io/physical-AI-book/) · [Reading analytics](https://internrobotics.github.io/physical-AI-book/analytics/)

The monograph is **in press, with open access**. It covers concepts, technical foundations, methods, and challenges of intelligence that interacts with the physical world.

The website includes the book introduction, a three-part expandable table of contents, author information, companion resources, citation, rights notice, and contact card. The desktop contents panels have equal fixed heights; chapters scroll inside their panels. On smaller screens, the parts stack vertically.

The public reading link is currently disabled. The Open-Access Manuscript card displays **Read the monograph** and a zero click count. No unpublished PDF is included in the website or its static export.

## Development

Requires Node.js 20.9+ and pnpm. The pnpm version is specified in `package.json`.

```sh
pnpm install
pnpm dev
pnpm build
pnpm test:analytics
```

The site uses Next.js static export. GitHub Pages builds on pushes to `main`; the workflow obtains the deployment base path from GitHub Pages configuration. For a local production build at the public path:

```sh
NEXT_PUBLIC_BASE_PATH=/physical-AI-book pnpm build
```

On Windows, `scripts/build.ps1` also supports the bundled Node runtime.

## Updating content

| Content | Location |
| --- | --- |
| Book name, publication status, edition information, citation, rights notice | `src/data/project-page.ts` |
| Parts, chapters, sections, page numbers | `src/data/contents.json` |
| Public reading URL and availability switch | `src/data/publication.ts` |
| Click persistence, transport, aggregation | `src/lib/analytics.ts` |
| Reading counter and analytics dashboard | `src/components/analytics/` |
| Page sections and layout | `src/components/research-page/` |
| Theme and responsive styles | `src/app/globals.css` |
| Cover artwork and figures | `public/images/monograph/` |

The page numbers reflect the latest supplied 389-page manuscript; references begin on page 344. Unpublished source manuscripts and local verification files belong under `reference/`, which is ignored by Git and excluded from deployment. Do not place private manuscripts under `public/`.

When a reading edition is ready, set `bookPublication.url` to its public HTTPS publication page or PDF URL, or a root-relative public PDF path, and set `bookPublication.available` to `true`. Rebuild the site to enable the reading button and start counting. Both settings are required. The button is independent of the eventual publication platform.

Set `contactInfo.email` to enable **Contact us**. Until then, the button stays disabled and the card explains that the email will be announced.

The rights notice identifies respective rights holders and separates third-party permissions from the licence of the published edition. It does not claim that rights clearance has already been verified or assign an unconfirmed Creative Commons licence.

## Click analytics

The homepage counter and dashboard remain at **0** while the reading button is disabled. No click records or analytics requests are generated in this state. Earlier placeholder test records are excluded.

After release, left clicks, keyboard activation, and middle clicks on the enabled reading link record `reading_click` events. By default, counts are saved only in the current browser under `physicalai:reading-clicks:published:v1`. They are button clicks, not unique readers or successful downloads. Different visitors, devices, and browsers are not combined. Clearing browser data removes local records.

The dashboard provides totals, today's count, the last seven days, 7/30/90-day charts, a daily table, and CSV export. Dates use Asia/Shanghai (UTC+8).

Optional HTTPS interfaces are reserved for future global collection:

| Configuration | Purpose |
| --- | --- |
| `NEXT_PUBLIC_ANALYTICS_EVENT_ENDPOINT` | Receives click events via POST |
| `NEXT_PUBLIC_ANALYTICS_SUMMARY_ENDPOINT` | Supplies aggregated daily data via GET |

For development, copy `.env.example` to `.env.local`. For GitHub Pages, configure repository Actions variables with these names and rebuild. Leave them empty for browser-local counts. A summary endpoint is required to display global counts; a collection endpoint alone does not aggregate local counts in the dashboard.

The collection payload is JSON sent with a `text/plain` content type:

```json
{"event":"reading_click","event_id":"unique-event-id","occurred_at":"2026-10-18T08:00:00Z","source":"preprint_resource","destination":"https://example.org/book.pdf"}
```

The backend should deduplicate `event_id`, aggregate dates in Asia/Shanghai, and return this summary with CORS access for the website:

```json
{"version":1,"daily":{"2026-10-18":12},"updatedAt":"2026-10-18T08:00:00Z"}
```

No visitor fingerprint or persistent visitor identifier is generated. Storage or collection failures do not block the enabled reading link.

## Citation

```bibtex
@misc{physicalai2026monograph,
  title  = {Physical AI Monograph},
  author = {{Physical Intelligence Team, Shanghai AI Laboratory}},
  year   = {2026},
  note   = {In press; open access}
}
```
