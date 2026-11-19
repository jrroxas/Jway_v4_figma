"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMediaUrl } from "@/utils/media";

// ─── All 13 static fallback articles from jway.com/blog ───────────────────
const STATIC_POSTS = [
  {
    id: "the-subtle-color-decisions",
    title: "The Subtle Color Decisions That Make or Break a Website",
    slug: "the-subtle-color-decisions-that-make-or-break-a-website",
    date: "April 23, 2026",
    category: "Design",
    tags: ["Social Media", "Digital Marketing", "Web Design", "Digital", "Design"],
    readTime: "5 min read",
    author: "JWay Group",
    image: "/header.png",
    excerpt:
      "When we look back at past website projects, the biggest improvements rarely came from dramatic redesigns. Most of the time, the layout was solid. The messaging was clear. The offer made sense. But something felt slightly disconnected. In many of those cases, the issue came down to color.",
    keyPoints: [
      "Strong hierarchy beats busy design — restraint guides user action",
      "Color sets the tone before copy does — match palette to brand promise",
      "Consistency builds intuition — one action color, protected and repeated",
    ],
  },
  {
    id: "the-talent-retention-playbook",
    title: "The Talent Retention Playbook Nobody Talks About",
    slug: "the-talent-retention-playbook-nobody-talks-about",
    date: "April 13, 2026",
    category: "Staffing",
    tags: ["Staffing", "Offshore", "Leadership", "Strategy", "Recruitment", "Workforce", "Retention", "HR"],
    readTime: "6 min read",
    author: "JWay Group",
    image: "/blog/Gemini_Generated_Image_qw6peeqw6peeqw6p.png",
    excerpt:
      "Companies obsess over hiring. They track time to fill. They debate salary bands. They celebrate new members on LinkedIn. Then six months later, those same hires are quietly updating their resumes. Retention is not an HR initiative. It is a leadership discipline.",
    keyPoints: [
      "Disengagement comes before departure — watch for the silence",
      "The 90-day/9-month rule: test fit early, audit growth potential at month 9",
      "Perks don't create loyalty — impact and ownership do",
    ],
  },
  {
    id: "hidden-cost-shared-responsibility",
    title: "The Hidden Cost of Shared Responsibility: Why Your Org Chart is Killing Your Margins",
    slug: "the-hidden-cost-of-shared-responsibility-why-your-org-chart-is-killing-your-margins-stop-hiring-for-titles-start-hiring-for-bottlenecks",
    date: "March 25, 2026",
    category: "Strategy",
    tags: ["Inspiration", "Technology", "Staffing", "Offshore", "Leadership", "Strategy", "Recruitment", "Workforce"],
    readTime: "7 min read",
    author: "JWay Group",
    image: "/blog/c661f4e6bd86f8af5309890e20c631c5.jpg",
    excerpt:
      "Two years ago, most companies did not have a marketplace profitability lead, a retail media owner, a lifecycle monetization director, or a revenue systems head. Today, the companies outperforming their peers have something in common — they assigned ownership to emerging growth constraints before the titles became standard.",
    keyPoints: [
      "Structure is a strategy, not an administrative detail",
      "The Triangle of Effective Ownership: outcome, authority, executive sponsorship",
      "Hire builders not keyword matches — prioritize judgment and systems thinking",
    ],
  },
  {
    id: "hiring-is-not-broken",
    title: "Hiring Is Not Broken. Your Decision-Making Process Might Be.",
    slug: "hiring-is-not-broken.-your-decision-making-process-might-be",
    date: "May 18, 2026",
    category: "Staffing",
    tags: ["Staffing", "Hiring", "Strategy"],
    readTime: "6 min read",
    author: "JWay Group",
    image: "/blog/cover.png",
    excerpt:
      "Most companies don't have a recruitment problem. They have a thinking problem. Explore how flawed decision-making at the top is what's really slowing your hiring down.",
    keyPoints: [
      "The problem isn't sourcing — it's the decision framework",
      "Speed and consensus kill quality hires",
      "Fix the process before you fix the pipeline",
    ],
  },
  {
    id: "our-commitment-to-optimizely",
    title: "Our Commitment to Optimizely and What It Means for You",
    slug: "our-commitment-to-optimizely-and-what-it-means-for-you",
    date: "February 12, 2026",
    category: "Enterprise",
    tags: ["Enterprise", "Digital", "CMS", "Optimizely", "Strategy"],
    readTime: "6 min read",
    author: "JWay Group",
    image: "/blog/1-2.png",
    excerpt:
      "JWay is investing deeply in Optimizely as its enterprise CMS platform of choice, building toward Gold Partnership through certified engineering depth, real integration experience, and disciplined architecture.",
    keyPoints: [
      "Headless flexibility + structured governance in one platform",
      "CMS 12 certified engineers building against current APIs",
      "Salesforce, HubSpot & ODP integrations architected correctly",
    ],
  },
  {
    id: "why-early-year-decisions-hiring",
    title: "Why Early Year Decisions Shape Hiring Success More Than Q4 Budgets",
    slug: "why-early-year-decisions-shape-hiring-success-more-than-q4-budgets",
    date: "February 4, 2026",
    category: "Staffing",
    tags: ["Staffing", "Hiring", "Strategy", "Q4"],
    readTime: "8 min read",
    author: "JWay Group",
    image: "/blog/b6e6051f531e32d1f060e423d38c0173.jpg",
    excerpt:
      "The candidate you fire in Q4 usually was not a bad hire. They were the result of a bad decision made in Q1. Most hiring failures do not begin at the end of the year — they begin at the start of it.",
    keyPoints: [
      "Q1 decisions set the hiring trajectory for the entire year",
      "Budget availability isn't the same as hiring readiness",
      "Scope clarity and role definition must precede sourcing",
    ],
  },
  {
    id: "no-sandbox-projects",
    title: "No Sandbox Projects: How I Shipped a Production-Ready App in 16 Weeks",
    slug: "no-sandbox-projects-how-i-shipped-a-production-ready-app-in-16-weeks",
    date: "February 23, 2026",
    category: "Technology",
    tags: ["Technology", "Mobile", "Inspiration", "Mobile App"],
    readTime: "7 min read",
    author: "Micah Chen",
    image: "/blog/ee6b9a6bfb317bb7bbc719f2b15b5359.jpg",
    excerpt:
      "A JWay intern shares how they built Memory Bridge, a production-ready healthcare app, from Figma to Flutter in 16 weeks — learning design tradeoffs, scalable architecture, and professional accountability along the way.",
    keyPoints: [
      "Real ownership from day one — no sandbox, no safety net",
      "Flutter + Neon + Hasura Cloud production stack",
      "Scope cuts and weekly exec reviews as learning tools",
    ],
  },
  {
    id: "beyond-the-buzzwords-2025",
    title: "Beyond the Buzzwords: The Hard Lessons of 2025 That Will Dictate Your 2026 Strategy",
    slug: "beyond-the-buzzwords-the-hard-lessons-of-2025-that-will-dictate-your-2026-strategy",
    date: "January 8, 2026",
    category: "Strategy",
    tags: ["Strategy", "Leadership", "Growth"],
    readTime: "6 min read",
    author: "JWay Group",
    image: "/blog/fee20e3574a0d164c77a1166db0a0714.jpg",
    excerpt:
      "2025 wasn't just a year of change. It was a year of costly lessons that most businesses are still pretending didn't happen. Here are the real insights that should shape your 2026 strategy.",
    keyPoints: [
      "AI adoption separated performers from bystanders",
      "Remote culture maturity became a competitive differentiator",
      "Speed of decision-making outweighed size of budget",
    ],
  },
  {
    id: "4j-hub-app-store-journey",
    title: "Our Journey Publishing 4J-Hub on the App Store: Challenges, Rejections, and Lessons Learned",
    slug: "our-journey-publishing-4j-hub-on-the-app-store-challenges-rejections-and-lessons-learned",
    date: "December 19, 2025",
    category: "Technology",
    tags: ["Technology", "Mobile", "App Store", "iOS"],
    readTime: "9 min read",
    author: "JWay Group",
    image: "/blog/unnamed-2-3.png",
    excerpt:
      "Publishing an app to the App Store is never a straight line. We share the full story behind 4J-Hub and what we learned from each rejection and setback along the way.",
    keyPoints: [
      "Every rejection has a specific, fixable root cause",
      "App Store review guidelines evolve — stay updated",
      "The real work starts after the first submission",
    ],
  },
  {
    id: "getting-started-n8n",
    title: "Getting Started with n8n in Under 10 Minutes",
    slug: "getting-started-with-n8n-in-under-10-minutes",
    date: "December 4, 2025",
    category: "Technology",
    tags: ["Technology", "Automation", "n8n", "Workflow"],
    readTime: "5 min read",
    author: "JWay Group",
    image: "/blog/unnamed-2-2.png",
    excerpt:
      "n8n is a powerful open-source workflow automation tool that lets you connect apps and automate tasks without writing a single line of code. Here is how to get started in under 10 minutes.",
    keyPoints: [
      "Self-hostable and open-source — full data control",
      "Hundreds of built-in integrations for apps you already use",
      "Visual node-based builder requires zero coding",
    ],
  },
  {
    id: "smart-staffing-foundation",
    title: "Smart Staffing: The Foundation of a Strong Team",
    slug: "smart-staffing-the-foundation-of-a-strong-team",
    date: "November 17, 2025",
    category: "Staffing",
    tags: ["Staffing", "HR", "Recruitment"],
    readTime: "5 min read",
    author: "JWay Group",
    image: "/blog/ba369a176b8563c642da6d91015e14e3.jpg",
    excerpt:
      "Building a high-performing team starts before the first interview. Discover the smart staffing principles that separate reactive hiring from strategic talent acquisition.",
    keyPoints: [
      "Define role outcomes, not just job descriptions",
      "Culture fit is measurable — make it part of the process",
      "Structured onboarding determines 6-month retention",
    ],
  },
  {
    id: "implementing-reflect-qa",
    title: "Implementing Reflect cut QA Testing Time by 80%",
    slug: "implementing-reflect-cut-qa-testing-time-by-80",
    date: "November 5, 2025",
    category: "Technology",
    tags: ["Technology", "QA", "Testing", "Automation", "Reflect"],
    readTime: "5 min read",
    author: "JWay Group",
    image: "/blog/Banner-1.png",
    excerpt:
      "How JWay used Reflect, an AI-powered no-code testing platform, to dramatically reduce QA testing time by 80% — freeing developers to focus on building features that matter.",
    keyPoints: [
      "No-code test creation that non-engineers can maintain",
      "AI self-heals broken selectors automatically",
      "80% reduction in QA cycle time, zero test maintenance debt",
    ],
  },
  {
    id: "15-minute-magic-ai",
    title: "15-Minute Magic: Turning Complexity into Click-by-Click Guides with AI",
    slug: "15-minute-magic-turning-complexity-into-click-by-click-guides-with-ai",
    date: "June 10, 2025",
    category: "Technology",
    tags: ["Technology", "AI", "Productivity", "Documentation"],
    readTime: "5 min read",
    author: "JWay Group",
    image: "/blog/Banner-1.png",
    excerpt:
      "AI-powered documentation tools can turn complex workflows into clear, click-by-click guides in just 15 minutes — no writing required, just screen recording and a prompt.",
    keyPoints: [
      "Record once, generate guides automatically with AI",
      "Reduces onboarding documentation time by 90%",
      "Works for any software workflow without technical expertise",
    ],
  },
  {
    id: "certified-true-copies-philippines",
    title: "Certified True Copies Now Required for First-Time Jobseekers in the Philippines",
    slug: "certified-true-copies-now-required-for-first-time-jobseekers-in-the-philippines",
    date: "February 20, 2020",
    category: "Staffing",
    tags: ["News and Events", "Staffing"],
    readTime: "3 min read",
    author: "Marianne Pimentel",
    image: "https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/187_compressed.jpg",
    excerpt:
      "Private establishments in the Philippines are now required to accept only certified true copies of pre-employment documents from first-time jobseekers. This change is in line with the First-Time Jobseekers Act (Republic Act No. 11261), which seeks to reduce the financial burden on new entrants to the workforce.",
    keyPoints: [
      "RA 11261 mandates zero-cost initial government clearances for first-time jobseekers",
      "Private employers must accept certified true copies during application phase",
      "Original pre-employment documents required only upon official job offer",
    ],
  },
  {
    id: "flutter-cost-time-to-market",
    title: "Using Flutter to Optimize Your Costs and Time-to-Market",
    slug: "use-flutter-to-optimize-your-costs-and-time-to-market",
    date: "January 25, 2023",
    category: "Technology",
    tags: ["Flutter", "Mobile", "Technology", "Cost Optimization"],
    readTime: "6 min read",
    author: "JWay Group",
    image: "https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/scrnli_1_25_2023_12-02-03-PM-1.png",
    excerpt:
      "Putting your ideas into a real, working application takes a lot of time and money. Learn how Flutter's cross-platform framework cuts development costs and speeds up release timelines.",
    keyPoints: [
      "Single codebase for native Android and iOS apps",
      "Hot Reload feature speeds up iteration and bug fixes",
      "Streamlines QA testing and lowers team overhead",
    ],
  },
  {
    id: "traditional-vs-webflow",
    title: "Traditional versus Webflow: The Rise of No-Code Web Development Platform",
    slug: "traditional-versus-webflow-the-rise-of-no-code-web-development-platform",
    date: "February 4, 2022",
    category: "Technology",
    tags: ["Webflow", "No-Code", "Web Development", "Technology"],
    readTime: "6 min read",
    author: "JWay Group",
    image: "https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/jud-mackrill-Of_m3hMsoAA-unsplash.jpg",
    excerpt:
      "Cost and time are huge factors in web development. Discover how no-code platforms like Webflow enable rapid visual development without compromising performance.",
    keyPoints: [
      "Eliminates heavy manual markup and legacy table-driven layouts",
      "Visual CMS design reduces development timelines by 60%",
      "Empowers design teams while preserving enterprise code quality",
    ],
  },
  {
    id: "winning-recruitment-process",
    title: "7 Essential Tips to Develop a Winning Recruitment Process",
    slug: "7-essential-tips-to-develop-a-winning-recruitment-process",
    date: "November 5, 2021",
    category: "Staffing",
    tags: ["Staffing", "Recruitment", "HR", "Leadership"],
    readTime: "5 min read",
    author: "JWay Group",
    image: "https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/gabrielle-henderson-HJckKnwCXxQ-unsplash.jpg",
    excerpt:
      "Every business faces the challenge of finding top talent. Learn 7 actionable tips to build a winning recruitment strategy and attract high-caliber candidates.",
    keyPoints: [
      "Craft a structured recruitment plan aligned with business goals",
      "Maximize ATS automation for candidate tracking and screening",
      "Proactively engage passive candidates across social platforms",
    ],
  },
  {
    id: "blog-template-elements",
    title: "3 Most Important Elements of A Blog Template",
    slug: "3-most-important-elements-of-a-blog-template",
    date: "November 5, 2021",
    category: "Strategy",
    tags: ["Digital Marketing", "Blog Template", "Strategy", "Web Design"],
    readTime: "5 min read",
    author: "JWay Group",
    image: "https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/fikret-tozak-rfNLa1HL7eY-unsplash.jpg",
    excerpt:
      "Careful layout organization makes content easier to digest. Discover the 3 core structural elements of high-performing blog templates.",
    keyPoints: [
      "Clear visual hierarchy guides reader focus instantly",
      "Scannable typography formatting boosts engagement",
      "Strategic CTA placement turns readers into qualified leads",
    ],
  },
  {
    id: "flutter-internship-program",
    title: "13-week App Development Internship Program at JWay",
    slug: "13-week-app-development-internship-program-at-jway",
    date: "October 21, 2021",
    category: "Technology",
    tags: ["Internship", "Mobile", "Technology", "Flutter"],
    readTime: "6 min read",
    author: "JWay Group",
    image: "https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/Untitled-design-18.png",
    excerpt:
      "Inside JWay's 13-week engineering internship: building a production-ready Flutter app from initial design mockups to live executive presentations.",
    keyPoints: [
      "Full lifecycle experience from Figma ideation to Dart programming",
      "Weekly executive reviews build professional presenting skills",
      "Hands-on mentorship accelerates real-world software engineering",
    ],
  },
  {
    id: "crm-customer-approach",
    title: "5 Things That Will Change The Way You Approach Customers Using a CRM Tool",
    slug: "5-things-that-will-change-the-way-you-approach-customers-using-a-crm-tool",
    date: "July 10, 2020",
    category: "Technology",
    tags: ["CRM", "Zoho CRM", "Customer Relationship", "Technology"],
    readTime: "5 min read",
    author: "JWay Group",
    image: "https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/customer-relationship.jpg",
    excerpt:
      "A CRM tool tracks and unifies all customer interactions. See how leveraging Zoho CRM creates seamless prospect experiences and drives higher conversion.",
    keyPoints: [
      "Unified visibility across lead discovery and sales pipelines",
      "Automated follow-ups ensure zero missed opportunities",
      "Data-driven insights personalize every customer interaction",
    ],
  },
  {
    id: "ultimate-guide-online-store",
    title: "The Ultimate Guide To Create An Online Store",
    slug: "the-ultimate-guide-to-create-an-online-store",
    date: "May 27, 2020",
    category: "Technology",
    tags: ["Ecommerce", "Online Store", "Technology", "Tutorials"],
    readTime: "6 min read",
    author: "JWay Group",
    image: "https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/online-store.jpg",
    excerpt:
      "Transform your brick-and-mortar business or generate additional revenue online. Explore the step-by-step framework to launch a successful e-commerce store.",
    keyPoints: [
      "Select the right e-commerce platform for your product catalog",
      "Implement secure payment gateways and checkout optimization",
      "Design mobile-responsive storefronts built for conversion",
    ],
  },
];

