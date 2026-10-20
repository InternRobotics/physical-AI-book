# Physical AI Monograph

The book website for the Physical Intelligence Team, Shanghai AI Laboratory.

[Website](https://internrobotics.github.io/physical-AI-book/) · [Reading analytics](https://internrobotics.github.io/physical-AI-book/analytics/)

The **final PDF edition** is available with open access. It covers concepts, technical foundations, methods, and challenges of intelligence that interacts with the physical world.

The website includes the book introduction, a three-part expandable table of contents, author information, the book PDF, an errata and reader feedback placeholder, citation, rights notice, and contact card. The desktop contents panels have equal fixed heights; chapters scroll inside their panels. On smaller screens, the parts stack vertically.

The homepage and Open-Access Edition card link to [the final PDF](https://internrobotics.github.io/physical-AI-book/paper/Physical-AI-Monograph.pdf). Both **Read the monograph** buttons record clicks, and the resource card displays their combined count.

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

The table of contents follows the final 388-page PDF dated October 19, 2026: three parts, twelve chapters, and sixty sections. Contributors begin on page 316, Terminology and Abbreviations on page 317, Notation on page 327, and References on page 343. Back-matter entries are maintained in `src/data/back-matter.json`.

The published file is `public/paper/Physical-AI-Monograph.pdf`; `bookPublication.url` points to it and `bookPublication.available` is `true`. To replace the edition, update the PDF and synchronize the contents, edition details, and citation before rebuilding. Local verification material belongs under the ignored `reference/` directory.

For questions, corrections, or feedback, email [physicalai@pjlab.org.cn](mailto:physicalai@pjlab.org.cn). The contact card displays this address and its **Contact us** button opens a new email. Update `contactInfo.email` to change the address.

The rights notice identifies respective rights holders and separates third-party permissions from the licence of the published edition. It does not claim that rights clearance has already been verified or assign an unconfirmed Creative Commons licence.

## Click analytics

Click counting is enabled for both reading buttons. Earlier placeholder test records are excluded. If the public reading link is disabled in the future, the counter returns to zero and no click events are recorded while it is disabled.

Both **Read the monograph** buttons now increment one shared, server-side counter through [CountAPI](https://countapi.mileshilliard.com/). Visitors, devices, browsers, and URL aliases all read the same cumulative total. Left clicks, keyboard activation, and middle clicks count once; page views, refreshes, and right clicks do not increment it. These are button clicks, not unique readers or successful downloads.

The public counter key is defined in `src/lib/analytics.ts`. The API's `/hit/` operation increments it and `/get/` reads it. Refreshing cannot create a click. Counts are refreshed on focus and every 30 seconds while the page is visible, and successful clicks update the current page immediately. Reading links remain usable if the counter service fails; the website never substitutes a device-local total for the shared count.

Global counting starts with this integration. Earlier browser-local counts cannot be recovered or reliably merged, so they are excluded. The hosted API supplies an all-time total, not daily history; the dashboard displays and exports that total without inventing historical data.

This is a free public counter without account ownership or authentication. Anyone who knows the key can access its public API, including the provider's value-setting operation. It is intended for informal website engagement statistics, not an audited or tamper-proof download metric. The site sends only the counter key, without cookies, visitor IDs, or local browser records. Provider details are documented [here](https://countapi.mileshilliard.com/).

Optional HTTPS interfaces support replacing the hosted counter with a controlled backend and daily analytics:

| Configuration | Purpose |
| --- | --- |
| `NEXT_PUBLIC_ANALYTICS_EVENT_ENDPOINT` | Receives click events via POST |
| `NEXT_PUBLIC_ANALYTICS_SUMMARY_ENDPOINT` | Supplies aggregated daily data via GET |

For development, copy `.env.example` to `.env.local`. For GitHub Pages, configure both repository Actions variables and rebuild. Leaving them empty keeps the shared hosted counter active. A custom summary endpoint activates the custom-backend path; configure the collection endpoint with it so new clicks reach the same backend. The daily charts, table, and daily CSV export are available with that backend. Dates use Asia/Shanghai (UTC+8).

The collection payload is JSON sent with a `text/plain` content type:

```json
{"event":"reading_click","event_id":"unique-event-id","occurred_at":"2026-10-18T08:00:00Z","source":"preprint_resource","destination":"https://example.org/book.pdf"}
```

The backend should deduplicate `event_id`, aggregate dates in Asia/Shanghai, and return this summary with CORS access for the website:

```json
{"version":1,"daily":{"2026-10-18":12},"updatedAt":"2026-10-18T08:00:00Z"}
```

The event's `source` is `hero` or `preprint_resource`; both must contribute to the same total. No visitor fingerprint or persistent visitor identifier is generated. Storage or collection failures do not block the enabled reading link.

## Citation

```bibtex
@misc{zhang2026physicalai,
  author = {Zhang, Weinan and Shen, Chunhua and Xue, Tianfan and Zhao, Bin and Jiang, Bingqi and Guo, Zihan and Cui, Zicai and Li, Yang and Zhou, Ming and Chen, Xinyuan and Ding, Lihe and Chen, Xiao and Wang, Yujin and Guo, Shi and Dong, Junting and Lu, Tao and Shen, Xing and Guo, Haoyu and Mu, Yao and Yu, Haiyong and Ma, Haoxiang and Huang, Fuxian and Yu, Qiaojun and Zhou, Yunsong and Li, Kailin and Wang, Zirui and Xue, Yufei and Zeng, Weishuai and Huang, Tao and Wang, Zhigang and Liu, Junli and Wu, Pengyuan and Zhang, Pingrui and Wang, Haotian and Zhou, Dongzhan and Cao, Jiafei and Yuan, Feng and Ye, Xinyi and Xuan, Quanli and Yu, Mulin and Gu, Shangding and Song, Kaiwen and Wang, Dong and Li, Jiarui and Liu, Kehui and Jia, Zhongjie and Li, Dongjiang and Bao, Jiacheng and Yang, Haoran and Chen, Zhaoqing and Sun, Yiming and Zhou, Bowen},
  title = {{Physical AI}: Concepts, Techniques, and Challenges},
  year = {2026},
  url = {https://internrobotics.github.io/physical-AI-book/paper/Physical-AI-Monograph.pdf},
}
```
