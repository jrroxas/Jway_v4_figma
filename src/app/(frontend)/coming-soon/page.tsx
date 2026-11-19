import Image from "next/image";
import Link from "next/link";
import { getMediaUrl } from "@/utils/media";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon | JWay Group",
  description: "We are currently working on a new super awesome website.",
};

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F6F7EF]">
      <Header />

      <main className="flex-grow relative overflow-hidden flex items-center py-16 sm:py-24 lg:py-32">
        {/* Soft Decorative Ambient Background Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,192,40,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-jway-green/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-jway-green font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight block">
                Coming Soon!
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#2e2f31] leading-snug sm:leading-tight">
                We are currently working on a new super awesome website.
              </h1>

              <div className="h-1.5 w-24 bg-jway-green rounded-full mt-4" />

              <p className="text-base sm:text-lg text-gray-600 font-sans max-w-lg leading-relaxed pt-2">
                Our team is busy crafting an incredible new experience for you. Stay tuned for exciting updates, innovative AI solutions, and enterprise digital services!
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-jway-green text-white font-bold text-sm shadow-md shadow-jway-green/20 hover:bg-jway-green/90 transition-all hover:scale-[1.02]"
                >
                  Return to Homepage
                </Link>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white text-[#2e2f31] border border-gray-200 font-bold text-sm shadow-sm hover:border-jway-green hover:text-jway-green transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right Image Container */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-white">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={getMediaUrl("/coming-soon-hero.jpg")}
                    alt="Coming Soon - Workstation AI Robot"
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
