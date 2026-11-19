"use client";

import Link from "next/link";
import { getMediaUrl } from "@/utils/media";

interface Post {
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

interface LatestPostsProps {
  posts: Post[];
}

export default function LatestPosts({ posts }: LatestPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-[#f6f7ef]/40 relative overflow-hidden border-t border-b border-gray-100/50">
      {/* Decorative Lights */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-jway-green/5 blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-jway-green font-bold uppercase tracking-wider text-xs bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
              What's New
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900">
              Latest at <span className="text-jway-green">JWay</span>
            </h2>
            <p className="text-gray-600 font-sans text-sm sm:text-base max-w-xl">
              Stay ahead of digital, staffing, and technology curves with insights and updates straight from our delivery hubs.
            </p>
          </div>
          
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-all shadow-md hover:shadow-lg shrink-0 w-fit cursor-pointer"
          >
            Explore All Insights
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* 3-Column Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              {/* Cover Image Wrapper */}
              <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-gray-100">
                <img
                  src={getMediaUrl(post.image)}
                  alt={post.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Meta Row: Calendar Icon + Date - Clock Icon + Read Time */}
                  <div className="flex items-center gap-2 text-xs sm:text-[13px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {post.date}
                    </span>
                    <span className="text-gray-300">-</span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-[19px] font-heading font-extrabold text-gray-900 group-hover:text-jway-green transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-500 font-sans text-xs sm:text-[13.5px] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Bottom Footer Row (Strictly 1 line) */}
                <div className="pt-5 mt-5 flex items-center justify-between gap-2 flex-nowrap overflow-hidden">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-jway-green transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    Read Full Article
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-900 group-hover:text-jway-green transition-transform group-hover:translate-x-1 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>

                  {/* Tags / Pills */}
                  <div className="flex gap-1 items-center flex-nowrap overflow-hidden shrink-0">
                    {post.tags?.slice(0, 2).map((tag) => {
                      const displayTag = tag.startsWith("#") ? tag : `#${tag}`;
                      return (
                        <span key={tag} className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#F3F4F6] text-gray-500 whitespace-nowrap shrink-0 max-w-[90px] sm:max-w-[120px] truncate">
                          {displayTag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
