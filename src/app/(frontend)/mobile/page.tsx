import { getContextualPosts } from "@/lib/getContextualPosts";
import MobileClientPage from "./MobileClientPage";
import { getPageMetadata } from "@/lib/getPageMetadata";

export const revalidate = 0; // Always fetch fresh database content on request

export async function generateMetadata() {
  return getPageMetadata("mobile", {
    title: "Engaging Mobile Apps. Native Speed & Scale.",
    description: "Build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
  });
}

export default async function MobileServicesPage() {
  const posts = await getContextualPosts("Mobile");
  return <MobileClientPage posts={posts} />;
}
