import { getContextualPosts } from "@/lib/getContextualPosts";
import DigitalClientPage from "./DigitalClientPage";
import { getPageMetadata } from "@/lib/getPageMetadata";

export const revalidate = 0; // Always fetch fresh database content on request

export async function generateMetadata() {
  return getPageMetadata("digital", {
    title: "High-Impact Digital Experiences Tailored for Growth",
    description: "We couple modern user-centric aesthetics, robust code frameworks, and strategic technology consulting to establish high-performing digital architectures for global brands.",
  });
}

export default async function DigitalServicesPage() {
  const posts = await getContextualPosts("Design");
  return <DigitalClientPage posts={posts} />;
}
