import { getPayloadClient } from "@/lib/getPayload";

export interface MappedPost {
  id: string | number;
  title: string;
  slug: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  author: string;
  image: string;
  excerpt: string;
}

const STATIC_FALLBACKS: MappedPost[] = [
  {
    id: "the-subtle-color-decisions",
    title: "The Subtle Color Decisions That Make or Break a Website",
    slug: "the-subtle-color-decisions-that-make-or-break-a-website",
    date: "April 23, 2026",
    category: "Design",
    tags: ["Web Design", "Design"],
    readTime: "5 min read",
    author: "JWay Group",
    image: "/header.png",
    excerpt: "When we look back at past website projects, the biggest improvements rarely came from color hierarchy.",
  },
  {
    id: "the-talent-retention-playbook",
    title: "The Talent Retention Playbook Nobody Talks About",
    slug: "the-talent-retention-playbook-nobody-talks-about",
    date: "April 13, 2026",
    category: "Staffing",
    tags: ["Staffing", "HR"],
    readTime: "6 min read",
    author: "JWay Group",
    image: "/blog/Gemini_Generated_Image_qw6peeqw6peeqw6p.png",
    excerpt: "Companies obsess over hiring. Retention is not an HR initiative; it is a leadership discipline.",
  },
  {
    id: "hidden-cost-shared-responsibility",
    title: "The Hidden Cost of Shared Responsibility: Why Your Org Chart is Killing Your Margins",
    slug: "the-hidden-cost-of-shared-responsibility-why-your-org-chart-is-killing-your-margins-stop-hiring-for-titles-start-hiring-for-bottlenecks",
    date: "March 25, 2026",
    category: "Strategy",
    tags: ["Strategy", "Leadership"],
    readTime: "7 min read",
    author: "JWay Group",
    image: "/blog/c661f4e6bd86f8af5309890e20c631c5.jpg",
    excerpt: "Emerging constraints deserve dedicated owners before standard titles exist.",
  }
];

export async function getContextualPosts(categoryKey: string): Promise<MappedPost[]> {
  try {
    const payload = await getPayloadClient();

    const VALID_CATEGORIES = ["Design", "Enterprise", "Staffing", "Strategy", "Technology", "General"];
    const isCategoryValid = VALID_CATEGORIES.includes(categoryKey);

    const whereClause = isCategoryValid
      ? {
          or: [
            {
              category: {
                equals: categoryKey,
              },
            },
            {
              tags: {
                like: categoryKey,
              },
            },
          ],
        }
      : {
          tags: {
            like: categoryKey,
          },
        };

    // 1. Fetch relevant posts by category or tags
    const relevantRes = await payload.find({
      collection: "posts",
      limit: 3,
      sort: "-publishedDate",
      where: whereClause,
    });

    let posts: MappedPost[] = [];

    if (relevantRes.docs && relevantRes.docs.length > 0) {
      posts = relevantRes.docs.map(mapDoc);
    }

    // 2. If we have fewer than 3 posts, fill the remaining slots with latest general posts
    if (posts.length < 3) {
      const excludedIds = posts.map((p) => p.id);
      
      const fallbackRes = await payload.find({
        collection: "posts",
        limit: 3 - posts.length,
        sort: "-publishedDate",
        where: excludedIds.length > 0 ? {
          id: {
            not_in: excludedIds,
          },
        } : undefined,
      });

      if (fallbackRes.docs && fallbackRes.docs.length > 0) {
        const paddedPosts = fallbackRes.docs.map(mapDoc);
        posts = [...posts, ...paddedPosts];
      }
    }

    // 3. If we STILL have fewer than 3 posts (e.g. database empty), pad with static fallbacks
    if (posts.length < 3) {
      const existingTitles = posts.map((p) => p.title);
      const remainingStatic = STATIC_FALLBACKS.filter((p) => !existingTitles.includes(p.title));
      posts = [...posts, ...remainingStatic].slice(0, 3);
    }

    return posts;
  } catch (e) {
    console.warn(`Failed to fetch contextual posts for ${categoryKey}:`, e);
    // Graceful fallback to static posts
    return STATIC_FALLBACKS.slice(0, 3);
  }
}

function mapDoc(doc: any): MappedPost {
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
    excerpt: doc.summary || "",
  };
}
