# Physical AI Monograph

The book website for the Physical Intelligence Team, Shanghai AI Laboratory.

[Website](https://internrobotics.github.io/physical-AI-book/) · [Reading analytics](https://internrobotics.github.io/physical-AI-book/analytics/)

The **final PDF edition** is available with open access. It covers concepts, technical foundations, methods, and challenges of intelligence that interacts with the physical world.

The website includes the book introduction, a three-part expandable table of contents, author information, companion resources, citation, rights notice, and contact card. The desktop contents panels have equal fixed heights; chapters scroll inside their panels. On smaller screens, the parts stack vertically.

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

Set `contactInfo.email` to enable **Contact us**. Until then, the button stays disabled and the card explains that the email will be announced.

The rights notice identifies respective rights holders and separates third-party permissions from the licence of the published edition. It does not claim that rights clearance has already been verified or assign an unconfirmed Creative Commons licence.

## Click analytics

Click counting is enabled for both reading buttons. Earlier placeholder test records are excluded. If the public reading link is disabled in the future, the counter returns to zero and no click events are recorded while it is disabled.

Left clicks, keyboard activation, and middle clicks on either reading button record `reading_click` events. By default, counts are saved only in the current browser under `physicalai:reading-clicks:published:v1`. They are button clicks, not unique readers or successful downloads. Different visitors, devices, and browsers are not combined. Clearing browser data removes local records.

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
@misc{zhang2026physicalai,
  author = {Zhang, Weinan and Shen, Chunhua and Xue, Tianfan and Zhao, Bin and Jiang, Bingqi and Guo, Zihan and Cui, Zicai and Li, Yang and Zhou, Ming and Chen, Xinyuan and Ding, Lihe and Chen, Xiao and Wang, Yujin and Guo, Shi and Dong, Junting and Lu, Tao and Shen, Xing and Guo, Haoyu and Mu, Yao and Yu, Haiyong and Ma, Haoxiang and Huang, Fuxian and Yu, Qiaojun and Zhou, Yunsong and Li, Kailin and Wang, Zirui and Xue, Yufei and Zeng, Weishuai and Huang, Tao and Wang, Zhigang and Liu, Junli and Wu, Pengyuan and Zhang, Pingrui and Wang, Haotian and Zhou, Dongzhan and Cao, Jiafei and Yuan, Feng and Ye, Xinyi and Xuan, Quanli and Yu, Mulin and Gu, Shangding and Song, Kaiwen and Wang, Dong and Li, Jiarui and Liu, Kehui and Jia, Zhongjie and Li, Dongjiang and Bao, Jiacheng and Yang, Haoran and Chen, Zhaoqing and Sun, Yiming and Zhou, Bowen},
  title = {{Physical AI}: Concepts, Techniques, and Challenges},
  year = {2026},
  url = {https://internrobotics.github.io/physical-AI-book/paper/Physical-AI-Monograph.pdf},
}
```
