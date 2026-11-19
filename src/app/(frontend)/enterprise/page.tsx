import { getContextualPosts } from "@/lib/getContextualPosts";
import EnterpriseClientPage from "./EnterpriseClientPage";
import { getPageMetadata } from "@/lib/getPageMetadata";

export const revalidate = 0; // Always fetch fresh database content on request

export async function generateMetadata() {
  return getPageMetadata("enterprise", {
    title: "Scale Fearlessly with Silicon Valley Expertise",
    description: "For over 28 years, JWay Group has delivered high-impact web, cloud, and CRM integrations to global enterprise leaders. Secure, process-driven, and meticulously engineered.",
  });
}

export default async function EnterpriseServicesPage() {
  const posts = await getContextualPosts("Enterprise");
  return <EnterpriseClientPage posts={posts} />;
}
