import { getContextualPosts } from "@/lib/getContextualPosts";
import AISolutionsClientPage from "./AISolutionsClientPage";
import { getPageMetadata } from "@/lib/getPageMetadata";

export const revalidate = 0; // Always fetch fresh database content on request

export async function generateMetadata() {
  return getPageMetadata("ai-solutions", {
    title: "AI Solutions",
    description: "Discover cutting-edge AI and Machine Learning solutions tailored for enterprise growth and digital transformation.",
  });
}

export default async function AISolutionsPage() {
  // Fetch AI or Engineering related blog posts from the CMS
  const posts = await getContextualPosts("AI");
  return <AISolutionsClientPage posts={posts} />;
}
