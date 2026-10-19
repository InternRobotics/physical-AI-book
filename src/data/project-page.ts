// Edition details verified against the final Physical_AI___Monograph-2.pdf.
import { bookPublication } from "@/data/publication";

export type ImageAsset = { src: string | null; width: number; height: number; alt: string };

export const projectInfo = {
  name: "Physical AI Monograph",
  fullTitle: "Physical AI Monograph",
  subtitle: ["Concepts, Techniques, and Challenges"],
  status: "Final edition · Open access",
  editionNote: "Final PDF edition · October 19, 2026",
  description: "A monograph on intelligence that perceives, models, and acts upon the physical world, connecting technical foundations with embodied systems and the challenges of Physical AGI.",
  team: "Physical Intelligence Team, Shanghai AI Laboratory",
  year: "2026",
  pageCount: 388,
  readingUrl: bookPublication.url,
  publisher: null as string | null,
  publicationDate: "October 19, 2026" as string | null,
  purchaseUrl: null as string | null,
};

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Contents", href: "#contents" },
  { label: "Authors", href: "#authors" },
  { label: "Resources", href: "#resources" },
  { label: "Citation", href: "#bibtex" },
  { label: "Contact", href: "#contact" },
];

export const authors = [{ id: "physical-intelligence-team", name: projectInfo.team }];
export const teamLogos: (ImageAsset & { id: string })[] = [
  { id: "shanghai-ai-laboratory", src: "/images/ailab-logo.png", width: 672, height: 390, alt: "Shanghai Artificial Intelligence Laboratory" },
];
export const heroActions = [
  { label: "Read the monograph", href: bookPublication.url, icon: "pdf" },
  { label: "Table of contents", href: "#contents", icon: "contents" },
  { label: "Resources", href: "#resources", icon: "resources" },
  { label: "BibTeX", href: "#bibtex", icon: "citation" },
];
export const bookCover: ImageAsset = {
  src: "/images/monograph/cover-v4.png",
  width: 1024,
  height: 1536,
  alt: "Book cover of Physical AI Monograph",
};
export const figures: Record<string, ImageAsset> = {
  teaser: { src: "/images/monograph/progression.png", width: 1212, height: 372, alt: "Figure 1.1: progression from digital tools and simulated agents to real-world agents, multi-agent collaboration, and infrastructure-level physical intelligence" },
  framework: { src: "/images/monograph/closed-loop-v2.svg", width: 1446, height: 1059, alt: "Figure 1.3: perception, world modeling, decision-making, and control connected through physical feedback, data, and hardware" },
};

export const aboutParagraphs = [
  "Physical AI is developing rapidly, yet its definition, technical landscape, and central challenges remain open questions. This monograph brings these questions together through a unified framework: artificial systems that perceive, model, and act upon the physical world through continuous feedback under real-world constraints.",
  "It distinguishes Physical AI from digital AI, embodied AI, cyber-physical systems, and digital twins, and develops its foundations across physics, control, cognition, learning, and reasoning. The technical survey connects multimodal perception, physical data and simulation, world models, embodied foundation models, motor control, physical agents, and hardware–software co-design.",
  "Applications span robotics, manufacturing, infrastructure, scientific experimentation, and autonomous services. The monograph examines sim-to-real transfer, reliability, real-time execution, evaluation, safety, governance, and sustained deployment, before considering the research directions toward more general physical intelligence and Physical AGI.",
];
export const coreElements = [
  { number: "01", title: "Perceive", body: "Estimate physical states from vision, touch, force, proprioception, and other sensing modalities." },
  { number: "02", title: "Model & Predict", body: "Represent physical relationships and anticipate the consequences of possible actions." },
  { number: "03", title: "Decide & Act", body: "Connect goals, planning, and control to feasible interventions in the physical world." },
  { number: "04", title: "Adapt Through Feedback", body: "Verify outcomes, revise behavior, and learn across control, task, and deployment timescales." },
];
export const partDescriptions: Record<string, string> = {
  i: "Definitions, boundaries, and the foundations in physics, control, cognition, and learning.",
  ii: "The technical stack: perception, data, world models, manipulation, motor control, agents, and systems.",
  iii: "General physical intelligence, evaluation and governance, and long-term development strategies.",
};
export const resources: { id: string; title: string; description: string; label: string; href: string | null; icon: "pdf" | "code" | "slides" | "errata" }[] = [
  { id: "preprint", title: "Open-Access Edition", description: "Read and download the final PDF edition of the monograph.", label: "Read the monograph", href: bookPublication.url, icon: "pdf" },
  { id: "code", title: "Code & Examples", description: "A space for companion implementations and examples. Links will be added when available.", label: "Coming soon", href: null, icon: "code" },
  { id: "slides", title: "Lecture Slides", description: "A space for chapter slides and teaching materials to accompany the monograph.", label: "Coming soon", href: null, icon: "slides" },
  { id: "errata", title: "Errata & Feedback", description: "Corrections and a reader feedback channel will be added here when available.", label: "Coming soon", href: null, icon: "errata" },
];
export const contactInfo = {
  name: "InternRobotics",
  email: null as string | null,
};
export const rightsNotice = "Copyright and other intellectual property rights in this monograph and any third-party material remain with their respective rights holders. The final PDF edition is available with open access. Reuse is governed by the licence accompanying the edition and any separate terms stated in third-party credit lines. For rights, attribution or permissions enquiries, please contact the team.";
export const citationText = "Zhang, W., Shen, C., Xue, T., et al. Physical AI: Concepts, Techniques, and Challenges. In press, with open access. 2026.";
export const bibtex = `@misc{zhang2026physicalai,
  author = {Zhang, Weinan and Shen, Chunhua and Xue, Tianfan and Zhao, Bin and Jiang, Bingqi and Guo, Zihan and Cui, Zicai and Li, Yang and Zhou, Ming and Chen, Xinyuan and Ding, Lihe and Chen, Xiao and Wang, Yujin and Guo, Shi and Dong, Junting and Lu, Tao and Shen, Xing and Guo, Haoyu and Mu, Yao and Yu, Haiyong and Ma, Haoxiang and Huang, Fuxian and Yu, Qiaojun and Zhou, Yunsong and Li, Kailin and Wang, Zirui and Xue, Yufei and Zeng, Weishuai and Huang, Tao and Wang, Zhigang and Liu, Junli and Wu, Pengyuan and Zhang, Pingrui and Wang, Haotian and Zhou, Dongzhan and Cao, Jiafei and Yuan, Feng and Ye, Xinyi and Xuan, Quanli and Yu, Mulin and Gu, Shangding and Song, Kaiwen and Wang, Dong and Li, Jiarui and Liu, Kehui and Jia, Zhongjie and Li, Dongjiang and Bao, Jiacheng and Yang, Haoran and Chen, Zhaoqing and Sun, Yiming and Zhou, Bowen},
  title = {{Physical AI}: Concepts, Techniques, and Challenges},
  year = {2026},
  url = {https://internrobotics.github.io/physical-AI-book/paper/Physical-AI-Monograph.pdf},
}`;
