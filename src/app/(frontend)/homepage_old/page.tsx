import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import TrustedLogos from "@/components/TrustedLogos";
import ServicesGrid from "@/components/ServicesGrid";
import LatestPosts from "@/components/LatestPosts";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { getPayloadClient } from "@/lib/getPayload";
import { getPageMetadata } from "@/lib/getPageMetadata";

export const revalidate = 0; // Always fetch fresh database content on request

export async function generateMetadata() {
  return getPageMetadata("homepage_old", {
    title: "28+ Years of Technology and Digital Solutions",
    description: "10M+ talent reach across multiple industries and professions. 25k+ prequalified talent database, 100+ projects.",
  });
}

const STATIC_FALLBACK_POSTS = [
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
    excerpt: "When we look back at past website projects, the biggest improvements rarely came from dramatic redesigns. The layout was solid, but something felt slightly disconnected.",
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
    excerpt: "Companies obsess over hiring. They track time to fill, salary bands, and celebrates. Then six months later, those same hires are quietly updating their resumes.",
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
    excerpt: "Two years ago, most companies did not have a marketplace profitability lead or a lifecycle monetization director. The top performers assigned ownership early.",
  }
];

export default async function OldHome() {
  let latestPosts: any[] = STATIC_FALLBACK_POSTS;

  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "posts",
      limit: 3,
      sort: "-publishedDate",
    });

    if (res.docs && res.docs.length > 0) {
      latestPosts = res.docs.map((doc: any) => {
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
        };
      });
    }
  } catch (e) {
    console.warn("Failed to fetch live CMS posts on homepage, falling back to static:", e);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSlider />
        <TrustedLogos />
        <ServicesGrid />
        <LatestPosts posts={latestPosts} />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
