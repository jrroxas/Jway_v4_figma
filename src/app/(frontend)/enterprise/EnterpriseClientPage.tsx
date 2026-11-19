"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMediaUrl } from "@/utils/media";
import LatestPosts from "@/components/LatestPosts";
import { MappedPost } from "@/lib/getContextualPosts";

interface SolutionItem {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

interface SalesforceSpecialty {
  tabId: string;
  tabTitle: string;
  heading: string;
  details: string;
  bulletPoints: string[];
}

interface EnterpriseClientPageProps {
  posts: MappedPost[];
}

export default function EnterpriseClientPage({ posts }: EnterpriseClientPageProps) {
  const [activeSalesforceTab, setActiveSalesforceTab] = useState("platform");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>("scalability");

  const ENTERPRISE_SOLUTIONS: SolutionItem[] = [
    {
      id: "app-dev",
      title: "Enterprise Application Development",
      shortDesc: "Bespoke, scalable digital platforms designed to drive core business processes.",
      description: "Architect and build modern, robust, and highly secure custom software systems. Leveraging over 28 years of Silicon Valley engineering excellence, we help enterprise clients digitize workflows, reduce technical debt, and ensure seamless system longevity.",
      icon: (
        <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L5 23.25M15 17.25v1.007a3 3 0 00.879 2.122L19 23.25M2.25 18h19.5M3 16.5v-10.5A2.25 2.25 0 015.25 3.75h13.5A2.25 2.25 0 0121 6v10.5A2.25 2.25 0 0118.75 18H5.25A2.25 2.25 0 013 16.5z" />
        </svg>
      ),
      features: [
        "Custom Enterprise Architectures & Web Apps",
        "Legacy Codebase Modernization",
        "Highly Secure, Multi-Tenant Applications",
        "Cloud Infrastructure Migration (AWS, GCP, Azure)",
        "High Availability & Performance Tuning",
      ],
    },
    {
      id: "integrations",
      title: "Product and Application Integrations",
      shortDesc: "Harmonize fragmented environments and automate end-to-end data flows.",
      description: "Eliminate data silos by seamlessly connecting enterprise platforms. We build reliable middleware, custom REST/GraphQL APIs, and robust enterprise service bus (ESB) bridges. Ensure your CRM, ERP, and database systems operate as a single cohesive unit.",
      icon: (
        <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      ),
      features: [
        "ERP Integration (SAP, Oracle EBS, NetSuite)",
        "Bespoke REST, SOAP, and GraphQL APIs",
        "Secure Event-Driven & Real-Time Syncing",
        "Secure Identity & Access Management (OAuth, SAML)",
        "Workflow & Supply Chain Orchestration",
      ],
    },
    {
      id: "poc",
      title: "Proof of Concept (POC) Support",
      shortDesc: "De-risk large-scale investments with rapid, high-fidelity prototypes.",
      description: "Validate complex hypotheses and technical designs before full-scale deployment. We rapidly engineer functional prototypes and Minimum Viable Products (MVPs) to demonstrate feasibility, capture stakeholder alignment, and secure budget approval safely.",
      icon: (
        <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 0 1-1.7-3L9 7.2V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3.2L20.7 18a2 2 0 0 1-1.7 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 16h12" />
        </svg>
      ),
      features: [
        "Rapid Architecture Validation & UX Prototypes",
        "Feasibility and Performance Testing",
        "Technology & Framework Stack Selection",
        "MVP Development & Interactive Demos",
        "Stakeholder & Investor Presentation Support",
      ],
    },
  ];

  const SALESFORCE_SPECIALTIES: SalesforceSpecialty[] = [
    {
      tabId: "platform",
      tabTitle: "Salesforce Platform & Force.com",
      heading: "Bespoke Apex and Lightning Web Components",
      details: "Unleash the full potential of your Salesforce deployment. We extend the core platform with highly customized Apex classes, custom triggers, Visualforce pages, and blazing-fast Lightning Web Components (LWC) matching your unique enterprise processes.",
      bulletPoints: [
        "Custom Apex, Triggers, and Visualforce",
        "Modern Lightning Web Component (LWC) development",
        "Custom Object Modeling & Data Schema Design",
        "Secure Multi-Tenant Cloud Architecture Solutions",
      ],
    },
    {
      tabId: "cpq",
      tabTitle: "Salesforce CPQ & Quote-to-Cash",
      heading: "Streamlined Quote-to-Cash Automation",
      details: "Accelerate your sales cycles with accurate configuration, pricing, and quoting. Our team implements and optimizes Salesforce CPQ, ensuring correct product bundles, complex discount approvals, contract lifecycle management (CLM), and seamless billing handoffs.",
      bulletPoints: [
        "Complex Product Bundling & Pricing Rules",
        "Automated Discount & Margin Approval Workflows",
        "Contract Lifecycle Management (CLM) Integration",
        "Clean handoffs to ERP & Billing Platforms",
      ],
    },
    {
      tabId: "crm",
      tabTitle: "CRM Customization & Integration",
      heading: "Cross-Cloud Success & ERP Syncing",
      details: "Drive deeper client relationships by optimizing and connecting Sales, Service, and Experience (Community) Clouds. We tailor layouts, reports, and dashboards while building bulletproof integrations to external ERPs like SAP and NetSuite.",
      bulletPoints: [
        "Sales Cloud, Service Cloud, and Experience Cloud",
        "Direct ERP Integrations (NetSuite, SAP, Oracle EBS)",
        "Unified Customer 360 Dashboards and Analytics",
        "Secure external community portal setup",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        <section 
          className="relative min-h-[70vh] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-cover bg-center overflow-hidden" 
          style={{ backgroundImage: `url('/about/About-banner.png')` }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[1px]"></div>
          
          <div className="relative max-w-5xl mx-auto text-center z-10 space-y-6">
            <span className="text-jway-green font-sans font-bold text-xs tracking-widest uppercase bg-[#A8C028]/15 px-4 py-1.5 rounded-full border border-jway-green/20 inline-block mb-3">
              Enterprise Solutions
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
              Scale Fearlessly with <br className="hidden sm:inline" />
              <span className="text-jway-green">Silicon Valley</span> Expertise
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 font-sans max-w-3xl mx-auto leading-relaxed">
              For over 28 years, JWay Group has delivered high-impact web, cloud, and CRM integrations to global enterprise leaders. Secure, process-driven, and meticulously engineered.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                href="/contact-us" 
                className="px-8 py-4 rounded-full bg-jway-green text-white font-bold hover:bg-jway-green/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
              >
                Schedule an Architect Call
              </Link>
              <Link 
                href="#solutions-grid" 
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-all backdrop-blur-sm border border-white/10 w-full sm:w-auto"
              >
                Explore Solutions
              </Link>
            </div>
          </div>
        </section>

        {/* Highlights Bar */}
        <section className="bg-[#F6F7EF] py-12 border-b border-gray-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-heading font-bold text-[#2e2f31]">28+</p>
                <p className="text-xs sm:text-sm font-sans font-semibold text-gray-500 uppercase tracking-wider">Years of Engineering</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-heading font-bold text-jway-green">100%</p>
                <p className="text-xs sm:text-sm font-sans font-semibold text-gray-500 uppercase tracking-wider">Deployment Success</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-heading font-bold text-[#2e2f31]">10K+</p>
                <p className="text-xs sm:text-sm font-sans font-semibold text-gray-500 uppercase tracking-wider">Pre-screened Talents</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-heading font-bold text-jway-green">USA &amp; PH</p>
                <p className="text-xs sm:text-sm font-sans font-semibold text-gray-500 uppercase tracking-wider">Hybrid Delivery Model</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Enterprise Solutions Section */}
        <section id="solutions-grid" className="py-24 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
                Core Offerings
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#2e2f31]">
                Engineered for Performance and Growth
              </h2>
              <p className="text-gray-600 font-sans text-[16px] leading-relaxed">
                JWay aligns with your business objectives to deliver highly secure, scalable, and beautifully integrated platforms. Discover how our core services streamline your enterprise.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {ENTERPRISE_SOLUTIONS.map((solution) => (
                <div
                  key={solution.id}
                  className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  onMouseEnter={() => setHoveredCard(solution.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Subtle top indicator hover line */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-jway-green transition-transform duration-300 ${
                    hoveredCard === solution.id ? "scale-x-100" : "scale-x-0"
                  }`} />

                  <div className="space-y-6">
                    <div className="bg-[#A8C028]/10 rounded-2xl w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {solution.icon}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-800 tracking-tight leading-snug group-hover:text-jway-green transition-colors">
                        {solution.title}
                      </h3>
                      <p className="text-gray-500 font-sans text-sm font-medium">
                        {solution.shortDesc}
                      </p>
                    </div>

                    <p className="text-gray-600 font-sans text-[14.5px] leading-relaxed">
                      {solution.description}
                    </p>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-[13px] font-sans font-bold text-gray-700 uppercase tracking-wider mb-3">Key Capabilities</p>
                      <ul className="space-y-2.5">
                        {solution.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2 text-[13.5px] text-gray-600 font-sans">
                            <svg className="w-4 h-4 text-jway-green shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8">
                    <Link
                      href="/contact-us"
                      className="text-jway-green font-bold text-[14px] flex items-center gap-1 hover:underline"
                    >
                      Request Details
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Dedicated Salesforce Custom Solutions Section */}
        <section className="py-24 bg-[#F9F9F9] relative overflow-hidden border-t border-b border-gray-100">
          <div className="absolute top-0 right-0 w-96 h-96 bg-jway-green/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-jway-green/5 rounded-full blur-3xl -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-white shadow-sm border border-gray-100 px-3.5 py-1.5 rounded-full inline-block mb-3">
                  Primary Specialty
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#2e2f31] leading-tight">
                  Salesforce Custom Solutions
                </h2>
                <div className="h-1.5 w-24 bg-jway-green rounded-full"></div>
                <p className="text-gray-700 font-sans text-lg leading-relaxed max-w-2xl pt-2">
                  Maximize your CRM ROI. We provide customized configurations, Force.com architectures, and advanced CPQ integrations to align Salesforce perfectly with your organizational workflows.
                </p>
              </div>
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-64 h-64 mx-auto lg:mx-0 hover:scale-105 transition-transform duration-500">
                  <Image 
                    src={getMediaUrl("/salesforce-integration.jpg")} 
                    alt="Salesforce Custom Solutions" 
                    fill 
                    className="object-contain rounded-2xl"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Interactive Salesforce Tabs */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden p-6 sm:p-10">
              
              {/* Tab Selector Buttons */}
              <div className="flex flex-col sm:flex-row border-b border-gray-100 pb-6 gap-2">
                {SALESFORCE_SPECIALTIES.map((spec) => {
                  const isActive = activeSalesforceTab === spec.tabId;
                  return (
                    <button
                      key={spec.tabId}
                      onClick={() => setActiveSalesforceTab(spec.tabId)}
                      className={`px-6 py-3 rounded-xl text-left sm:text-center font-heading font-bold text-[14.5px] transition-all duration-300 ${
                        isActive 
                          ? "bg-jway-green text-white shadow-md"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                    >
                      {spec.tabTitle}
                    </button>
                  );
                })}
              </div>

              {/* Tab Viewport */}
              <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[300px]">
                {SALESFORCE_SPECIALTIES.map((spec) => {
                  if (spec.tabId !== activeSalesforceTab) return null;
                  return (
                    <div key={spec.tabId} className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                      
                      <div className="lg:col-span-7 space-y-6">
                        <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
                          Deep Dive Capability
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-heading font-bold text-gray-800">
                          {spec.heading}
                        </h3>
                        <p className="text-gray-600 leading-relaxed font-sans text-[15.5px]">
                          {spec.details}
                        </p>
                        <div className="pt-4">
                          <Link
                            href="/contact-us"
                            className="inline-flex items-center justify-center px-6 py-3 bg-jway-green hover:bg-jway-green/90 text-white font-bold rounded-xl transition-all shadow-md"
                          >
                            Consult on {spec.tabTitle.split(" ")[0]}
                          </Link>
                        </div>
                      </div>

                      <div className="lg:col-span-5 bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100/80">
                        <span className="text-[12px] font-sans font-bold text-gray-400 uppercase tracking-widest block mb-4">Core Deliverables</span>
                        <ul className="space-y-3.5">
                          {spec.bulletPoints.map((point) => (
                            <li key={point} className="flex items-start gap-3 text-[14.5px] text-gray-700 font-sans">
                              <svg className="w-5 h-5 text-jway-green shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </section>

        {/* Assessment Section / Interactive Consultation Planner */}
        <section className="py-24 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-3">
              <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">Interactive Planner</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#2e2f31]">
                Identify Your Enterprise Architecture Gap
              </h2>
              <p className="text-gray-500 font-sans max-w-2xl mx-auto">
                Explore JWay&apos;s tailored solutions based on the challenges your technical and product groups are actively resolving.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Question 1 */}
              <div className="border border-gray-200/80 rounded-2xl overflow-hidden transition-all bg-white shadow-sm hover:shadow-md">
                <button
                  onClick={() => setSelectedAssessment(selectedAssessment === "scalability" ? null : "scalability")}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <span className="font-heading font-bold text-[17px] text-gray-800">
                    Are system latency and database bottlenecks slowing your growth?
                  </span>
                  <span className={`w-7 h-7 rounded-full bg-[#f6f7ef] flex items-center justify-center transition-transform ${selectedAssessment === "scalability" ? "rotate-180" : ""}`}>
                    <svg className="w-4 h-4 text-jway-green" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </button>
                {selectedAssessment === "scalability" && (
                  <div className="px-6 pb-6 pt-2 text-gray-600 font-sans text-[14.5px] leading-relaxed border-t border-gray-100/50 bg-[#F6F7EF]/30">
                    Our **Enterprise Application Development** services isolate slow database queries, establish scalable microservices architectures, and utilize global CDN edge caching to bring your platform down to sub-second load times.
                    <Link href="/contact-us" className="text-jway-green font-bold block mt-3 hover:underline">Speak with a Cloud Architect &rarr;</Link>
                  </div>
                )}
              </div>

              {/* Question 2 */}
              <div className="border border-gray-200/80 rounded-2xl overflow-hidden transition-all bg-white shadow-sm hover:shadow-md">
                <button
                  onClick={() => setSelectedAssessment(selectedAssessment === "integrations" ? null : "integrations")}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <span className="font-heading font-bold text-[17px] text-gray-800">
                    Are disjointed systems forcing your team into manual data reconciliation?
                  </span>
                  <span className={`w-7 h-7 rounded-full bg-[#f6f7ef] flex items-center justify-center transition-transform ${selectedAssessment === "integrations" ? "rotate-180" : ""}`}>
                    <svg className="w-4 h-4 text-jway-green" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </button>
                {selectedAssessment === "integrations" && (
                  <div className="px-6 pb-6 pt-2 text-gray-600 font-sans text-[14.5px] leading-relaxed border-t border-gray-100/50 bg-[#F6F7EF]/30">
                    Our **Product and Application Integrations** bridges Salesforce CRM, ERP solutions (like SAP or NetSuite), and billing platforms using secure event-driven middleware to guarantee transactional integrity and auto-sync.
                    <Link href="/contact-us" className="text-jway-green font-bold block mt-3 hover:underline">Discuss Custom Integrations &rarr;</Link>
                  </div>
                )}
              </div>

              {/* Question 3 */}
              <div className="border border-gray-200/80 rounded-2xl overflow-hidden transition-all bg-white shadow-sm hover:shadow-md">
                <button
                  onClick={() => setSelectedAssessment(selectedAssessment === "cpq" ? null : "cpq")}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <span className="font-heading font-bold text-[17px] text-gray-800">
                    Is sales complexity resulting in prolonged quote times and pricing errors?
                  </span>
                  <span className={`w-7 h-7 rounded-full bg-[#f6f7ef] flex items-center justify-center transition-transform ${selectedAssessment === "cpq" ? "rotate-180" : ""}`}>
                    <svg className="w-4 h-4 text-jway-green" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </button>
                {selectedAssessment === "cpq" && (
                  <div className="px-6 pb-6 pt-2 text-gray-600 font-sans text-[14.5px] leading-relaxed border-t border-gray-100/50 bg-[#F6F7EF]/30">
                    We deploy **Salesforce CPQ &amp; CRM Customization** to fully automate product bundles, enforce margin-based approval rules, and build intuitive product guides to cut quote generation down from days to minutes.
                    <Link href="/contact-us" className="text-jway-green font-bold block mt-3 hover:underline">Optimize Your Sales Funnel &rarr;</Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Contextual Dynamic Blog Insights */}
        <LatestPosts posts={posts} />

        {/* Premium Bottom Call to Action Section */}
        <section className="relative py-24 bg-[#2e2f31] text-white overflow-hidden text-center">
          {/* Decorative backdrop blobs */}
          <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full bg-jway-green/10 blur-3xl pointer-events-none -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-jway-green/10 blur-3xl pointer-events-none -translate-y-1/2" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-white/10 px-3.5 py-1.5 rounded-full border border-white/5 inline-block mb-3">
              Ready to Accelerate?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold leading-tight">
              Let&apos;s Build the Future of Your <span className="text-jway-green">Enterprise</span> Together
            </h2>
            <p className="text-gray-300 font-sans text-[16px] sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Partner with JWay Group to gain immediate access to battle-tested engineers, certified Salesforce consultants, and dedicated solutions managers.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/contact-us"
                className="px-8 py-4 bg-jway-green hover:bg-jway-green/90 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
              >
                Schedule an Assessment Call
              </Link>
              <Link
                href="/talents"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all border border-white/10 w-full sm:w-auto"
              >
                Access Remote Talents
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
