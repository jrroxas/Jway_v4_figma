"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface TermsSection {
  id: string;
  title: string;
}

const SECTIONS: TermsSection[] = [
  { id: "acceptance", title: "1. Acceptance" },
  { id: "purpose", title: "2. Purpose of the website" },
  { id: "third-party", title: "3. Links to Third-Party Websites" },
  { id: "intellectual-prop", title: "4. Intellectual Property" },
  { id: "warranty-liability", title: "5. Warranty and Liability" },
  { id: "privacy-cookies", title: "6. Online Privacy Policy — Use of Cookies" },
  { id: "comments", title: "7. Users’ Comments" },
  { id: "governing-law", title: "8. Applicable law — Severability" },
  { id: "modifications", title: "9. Modifications of the Terms of Use" },
];

export default function TermsOfUse() {
  const [activeSection, setActiveSection] = useState<string>("acceptance");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120; // Accounts for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      <Header />

      <main className="flex-grow">
        {/* Premium Hero Banner */}
        <section className="relative bg-[#2e2f31] py-20 text-white overflow-hidden">
          {/* Subtle Decorative Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#A8C028]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#A8C028]/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 mb-4">
              <Link href="/" className="hover:text-jway-green transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#A8C028] font-bold">Terms of Use</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight">
              Terms of <span className="text-jway-green">Use</span>
            </h1>
            <p className="mt-4 text-gray-300 max-w-2xl text-[15px] sm:text-base leading-relaxed">
              These terms outline the rules and conditions for accessing the website of JWay Group, Inc. Please read them carefully before browsing.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-gray-300">
              <span className="w-2 h-2 rounded-full bg-jway-green animate-pulse"></span>
              Last Updated: May 28, 2026
            </div>
          </div>
        </section>

        {/* Content Section with Sticky Navigation */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Sticky Navigation Sidebar */}
            <aside className="lg:col-span-4 sticky top-28 hidden lg:block bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4 px-3">
                Terms Sections
              </h2>
              <nav className="flex flex-col gap-1">
                {SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={(e) => scrollToSection(e, sec.id)}
                      className={`px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-200 border-l-2 ${
                        isActive
                          ? "bg-[#F6F7EF] text-jway-green border-jway-green"
                          : "text-gray-600 hover:text-jway-green border-transparent hover:bg-gray-50"
                      }`}
                    >
                      {sec.title}
                    </a>
                  );
                })}
              </nav>
              
              {/* Sidebar Quick Contact Card */}
              <div className="mt-8 bg-gradient-to-br from-[#2e2f31] to-[#242526] text-white p-5 rounded-xl border border-white/5 shadow-md">
                <span className="text-[12px] uppercase font-bold tracking-widest text-[#A8C028]">Contact Us</span>
                <h4 className="font-bold text-sm mt-1 mb-2">Legal Questions?</h4>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  For inquiries about our terms, copyrights, or services, email our legal team.
                </p>
                <a
                  href="mailto:info@jway.com"
                  className="block text-center text-xs font-bold bg-[#A8C028] text-white py-2.5 rounded-lg hover:bg-[#A8C028]/90 transition-colors shadow-sm"
                >
                  info@jway.com
                </a>
              </div>
            </aside>

            {/* Right Column: Detailed Terms of Use Content */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* 1. Acceptance */}
              <div id="acceptance" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold shrink-0">1</span>
                  Acceptance
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    By accessing and browsing the JWay (the “Company”) website or by using and/or downloading any content from same, you agree and accept the Terms of Use as set forth below.
                  </p>
                </div>
              </div>

              {/* 2. Purpose of the website */}
              <div id="purpose" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold shrink-0">2</span>
                  Purpose of the website
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    All the materials contained in the Company’s website are provided for informational purposes only and shall not be construed as a commercial offer, a license, an advisory, fiduciary or professional relationship between you and the Company.
                  </p>
                  <p>
                    No information provided on this site shall be considered a substitute for your independent investigation. The information provided on this website may be related to products or services that are not available in your country.
                  </p>
                </div>
              </div>

              {/* 3. Links to Third-Party Websites */}
              <div id="third-party" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold shrink-0">3</span>
                  Links to Third-Party Websites
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    Links to third-party websites are provided for convenience only and do not imply any approval or endorsement by the Company of the linked sites, even if they may contain the Company’s logo, as such sites are beyond the Company’s control.
                  </p>
                  <p>
                    Thus, the Company cannot be held responsible for the content of any linked site or any link contained therein. You acknowledge that framing the Company’s website or any similar process is prohibited.
                  </p>
                </div>
              </div>

              {/* 4. Intellectual Property */}
              <div id="intellectual-prop" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold shrink-0">4</span>
                  Intellectual Property
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    This website is protected by intellectual property rights and is the exclusive property of the Company. Any material that it contains, including, but not limited to, texts, data, graphics, pictures, sounds, videos, logos, icons or html code is protected under intellectual property law and remains the Company or third party’s property.
                  </p>
                  <p>
                    You may use this material for personal and non-commercial purposes in accordance with the principles governing intellectual property law. Any other use or modification of the content of the Company’s website without the Company’s prior written authorization is prohibited.
                  </p>
                </div>
              </div>

              {/* 5. Warranty and Liability */}
              <div id="warranty-liability" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold shrink-0">5</span>
                  Warranty and Liability
                </h2>
                <div className="h-1 w-16 bg-red-400 rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    All materials, including downloadable software, contained in the Company’s website is provided «as is» and without warranty of any kind to the extent allowed by the applicable law; While the Company will use reasonable efforts to provide reliable information through its website, the Company does not warrant that this website is free of inaccuracies, errors and/or omissions, viruses, worms, Trojan horses and the like, or that its content is appropriate for your particular use or up to date, and the Company reserves the right to change the information at any time without notice.
                  </p>
                  <p>
                    The Company does not warrant any results derived from the use of any software available on this site. You are solely responsible for any use of the materials contained in this site. The information contained in this site does not extend or modify the warranty that may apply to you as a result of a contractual relationship with the Company.
                  </p>
                  <p>
                    The Company will not be liable for any indirect, consequential or incidental damages, including but not limited to lost profits or revenues, business interruption, loss of data arising out of or in connection with the use, inability to use or reliance on any material contained in this site or any linked site.
                  </p>
                  <div className="bg-[#f6f7ef] border-l-4 border-[#A8C028] p-4 rounded-r-xl text-gray-700 font-medium mt-4">
                    In any event, the liability of the Company for direct damages arising out of or in connection with the use, inability to use or reliance on any material contained in this site or any linked site shall not exceed the amount of Euros 1,000.
                  </div>
                </div>
              </div>

              {/* 6. Online Privacy Policy — Use of Cookies */}
              <div id="privacy-cookies" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold shrink-0">6</span>
                  Online Privacy Policy — Use of Cookies
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    Please check our <Link href="/privacy-policy" className="text-jway-green font-semibold hover:underline">Online Privacy Policy</Link>.
                  </p>
                </div>
              </div>

              {/* 7. Users’ Comments */}
              <div id="comments" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold shrink-0">7</span>
                  Users’ Comments
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    The Company does not assume any obligation to monitor the information that you may post on its website.
                  </p>
                  <p>
                    You warrant that any information, Materials (the term “Material” is intended to cover all projects, files or other attachments sent to us) or comments other than personal data, that you may transmit to the Company through the website does not infringe intellectual property rights or any other applicable law.
                  </p>
                  <p>
                    Such information, Materials or comments, will be treated as non-confidential and non-proprietary. By submitting any information or material, you give the Company an unlimited and irrevocable license to use, execute, show, modify and transmit such information, Material or comments, including any underlying idea, concept or know-how (the term “Material” is intended to cover all projects, files or other attachments sent to us). The Company reserves the right to use such information in any way it chooses.
                  </p>
                </div>
              </div>

              {/* 8. Applicable law — Severability */}
              <div id="governing-law" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold shrink-0">8</span>
                  Applicable law — Severability
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    Any controversy or claim arising out of or related to the Terms of Use shall be governed by the law of State of California, USA.
                  </p>
                  <p>
                    If any provision of these Terms of Use is held by a court to be illegal, invalid or unenforceable, the remaining provisions shall remain in full force and effect.
                  </p>
                </div>
              </div>

              {/* 9. Modifications of the Terms of Use */}
              <div id="modifications" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold shrink-0">9</span>
                  Modifications of the Terms of Use
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    The Company reserves the right to change the Terms of Use under which this website is offered at any time and without notice. You will be automatically bound by these modifications when you use this site, and should periodically read the Terms of Use.
                  </p>
                  <p>
                    If you have any thoughts or questions about this Terms of Use, please let us know.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
