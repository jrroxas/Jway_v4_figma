import { getPayloadClient } from "@/lib/getPayload";
import BlogClientPage from "./BlogClientPage";
import { getPageMetadata } from "@/lib/getPageMetadata";

export const revalidate = 0; // Always fetch fresh database content on request

export async function generateMetadata() {
  return getPageMetadata("blog", {
    title: "JWay Resources & Blogs",
    description: "Stay updated with the latest industry insights in technology, UI/UX web design, smart staffing strategy, and global remote careers.",
  });
}

export default async function BlogPage() {
  let mappedPosts: any[] = [];

  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "posts",
      limit: 100,
      sort: "-publishedDate",
    });

    if (res.docs && res.docs.length > 0) {
      mappedPosts = res.docs.map((doc: any) => {
        const tags = doc.tags ? doc.tags.split(",").map((t: string) => t.trim()) : [];
        return {
          id: doc.id,
          title: doc.title,
          slug: doc.slug,
          date: new Date(doc.publishedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          category: doc.category || "General",
          tags: tags,
          readTime: doc.readTime || "5 min read",
          author: doc.authorName || "JWay Group",
          image: doc.coverImageUrl || "/header.png",
          excerpt: doc.summary,
          keyPoints: doc.summary ? [doc.summary.substring(0, 80) + "..."] : [],
        };
      });
    }
  } catch (e) {
    console.warn("Failed to fetch live CMS posts on server, falling back to static:", e);
  }

  return <BlogClientPage initialPosts={mappedPosts} />;
}
