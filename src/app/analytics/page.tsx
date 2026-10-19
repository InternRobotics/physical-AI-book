import type { Metadata } from "next";
import { ClickDashboard } from "@/components/analytics/click-dashboard";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/research-page/project-sections";

export const metadata: Metadata = {
  title: "Reading Link Analytics",
  description: "Click statistics for the Physical AI Monograph’s reading button.",
  robots: { index: false, follow: false },
};

export default function AnalyticsPage() {
  return <><SiteHeader home /><main id="main-content" className="analytics-main px-5"><ClickDashboard /></main><SiteFooter /></>;
}
