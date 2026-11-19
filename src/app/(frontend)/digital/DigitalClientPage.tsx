"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LatestPosts from "@/components/LatestPosts";
import { MappedPost } from "@/lib/getContextualPosts";

interface DigitalService {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  badge: string;
  features: string[];
  icon: React.ReactNode;
}

interface DigitalClientPageProps {
  posts: MappedPost[];
}

export default function DigitalClientPage({ posts }: DigitalClientPageProps) {
  const [activeTab, setActiveTab] = useState<string>("web-dev");

  const SERVICES_DATA: DigitalService[] = [
    {
      id: "web-dev",
      title: "Web Design and Development",
      badge: "Custom & Scalable",
      shortDescription: "Establish a robust, high-performance web presence with tailored, fully customized web designs and robust front/backend engineering.",
      longDescription: "Our expert engineering teams build secure, scalable, and responsive web platforms that seamlessly align with your business goals. We avoid template limitations, crafting tailored user experiences and clean UI architectures that convert visitors into loyal advocates.",
      features: [
        "Custom UI/UX Design & Theming",
        "Modern Frameworks (Next.js, React, Vue)",
        "Mobile-Responsive Architectures",
        "Clean, Maintainable Codebases",
        "Performance Optimization & SEO Prep",
        "API & Headless CMS Integrations"
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      id: "consulting",
      title: "Digital Consulting",
      badge: "Strategic Growth",
      shortDescription: "Navigate complex technological decisions with deep audits and action-oriented digital strategy roadmaps.",
      longDescription: "Our strategic advisors analyze your existing systems and workflows to build clear, future-proof transformation blueprints. Through exhaustive technology audits and custom-tailored digital strategies, we help you eliminate technical debt and select stack configurations that maximize long-term ROI.",
      features: [
        "In-depth Technology Audits",
        "Custom Digital Strategies & Roadmaps",
        "Technical Stack Selection Advisory",
        "Legacy Code & Architecture Reviews",
        "Workflow Automation Strategy",
        "Scalability & Cost Optimization"
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      id: "ui-ux",
      title: "UI/UX Design",
      badge: "Human-Centric",
      shortDescription: "Coupling user-centric psychology with modern styling to deliver seamless and highly engaging client experiences.",
      longDescription: "We craft thoughtful digital product layouts using a research-driven process. From thorough user journey definitions to interactive, high-fidelity prototypes, our goal is to eliminate friction and spark delight at every stage of the user interaction lifecycle.",
      features: [
        "Comprehensive Customer Journey Maps",
        "Wireframing & Interactive Prototyping",
        "User Persona Research & Testing",
        "High-Fidelity UI Styling & Assets",
        "Design System Development",
        "Accessibility (a11y) Compliant Designs"
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    {
      id: "support",
      title: "Support and Maintenance",
      badge: "24/7 Security & Performance",
      shortDescription: "Keep your applications fast, robust, secure, and fully updated around the clock.",
      longDescription: "Your digital assets are dynamic ecosystem resources that need persistent supervision. We provide dedicated support programs, performing routine performance optimizations, applying immediate security patches, and introducing functional upgrades so your business remains competitive and operational without interruption.",
      features: [
        "Proactive Monitoring & System Audits",
        "Immediate Security Patch Application",
        "Regular Cloud Backups & Recovery Tests",
        "Feature Upgrades & UX Enhancements",
        "Bug Fixes & Speed Performance Tuning",
        "Dedicated SLA Response Models"
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: "marketing",
      title: "Digital Marketing",
      badge: "Targeted Campaigns",
      shortDescription: "Scale your organic reach, acquire qualified leads, and maximize search platform visibility.",
      longDescription: "Ensure your target audience finds you easily. We engineer high-converting digital marketing campaigns by combining elite Technical SEO practices, paid search (PPC) placement strategies, and highly integrated social campaign management to continuously generate high-quality conversions.",
      features: [
        "In-depth Technical SEO & Audits",
        "Paid Search & PPC Campaign Management",
        "Social Campaigns & Brand Building",
        "Detailed Analytics & Performance Tracking",
        "A/B Testing & Conversion Rate Optimization",
        "Content Marketing & Copywriting"
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    }
  ];

  const STEPS_DATA = [
    {
      step: "01",
      name: "Discovery & Analysis",
      description: "We analyze your digital presence, evaluate tech infrastructure, and isolate friction points to build a clear objective blueprint."
    },
    {
      step: "02",
      name: "Strategy & Prototyping",
      description: "We outline high-level technical strategies, architect wireframes, and design interactive user journeys for comprehensive visual reviews."
    },
    {
      step: "03",
      name: "Agile Development",
      description: "Our engineering experts compose modular, high-performance clean code using cutting-edge tools to secure excellent responsiveness."
    },
    {
      step: "04",
      name: "Quality Assurance & Launch",
      description: "Rigorous testing runs across multiple screen resolutions and browser platforms to ensure a robust, flawless launch deployment."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFB]">
      <Header />

      <main className="flex-grow">
        {/* Premium Hero Section */}
        <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1C1E20] via-[#242729] to-[#1C1E20] text-white overflow-hidden">
          {/* Subtle Accent Glows */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-[#A8C028]/10 blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#A8C028]/5 blur-[80px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="text-[#A8C028] bg-[#A8C028]/10 px-4 py-1.5 rounded-full font-heading font-semibold text-sm tracking-wider uppercase inline-flex items-center gap-1.5 border border-[#A8C028]/25">
                  <span className="w-2 h-2 rounded-full bg-[#A8C028] animate-pulse"></span>
                  Elite Digital Services
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
                  High-Impact <span className="text-[#A8C028]">Digital Experiences</span> Tailored for Growth
                </h1>
                <p className="text-gray-300 text-lg sm:text-xl font-sans max-w-2xl leading-relaxed">
                  We couple modern user-centric aesthetics, robust code frameworks, and strategic technology consulting to establish high-performing digital architectures for global brands.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/contact-us"
                    className="px-8 py-3.5 rounded-full bg-[#A8C028] text-white font-semibold hover:bg-[#A8C028]/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Start Your Project
                  </Link>
                  <a
                    href="#services-interactive"
                    className="px-8 py-3.5 rounded-full border border-gray-500 hover:border-white text-white font-medium bg-white/5 hover:bg-white/10 transition-all"
                  >
                    Explore Offerings
                  </a>
                </div>
              </div>

              {/* Glassmorphism Stats & Features Panel */}
              <div className="lg:col-span-5 relative">
                <div className="relative bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl space-y-6">
                  <h3 className="text-xl font-heading font-bold text-white border-b border-white/10 pb-4">
                    Why Partners Choose JWay
                  </h3>
                  <ul className="space-y-4 font-sans text-sm text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#A8C028]/20 flex items-center justify-center text-[#A8C028] shrink-0 mt-0.5 font-bold">✓</span>
                      <div>
                        <strong className="text-white block">Silicon Valley Pedigree</strong>
                        Pioneering digital excellence and strict engineering standards since 1994.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#A8C028]/20 flex items-center justify-center text-[#A8C028] shrink-0 mt-0.5 font-bold">✓</span>
                      <div>
                        <strong className="text-white block">Tailored &amp; Flexible Teams</strong>
                        Custom-fit configurations matching remote development speed and budgets.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#A8C028]/20 flex items-center justify-center text-[#A8C028] shrink-0 mt-0.5 font-bold">✓</span>
                      <div>
                        <strong className="text-white block">All-in-One Capabilities</strong>
                        From visual mockups to robust backend scaling and target marketing.
                      </div>
                    </li>
                  </ul>

                  <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-white/10">
                    <div>
                      <div className="text-2xl font-bold text-[#A8C028]">28+</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest">Years Experience</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#A8C028]">500+</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest">Projects Done</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#A8C028]">99%</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Services Section */}
        <section id="services-interactive" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#A8C028] font-heading font-bold text-sm uppercase tracking-widest bg-[#A8C028]/10 px-3.5 py-1.5 rounded-full">
                What We Deliver
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900">
                Core Digital Competencies
              </h2>
              <p className="mt-4 text-lg text-gray-600 font-sans leading-relaxed">
                Empower your business with modular, customized solutions designed by senior system architects, frontend developers, and digital growth marketers.
              </p>
            </div>

            {/* Interactive Tab Selector - Desktop & Tablet */}
            <div className="hidden md:flex justify-center flex-wrap gap-2 mb-12">
              {SERVICES_DATA.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => setActiveTab(srv.id)}
                  className={`px-6 py-3 rounded-full font-heading font-semibold text-sm transition-all duration-300 flex items-center gap-2.5 border cursor-pointer ${
                    activeTab === srv.id
                      ? "bg-[#A8C028] text-white border-[#A8C028] shadow-md shadow-[#A8C028]/25"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className={activeTab === srv.id ? "text-white" : "text-[#A8C028]"}>
                    {srv.icon}
                  </span>
                  {srv.title}
                </button>
              ))}
            </div>

            {/* Active Tab Panel - Desktop & Tablet */}
            <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 transition-all duration-300">
              {SERVICES_DATA.filter((s) => s.id === activeTab).map((service) => (
                <div key={service.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 bg-[#A8C028]/10 text-[#A8C028] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {service.badge}
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed font-sans">
                      {service.longDescription}
                    </p>

                    <div className="h-0.5 bg-gray-100 w-full my-6"></div>

                    <h4 className="text-sm font-heading font-bold text-gray-900 uppercase tracking-widest mb-3">
                      Key Deliverables
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-gray-700 font-sans text-sm">
                          <span className="w-5 h-5 rounded-full bg-[#A8C028]/10 text-[#A8C028] flex items-center justify-center text-xs shrink-0 font-bold">
                            ✓
                          </span>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="pt-6">
                      <Link
                        href="/contact-us"
                        className="inline-flex items-center gap-2 text-[#A8C028] font-bold text-base hover:underline group"
                      >
                        Request Strategy Call
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex justify-center">
                    {service.id === "web-dev" && (
                      <div className="relative w-full max-w-sm h-64 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-4 overflow-hidden flex flex-col gap-3 group/browser">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          </div>
                          <div className="bg-slate-800 rounded-md px-3 py-0.5 text-[9px] text-gray-400 font-mono w-40 text-center truncate">
                            jway.com/solutions
                          </div>
                          <div className="w-6"></div>
                        </div>
                        <div className="flex-1 grid grid-cols-12 gap-3 relative">
                          <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-2 opacity-5 pointer-events-none">
                            {Array.from({ length: 24 }).map((_, i) => (
                              <div key={i} className="border border-white rounded"></div>
                            ))}
                          </div>
                          <div className="col-span-8 space-y-2.5 z-10">
                            <div className="h-4 bg-[#A8C028]/20 rounded-md w-3/4 animate-pulse"></div>
                            <div className="space-y-1.5">
                              <div className="h-2 bg-slate-800 rounded w-full"></div>
                              <div className="h-2 bg-slate-800 rounded w-5/6"></div>
                              <div className="h-2 bg-slate-800 rounded w-4/6"></div>
                            </div>
                            <div className="flex gap-2">
                              <div className="h-6 w-16 bg-[#A8C028] rounded-md"></div>
                              <div className="h-6 w-12 bg-slate-800 rounded-md"></div>
                            </div>
                          </div>
                          <div className="col-span-4 flex items-center justify-center relative">
                            <div className="absolute w-20 h-20 bg-slate-800/80 rounded-xl border border-slate-700/50 transform translate-x-2 -translate-y-2 rotate-6 transition-all duration-500 group-hover/browser:translate-x-4 group-hover/browser:-translate-y-4"></div>
                            <div className="absolute w-20 h-20 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between p-2.5 transform -rotate-3 transition-all duration-500 group-hover/browser:-rotate-6">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-[#A8C028]">Next.js</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              </div>
                              <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-1 bg-gray-200 rounded w-1/2"></div>
                              <div className="flex justify-end pt-1">
                                <svg className="w-3 h-3 text-[#A8C028]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {service.id === "consulting" && (
                      <div className="relative w-full max-w-sm h-64 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-5 overflow-hidden flex flex-col justify-between group/consult">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#A8C028] animate-ping"></span>
                            <span className="text-xs font-mono font-bold text-gray-300">STRATEGY MATRIX</span>
                          </div>
                          <span className="text-[9px] text-gray-500 font-mono">AUDIT_ACTIVE</span>
                        </div>
                        <div className="flex-grow flex items-center justify-between gap-4 py-4 relative">
                          <div className="space-y-3 z-10">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded bg-[#A8C028]"></div>
                              <div className="h-2 bg-slate-800 rounded w-28"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded bg-emerald-500"></div>
                              <div className="h-2 bg-slate-800 rounded w-20"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded bg-indigo-500"></div>
                              <div className="h-2 bg-slate-800 rounded w-24"></div>
                            </div>
                          </div>
                          <div className="relative w-36 h-28 flex items-center justify-center">
                            <div className="absolute w-24 h-16 bg-slate-800/80 rounded-xl border border-slate-700/50 transform skew-y-12 -translate-y-4 transition-all duration-500 group-hover/consult:-translate-y-6"></div>
                            <div className="absolute w-24 h-16 bg-slate-800/50 rounded-xl border border-slate-700/30 transform skew-y-12 transition-all duration-500"></div>
                            <div className="absolute w-24 h-16 bg-white rounded-xl shadow-lg border border-gray-100 p-3 transform skew-y-12 translate-y-4 flex flex-col justify-between transition-all duration-500 group-hover/consult:translate-y-6">
                              <span className="text-[10px] font-bold text-gray-700">ROI Forecast</span>
                              <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                              <div className="flex justify-between items-end">
                                <span className="text-[12px] font-extrabold text-[#A8C028]">+142%</span>
                                <svg className="w-3 h-3 text-[#A8C028]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {service.id === "ui-ux" && (
                      <div className="relative w-full max-w-sm h-64 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-5 overflow-hidden flex flex-col gap-4 group/ui">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-mono font-bold text-gray-300">CANVAS VIEW</span>
                          <div className="flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                          </div>
                        </div>
                        <div className="flex-1 relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:16px_16px] opacity-10"></div>
                          <div className="absolute w-28 h-28 border-2 border-dashed border-slate-700 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover/ui:border-[#A8C028]/40"></div>
                          <div className="absolute w-32 h-20 bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex flex-col justify-between transform -rotate-6 transition-all duration-500 group-hover/ui:rotate-0">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-gray-800">UX System</span>
                              <div className="flex gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#A8C028]"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="h-1 bg-gray-200 rounded w-full"></div>
                              <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] font-mono text-gray-400">Scale: 1.0</span>
                              <div className="w-1.5 h-1.5 bg-[#A8C028] border border-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {service.id === "support" && (
                      <div className="relative w-full max-w-sm h-64 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-5 overflow-hidden flex flex-col justify-between group/support">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            <span className="text-xs font-mono font-bold text-gray-300">SERVER MONITOR</span>
                          </div>
                          <span className="text-[9px] text-emerald-500 font-mono">99.99% UPTIME</span>
                        </div>
                        <div className="flex-grow flex items-center justify-center relative py-4">
                          <div className="relative w-40 h-28 flex flex-col gap-1 items-center justify-center">
                            <div className="w-28 h-6 bg-slate-800/80 rounded-lg border border-slate-700/60 shadow-lg transform -skew-x-12 flex items-center justify-between px-3 transition-all duration-500 group-hover/support:-translate-y-2">
                              <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                              </div>
                              <div className="h-1 bg-slate-700 rounded w-12"></div>
                            </div>
                            <div className="w-28 h-6 bg-slate-800/80 rounded-lg border border-slate-700/60 shadow-lg transform -skew-x-12 flex items-center justify-between px-3">
                              <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              </div>
                              <div className="h-1 bg-slate-700 rounded w-8"></div>
                            </div>
                            <div className="w-28 h-6 bg-slate-800/80 rounded-lg border border-slate-700/60 shadow-lg transform -skew-x-12 flex items-center justify-between px-3 transition-all duration-500 group-hover/support:translate-y-2">
                              <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                              </div>
                              <div className="h-1 bg-slate-700 rounded w-16"></div>
                            </div>
                          </div>
                          <div className="absolute right-4 top-4 bg-white text-[#A8C028] rounded-xl p-2.5 shadow-lg border border-gray-100 transform rotate-12 transition-all duration-500 group-hover/support:rotate-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {service.id === "marketing" && (
                      <div className="relative w-full max-w-sm h-64 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-5 overflow-hidden flex flex-col justify-between group/marketing">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <span className="text-xs font-mono font-bold text-gray-300">SEO OPTIMIZER</span>
                          <span className="text-[9px] text-[#A8C028] font-mono">CONVERSIONS_UP</span>
                        </div>
                        <div className="flex-grow flex items-center justify-between gap-4 py-4 relative">
                          <div className="space-y-3 z-10">
                            <div className="h-6 w-20 bg-slate-800 rounded-full flex items-center justify-center text-[10px] text-gray-300 border border-slate-700/60 transition-transform duration-500 group-hover/marketing:scale-105">
                              #Organic
                            </div>
                            <div className="h-6 w-16 bg-slate-800 rounded-full flex items-center justify-center text-[10px] text-gray-300 border border-slate-700/60 transition-transform duration-500 group-hover/marketing:scale-105">
                              #Audits
                            </div>
                          </div>
                          <div className="relative w-36 h-28 flex items-center justify-center">
                            <div className="absolute w-16 h-16 bg-[#A8C028]/20 rounded-full blur-xl animate-pulse"></div>
                            <div className="absolute w-28 h-14 bg-white rounded-xl shadow-lg border border-gray-100 p-2.5 flex items-center gap-2 transform skew-y-6 transition-all duration-500 group-hover/marketing:skew-y-0">
                              <div className="p-1.5 bg-[#A8C028]/10 text-[#A8C028] rounded-lg">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602z" />
                                </svg>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-gray-800">Keywords</span>
                                <div className="h-1 bg-gray-200 rounded w-16"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Vertical Accordion Card List */}
            <div className="md:hidden space-y-6">
              {SERVICES_DATA.map((service) => (
                <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#A8C028]/10 text-[#A8C028] rounded-xl">
                      {service.icon}
                    </div>
                    <div>
                      <span className="text-[10px] bg-[#A8C028]/15 text-[#A8C028] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        {service.badge}
                      </span>
                      <h3 className="text-xl font-heading font-bold text-gray-900 mt-0.5">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 font-sans text-sm leading-relaxed">
                    {service.shortDescription}
                  </p>
                  <div className="h-px bg-gray-100 my-4"></div>
                  <ul className="space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700 font-sans text-[13px]">
                        <span className="w-4 h-4 rounded-full bg-[#A8C028]/10 text-[#A8C028] flex items-center justify-center text-[10px] shrink-0 font-bold">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 text-center">
                    <Link
                      href="/contact-us"
                      className="block w-full py-2.5 text-center text-white bg-[#A8C028] hover:bg-[#A8C028]/95 font-semibold rounded-xl text-sm transition-all"
                    >
                      Inquire About This Service
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Methodology & Workflow Section */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#A8C028] font-heading font-bold text-sm uppercase tracking-widest bg-[#A8C028]/10 px-3.5 py-1.5 rounded-full">
                Our Delivery Process
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-heading font-bold text-gray-900">
                Resilient Systems Built with Precision
              </h2>
              <p className="mt-4 text-gray-600 font-sans leading-relaxed text-base">
                We combine technical agility with structured execution stages to turn conceptual plans into functional, highly-scalable software frameworks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {STEPS_DATA.map((stepItem, idx) => (
                <div key={idx} className="bg-[#FAFAFB] border border-gray-100 rounded-2xl p-8 relative hover:shadow-lg transition-shadow group">
                  <div className="text-4xl font-heading font-black text-gray-200 group-hover:text-[#A8C028]/35 transition-colors">
                    {stepItem.step}
                  </div>
                  <h3 className="text-lg font-heading font-bold text-gray-900 mt-4 mb-2">
                    {stepItem.name}
                  </h3>
                  <p className="text-gray-600 font-sans text-sm leading-relaxed">
                    {stepItem.description}
                  </p>
                  <div className="absolute bottom-0 left-8 right-8 h-1 bg-transparent group-hover:bg-[#A8C028] transition-colors rounded-t-full"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contextual Dynamic Blog Insights */}
        <LatestPosts posts={posts} />

        {/* Responsive Premium CTA Block */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-[#1C1E20] to-[#2E3133] relative overflow-hidden">
          {/* Subtle Decorative Circle */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#A8C028]/10 blur-[100px] pointer-events-none"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white">
              Ready to Accelerate Your <span className="text-[#A8C028]">Digital Success?</span>
            </h2>
            <p className="text-gray-300 font-sans text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Partner with JWay Group to experience top-tier development execution, responsive project management, and high-impact digital consulting.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/contact-us"
                className="px-8 py-3.5 w-full sm:w-auto rounded-full bg-[#A8C028] hover:bg-[#A8C028]/95 text-white font-bold text-center transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Schedule Consultation
              </Link>
              <Link
                href="/about"
                className="px-8 py-3.5 w-full sm:w-auto rounded-full border border-gray-400 hover:border-white text-white font-semibold text-center bg-white/5 hover:bg-white/10 transition-all"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