const CATEGORIES = ["All", "Design", "Enterprise", "Staffing", "Strategy", "Technology"];

// ─── Job Highlights ─────────────────────────────────────────────────────────
const JOB_HIGHLIGHTS = [
  {
    title: "Senior .NET Developer",
    location: "Remote (Philippines / USA)",
    type: "Full-Time",
    category: "Engineering",
    description: "Architect, build, and support enterprise-scale .NET applications. Requires deep expertise in C#, ASP.NET Core, and cloud architecture.",
  },
  {
    title: "Full-Stack Developer",
    tech: "Laravel + Nuxt.js",
    location: "Remote (Philippines)",
    type: "Full-Time",
    category: "Engineering",
    description: "Design and implement modern web applications using PHP Laravel backend and Nuxt.js/Vue.js frontend frameworks.",
  },
  {
    title: "ML/AI Engineer",
    location: "Remote / Hybrid",
    type: "Full-Time",
    category: "AI & Innovation",
    description: "Develop, optimize, and integrate Machine Learning models and Gemini-based AI solutions into cloud ecosystems.",
  },
  {
    title: "Salesforce Lead Architect",
    location: "Remote",
    type: "Full-Time",
    category: "Enterprise Systems",
    description: "Lead the design and technical implementation of custom Salesforce systems, integrations, and administration.",
  },
  {
    title: "Data Analyst",
    tech: "Tableau & Power BI",
    location: "Remote",
    type: "Full-Time",
    category: "Data Analytics",
    description: "Transform complex data sets into actionable visual insights, interactive dashboards, and business strategy reports.",
  },
  {
    title: "Accountant",
    tech: "US Taxation Expert",
    location: "Remote (PH Operations)",
    type: "Full-Time",
    category: "Operations & Finance",
    description: "Manage accounting books, payroll operations, and ensure US tax filing compliance for JWay's international entities.",
  },
];

