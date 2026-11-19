"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PolicySection {
  id: string;
  title: string;
}

const SECTIONS: PolicySection[] = [
  { id: "introduction", title: "1. Introduction" },
  { id: "info-collect", title: "2. Information We Collect" },
  { id: "data-usage", title: "3. How We Use Data" },
  { id: "no-sale", title: "4. No Sale of Personal Data" },
  { id: "ccpa-rights", title: "5. California CCPA Rights" },
  { id: "dpa-philippines", title: "6. Philippines DPA Notice" },
  { id: "retention-security", title: "7. Retention & Security" },
  { id: "contact-us", title: "8. Contact Us" },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState<string>("introduction");

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
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
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
              <span className="text-[#A8C028] font-bold">Privacy Policy</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight">
              Privacy <span className="text-jway-green">Policy</span>
            </h1>
            <p className="mt-4 text-gray-300 max-w-2xl text-[15px] sm:text-base leading-relaxed">
              At JWay Group Inc., we value your trust. This Privacy Policy explains how we collect, protect, and handle your personal data across our global services and platforms.
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
                On This Page
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
                <span className="text-[12px] uppercase font-bold tracking-widest text-[#A8C028]">Global Support</span>
                <h4 className="font-bold text-sm mt-1 mb-2">Need Immediate Help?</h4>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  For any privacy inquiries or to exercise your data rights, reach out directly.
                </p>
                <a
                  href="mailto:info@jway.com"
                  className="block text-center text-xs font-bold bg-[#A8C028] text-white py-2.5 rounded-lg hover:bg-[#A8C028]/90 transition-colors shadow-sm"
                >
                  info@jway.com
                </a>
              </div>
            </aside>

            {/* Right Column: Detailed Privacy Policy Content */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Introduction Card */}
              <div id="introduction" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold">1</span>
                  Introduction
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    Welcome to JWay Group, Inc. (&quot;JWay&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We are a premier IT consulting, digital solutions, and professional staffing company headquartered in Milpitas, California, with global development centers and business units in the APAC region (including the Philippines).
                  </p>
                  <p>
                    We are dedicated to safeguarding your privacy online. This policy governs how we collect, process, manage, and secure data from visitors of our website, clients, business partners, and job candidates in compliance with federal, state, and international regulations.
                  </p>
                </div>
              </div>

              {/* Information We Collect */}
              <div id="info-collect" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold">2</span>
                  Information We Collect
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    Depending on how you interact with our website or services, we collect several categories of information:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                    <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-gray-800 text-sm mb-1.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-jway-green"></span>
                        Voluntarily Provided Data
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Names, emails, phone numbers, corporate affiliations, and custom messages provided via forms or candidate applications (resumes, work history).
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-gray-800 text-sm mb-1.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-jway-green"></span>
                        Automatically Logged Data
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        IP addresses, web browser settings, system setups, device profiles, referral sources, page interaction duration, and general navigation flows.
                      </p>
                    </div>
                  </div>
                  <p>
                    We utilize tracking mechanisms, including cookies, to deliver customized experiences and evaluate analytics. You can adjust your browser configurations to decline cookies, although doing so might impact site usability.
                  </p>
                </div>
              </div>

              {/* How We Use Data */}
              <div id="data-usage" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold">3</span>
                  How We Use Data
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    JWay uses the information we collect to operate, scale, and optimize our digital offerings:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-[14px] pl-2 text-gray-600">
                    <li>Deliver and maintain our digital consulting, web/mobile development, and staffing solutions.</li>
                    <li>Respond to client requests, schedule initial consultation calls, and execute contracts.</li>
                    <li>Evaluate and recruit candidates for our global talent pool and internal job openings.</li>
                    <li>Maintain secure systems and thwart cybersecurity incidents or fraudulent actions.</li>
                    <li>Ensure compliance with statutory duties, recruitment policies, and industrial regulations.</li>
                  </ul>
                </div>
              </div>

              {/* No Sale of Personal Data */}
              <div id="no-sale" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold">4</span>
                  No Sale of Personal Data
                </h2>
                <div className="h-1 w-16 bg-red-400 rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <div className="bg-[#f6f7ef] border-l-4 border-[#A8C028] p-4 rounded-r-xl">
                    <span className="font-bold text-gray-800 text-[14px] block mb-1">Our Absolute Commitment:</span>
                    <p className="text-sm text-gray-700 font-medium">
                      JWay Group, Inc. has never sold, does not sell, and will never sell personal information to any third parties for marketing, advertising, or database resale purposes. 
                    </p>
                  </div>
                  <p>
                    Your data is solely used to establish business relations, render professional services, and manage recruitment applications. We only share information with trusted operational partners under strict contractual data-protection provisions.
                  </p>
                </div>
              </div>

              {/* CCPA Rights */}
              <div id="ccpa-rights" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold">5</span>
                  California Privacy Rights (CCPA/CPRA)
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    Under the California Consumer Privacy Act (CCPA), as amended by the CPRA, California residents possess explicit privileges concerning their personal information:
                  </p>
                  
                  <div className="space-y-4 mt-6">
                    <div className="border border-gray-100 p-4 rounded-xl hover:bg-slate-50/50 transition-colors">
                      <h4 className="font-bold text-gray-800 text-sm">Right to Know &amp; Access</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        You can request that JWay disclose the categories and specific pieces of personal data we have collected about you over the past 12 months.
                      </p>
                    </div>
                    
                    <div className="border border-gray-100 p-4 rounded-xl hover:bg-slate-50/50 transition-colors">
                      <h4 className="font-bold text-gray-800 text-sm">Right to Request Deletion</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        You have the right to request that we delete personal data we collected, subject to key legal exclusions (such as completing an active contract).
                      </p>
                    </div>

                    <div className="border border-gray-100 p-4 rounded-xl hover:bg-slate-50/50 transition-colors">
                      <h4 className="font-bold text-gray-800 text-sm">Right to Correct Inaccurate Data</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        You have the right to request that we rectify inaccurate or incomplete records in our database.
                      </p>
                    </div>

                    <div className="border border-gray-100 p-4 rounded-xl hover:bg-slate-50/50 transition-colors">
                      <h4 className="font-bold text-gray-800 text-sm">Right to Non-Discrimination</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        JWay will never discriminate against you (e.g., through pricing, service levels, or hiring bias) for exercising your CCPA rights.
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 italic mt-4">
                    To exercise any of these privileges, please contact our privacy compliance team at <a href="mailto:info@jway.com" className="text-jway-green hover:underline">info@jway.com</a> or phone +1 408 247 5929.
                  </p>
                </div>
              </div>

              {/* Philippines DPA Compliance */}
              <div id="dpa-philippines" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold">6</span>
                  Philippines Data Privacy Act (DPA) Notice
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    For our candidates, personnel, and customers situated in the Philippines (and the wider APAC market), JWay Group, Inc. strictly adheres to the **Data Privacy Act of 2012 (Republic Act No. 10173)**, its Implementing Rules and Regulations, and administrative directives of the National Privacy Commission (NPC).
                  </p>

                  <div className="bg-[#F6F7EF] p-5 rounded-xl border border-[#e2e6d5] space-y-3">
                    <span className="font-bold text-[14px] text-gray-800 block">Recruitment Processing &amp; Operations Notice:</span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      By submitting your resume or application to JWay Group Inc. (or via job interfaces like Breezy HR), you express permission for JWay to collect, evaluate, verify, and store your educational degrees, employment timelines, references, and professional certifications. This processing is performed solely to assess your suitability for client positions and direct employment in our local and offshore staffing entities.
                    </p>
                  </div>

                  <p className="font-semibold text-gray-800 text-sm mt-4">Your Rights Under RA 10173:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-gray-100">
                      <span className="font-bold text-gray-800">Right to be Informed</span>
                      <p className="text-gray-500 mt-1 leading-relaxed">Know whether your personal data is being processed, and understand the scope/purpose of processing.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-gray-100">
                      <span className="font-bold text-gray-800">Right to Access &amp; Object</span>
                      <p className="text-gray-500 mt-1 leading-relaxed">Obtain a summary of data under our control, and object to processing in case of operational changes.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-gray-100">
                      <span className="font-bold text-gray-800">Right to Rectification</span>
                      <p className="text-gray-500 mt-1 leading-relaxed">Request the immediate correction of any outdated or faulty information in our registry.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-gray-100">
                      <span className="font-bold text-gray-800">Right to Erasure &amp; Blocking</span>
                      <p className="text-gray-500 mt-1 leading-relaxed">Order the deletion or suspension of data that is no longer necessary for recruitment purposes.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Retention & Security */}
              <div id="retention-security" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold">7</span>
                  Data Retention &amp; Security
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    We employ robust administrative, mechanical, and physical security measures to shield your records against unauthorized access, theft, loss, modification, or exposure.
                  </p>
                  <p>
                    We retain your personal data only for as long as is necessary to satisfy the commercial objectives outlined in this policy, evaluate candidate resumes, or comply with statutory retention timelines. When data is no longer required, we securely purge or anonymize it.
                  </p>
                </div>
              </div>

              {/* Contact Us */}
              <div id="contact-us" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/80 scroll-mt-28">
                <h2 className="text-2xl font-heading font-bold text-[#2e2f31] flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A8C028]/10 text-jway-green text-sm font-bold">8</span>
                  Contact Us
                </h2>
                <div className="h-1 w-16 bg-[#A8C028] rounded-full my-4"></div>
                <div className="text-gray-600 text-[15px] sm:text-base leading-relaxed space-y-4">
                  <p>
                    If you have questions about this policy, want to request access to your files, delete your info, or raise a concern, contact our DPO/compliance officers here:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* US Office */}
                    <div className="p-5 rounded-xl border border-gray-100 bg-slate-50/50">
                      <span className="text-xs uppercase font-bold tracking-widest text-[#A8C028]">United States Headquarters</span>
                      <h4 className="font-bold text-gray-800 text-sm mt-1 mb-3">JWay Group, Inc. (Milpitas)</h4>
                      <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                        691 South Milpitas Blvd., Suite #213<br />
                        Milpitas, CA 95035, USA
                      </p>
                      <div className="text-xs text-gray-600 flex flex-col gap-1">
                        <span><strong>Phone:</strong> +1 408 247 5929</span>
                        <span><strong>Email:</strong> info@jway.com</span>
                      </div>
                    </div>
                    
                    {/* APAC Office */}
                    <div className="p-5 rounded-xl border border-gray-100 bg-slate-50/50">
                      <span className="text-xs uppercase font-bold tracking-widest text-[#A8C028]">APAC Headquarters</span>
                      <h4 className="font-bold text-gray-800 text-sm mt-1 mb-3">JWay Group, Inc. (Philippines)</h4>
                      <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                        30F One Corporate Center, Ortigas Center<br />
                        Pasig City 1605, Philippines
                      </p>
                      <div className="text-xs text-gray-600 flex flex-col gap-1">
                        <span><strong>Phone:</strong> +632 8284 8789</span>
                        <span><strong>Baguio City:</strong> +63 74 620 9871</span>
                      </div>
                    </div>
                  </div>
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
