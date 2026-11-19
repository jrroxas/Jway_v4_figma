import { getContextualPosts } from "@/lib/getContextualPosts";
import StaffingClientPage from "./StaffingClientPage";
import { getPageMetadata } from "@/lib/getPageMetadata";

export const revalidate = 0; // Always fetch fresh database content on request

export async function generateMetadata() {
  return getPageMetadata("staffing", {
    title: "Scale Your Capabilities with Top-Tier Tech Talent",
    description: "Skip the hiring headache. JWay Group bridges the gap between ambitious enterprises and exceptional, pre-vetted professionals.",
  });
}

export default async function StaffingServicesPage() {
  const posts = await getContextualPosts("Staffing");
  return <StaffingClientPage posts={posts} />;
}