export default function BlogClientPage({ initialPosts }: { initialPosts: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const POSTS_PER_PAGE = 11;

  // Use live posts if available, otherwise fall back to static list
  const posts = initialPosts && initialPosts.length > 0 ? initialPosts : STATIC_POSTS;

  const filtered = posts.filter((post) => {
    const matchCat = activeCategory === "All" || post.category === activeCategory;
    const matchSearch =
      searchQuery.trim() === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginatedPosts = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />

      <main className="flex-grow">
        {/* ─── Banner ──────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#2e2f31] via-[#3d3e41] to-[#202123] text-white py-20 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,192,40,0.12),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,192,40,0.05),transparent_55%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-jway-green/20 text-jway-green border border-jway-green/30 uppercase tracking-wider mb-6">
                Insights & Careers
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-tight">
                JWay <span className="text-jway-green">Resources &amp; Blogs</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-300 font-sans leading-relaxed max-w-2xl">
                Stay updated with the latest industry insights in technology, UI/UX web design, smart staffing strategy, and our top global remote career opportunities.
              </p>

              {/* Search */}
              <div className="mt-8 relative max-w-lg">
                <svg 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" 
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jway-green/50 focus:border-jway-green/50 text-sm backdrop-blur-sm transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Category Filters ─────────────────────────────────────────── */}
        <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2 shrink-0">Filter:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-jway-green text-white shadow-md shadow-jway-green/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className={`ml-1.5 text-xs font-bold ${activeCategory === cat ? "text-white/70" : "text-gray-400"}`}>
                    ({posts.filter((p) => p.category === cat).length})
                  </span>
                )}
              </button>
            ))}
            <div className="ml-auto shrink-0 text-xs text-gray-400 font-medium">
              {filtered.length} article{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>
        </section>

        {/* ─── Blog Grid ────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter.</p>
              <button
                onClick={() => { setActiveCategory("All"); setSearchQuery(""); setCurrentPage(1); }}
                className="mt-6 px-6 py-2.5 rounded-full bg-jway-green text-white font-bold text-sm hover:bg-jway-green/90 transition-all"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured header */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900">
                    {activeCategory === "All" ? "Featured Insights" : `${activeCategory} Insights`}
                  </h2>
                  <p className="text-gray-600 mt-2 text-base max-w-xl">
                    Deep dives into decision-making strategies, design principles, and recruitment methodologies.
                  </p>
                </div>
                <div className="h-0.5 bg-gray-200 flex-grow mx-8 hidden lg:block" />
                <span className="text-sm font-semibold text-gray-500 shrink-0">
                  Page {currentPage} of {totalPages} ({filtered.length} total)
                </span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {paginatedPosts.map((post, idx) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className={`bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1 ${
                      idx === 0 && paginatedPosts.length >= 3 ? "xl:col-span-2" : ""
                    }`}
                  >
                    {/* Image */}
                    <div className={`relative w-full overflow-hidden bg-gray-100 ${idx === 0 && paginatedPosts.length >= 3 ? "h-72 sm:h-80" : "h-56 sm:h-64"}`}>
                      <img
                        src={getMediaUrl(post.image)}
                        alt={post.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
                          {post.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-jway-green/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                          {post.readTime}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-7 sm:p-8 flex-grow flex flex-col">
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mb-4">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {post.date}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>By {post.author}</span>
                      </div>

                      <h3 className="text-xl font-heading font-bold text-gray-900 group-hover:text-jway-green transition-colors leading-snug mb-4">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 text-[14px] leading-relaxed mb-6 flex-grow line-clamp-4">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {post.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Key takeaways */}
                      <div className="border-t border-gray-100 pt-5 mb-5">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Key Takeaways:</h4>
                        <ul className="space-y-1.5">
                          {post.keyPoints.map((point: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                              <svg className="w-3.5 h-3.5 text-jway-green shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto">
                        <span
                          className="inline-flex items-center gap-2 text-jway-green font-bold text-sm group-hover:underline"
                        >
                          Read Full Article
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* ─── Pagination Control ─────────────────────────────────── */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2.5 mt-16">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 400, behavior: "smooth" });
                        }}
                        className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all duration-200 ${
                          isActive
                            ? "bg-jway-green text-white shadow-md shadow-jway-green/20 border border-jway-green"
                            : "bg-[#eef3d4] text-[#6b7e12] hover:bg-jway-green hover:text-white"
                        }`}
                        aria-label={`Go to page ${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>

        {/* ─── Careers Section ──────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-[#f8f9fa] to-[#f1f3f5] border-t border-gray-200/50 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-jway-green/10 text-gray-800 border border-jway-green/20 uppercase tracking-wider mb-4">
                Now Hiring
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900">
                Job Opportunity Highlights
              </h2>
              <p className="mt-4 text-lg text-gray-600 font-sans">
                Access premium remote positions. Build your career with an established IT solutions leader supporting US &amp; Global enterprises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {JOB_HIGHLIGHTS.map((job, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="bg-gray-100 text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {job.category}
                    </span>
                    <span className="text-jway-green text-[11px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-jway-green animate-pulse" />
                      {job.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-1">{job.title}</h3>

                  {"tech" in job && job.tech && (
                    <span className="text-xs text-gray-500 font-medium block mb-2">
                      Stack: <span className="text-gray-800 font-semibold">{(job as any).tech}</span>
                    </span>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 mt-1">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span>{job.location}</span>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{job.description}</p>

                  <a
                    href="https://jway-group.breezy.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#e2e6d5] hover:border-jway-green text-gray-800 hover:text-jway-green hover:bg-[#f6f7ef] text-sm font-bold transition-all mt-auto group/jbtn"
                  >
                    View Job &amp; Apply
                    <svg className="w-4 h-4 group-hover/jbtn:translate-x-0.5 group-hover/jbtn:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>

            {/* Breezy HR CTA */}
            <div className="bg-[#2e2f31] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-white/5 shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,192,40,0.1),transparent_50%)]" />
              <div className="relative z-10 text-center md:text-left max-w-xl">
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold mb-3">
                  Don&apos;t see your dream role listed?
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  We are always scouting for top talent in engineering, design, operations, and leadership. Explore our full careers list on Breezy HR and submit a general application.
                </p>
              </div>
              <div className="relative z-10 shrink-0">
                <a
                  href="https://jway-group.breezy.hr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-jway-green text-white font-bold hover:bg-jway-green/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Explore All Openings
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
