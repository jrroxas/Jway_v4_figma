"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getMediaUrl } from "@/utils/media";

interface AccordionItem {
  title: string;
  desc: string;
}

const CORE_VALUES = [
  {
    title: "Experienced",
    desc: "28+ years delivering Web, Mobile, Cloud, SFDC, Big Data, and Digital Marketing solutions.",
    icon: (
      <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    )
  },
  {
    title: "Process Driven",
    desc: "Streamlined processes to achieve superior and predictable results.",
    icon: (
      <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(1, 1) scale(0.75)">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </g>
        <g transform="translate(11, 11) scale(0.5)">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </g>
      </svg>
    )
  },
  {
    title: "Collaborative",
    desc: "We listen to our clients and collaborate for tailored solutions.",
    icon: (
      <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    title: "Client Focused",
    desc: "Trust-building is in our DNA with client bonds for over a decade.",
    icon: (
      <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    )
  },
  {
    title: "Innovative",
    desc: "We stay on-top of current technologies so you don't have to.",
    icon: (
      <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    )
  },
  {
    title: "AI-first",
    desc: "We integrate AI-first thinking into all our operations and client solutions.",
    icon: (
      <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="5" width="14" height="14" rx="2" ry="2" />
        <path d="M9 5V2M12 5V2M15 5V2M9 19v3M12 19v3M15 19v3M5 9H2M5 12H2M5 15H2M19 9h3M19 12h3M19 15h3" />
        <text x="12" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fontFamily="sans-serif" fill="currentColor" stroke="none">AI</text>
      </svg>
    )
  }
];

const RECRUITMENT_ACCORDION: AccordionItem[] = [
  { title: "Planning", desc: "Recruitment requisition, Job requirements analysis, Timeline, Calibration of expectations, Talent mapping, Salary benchmarking." },
  { title: "Sourcing", desc: "Prequalified talent database (25K+) search, Passive candidate sourcing, Referrals (internal & external), Job ads, boards and social media posting." },
  { title: "Screening", desc: "Paper Screening, HR Interview using Rubrik interview method, Technical Interview with our experts, Online Skill Testing (internal, *TestDome), Endorsement of Shortlisted Candidates." },
  { title: "Client Interview", desc: "Interview Scheduling, Client Interview, Client Assessment and Feedback." },
  { title: "Outcome", desc: "Reference Check, Job Offer, Background Check and Drug Testing, Onboarding." },
  { title: "Relationship Management", desc: "Ensure client and employee success, Provide client support for requirements and reporting." }
];

const MOBILE_ACCORDION: AccordionItem[] = [
  { title: "Strategy", desc: "Define the main objectives and goals, identify the audience, conduct competitive analysis, select a platform, choose a monetization method." },
  { title: "Analysis & Planning", desc: "Prepare product roadmap, define functional and non-functional requirements, identify technology stack and skills needed." },
  { title: "UI/UX Design", desc: "Design information architecture, create wireframes, style guides, mockups, and prototypes, and build a Briefing Book." },
  { title: "Application Development", desc: "Design the technical architecture, identify the technology stack, define the development milestones, and develop the back-end and front-end." },
  { title: "Application Testing", desc: "Perform a thorough quality assurance testing, conduct functionality, performance, user experience, security, and device and platform testing." },
  { title: "Deployment & Support", desc: "Distribute builds on TestFlight and Google Play Beta, submit the app on Apple App Store and Google Play Store, monitor usage through analytics platforms and track KPIs, and provide app maintenance and support." }
];

export default function ServicesGrid() {
  const [activeRec, setActiveRec] = useState(0);
  const [activeMob, setActiveMob] = useState(0);

  // Auto-advance Recruitment Accordion every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveRec((prev) => (prev + 1) % RECRUITMENT_ACCORDION.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeRec]);

  // Auto-advance Mobile Accordion every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMob((prev) => (prev + 1) % MOBILE_ACCORDION.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeMob]);

  return (
    <div className="w-full">

      {/* Section A: Startups to Enterprise */}
      <section className="py-12 md:py-20 bg-[#f6f7ef] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Image block */}
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <Image 
                src={getMediaUrl("/homepage/custom-solutions.jpg")} 
                alt="Custom solutions from Startups to Enterprise"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-start gap-3 sm:gap-4">
              <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-1 sm:mb-2">CUSTOM SOLUTIONS</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-[#2e2f31] leading-tight">
                Custom solutions <span className="text-jway-green block">from Startups to Enterprise</span>
              </h2>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                Rapidly scale with JWay Experts. Benefit from our vast experiences and collaborative approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Core Values */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">Our Pillars</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-[#2e2f31]">Core Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CORE_VALUES.map((val) => (
              <div 
                key={val.title}
                className="bg-white border border-gray-100 px-3 py-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center gap-4 group hover:-translate-y-1"
              >
                <div className="bg-jway-green/10 rounded-full p-4 group-hover:scale-105 transition-transform duration-300">
                  {val.icon}
                </div>
                <h3 className="text-[17px] font-heading font-bold text-gray-800">{val.title}</h3>
                <p className="text-[13px] text-gray-600 leading-relaxed font-sans">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section C: Staffing / Recruitment with Vertical Accordion */}
      <section className="py-16 md:py-24 bg-[#f9f9f9] border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Accordion list (Left) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">How We Do It</span>
              <h3 className="text-3xl font-heading font-bold text-[#2e2f31]">Our Recruitment Process</h3>
              
              <div className="relative border-l-2 border-gray-200 pl-6 flex flex-col gap-4 mt-4">
                {RECRUITMENT_ACCORDION.map((item, idx) => {
                  const isActive = idx === activeRec;
                  return (
                    <div 
                      key={item.title} 
                      onClick={() => setActiveRec(idx)}
                      className="cursor-pointer group flex flex-col text-left transition-colors relative"
                    >
                      <div 
                        className="absolute left-[-25px] top-0.5 w-0.5 bg-jway-green"
                        style={{
                          height: isActive ? "24px" : "0px",
                          opacity: isActive ? 1 : 0,
                          transition: "height 300ms ease-in-out, opacity 300ms ease-in-out"
                        }}
                      />
                      <h4 className={`text-base font-bold transition-colors ${isActive ? "text-jway-green" : "text-gray-600 hover:text-gray-800"}`}>
                        {item.title}
                      </h4>
                      <div 
                        style={{
                          display: "grid",
                          gridTemplateRows: isActive ? "1fr" : "0fr",
                          opacity: isActive ? 1 : 0,
                          transition: "grid-template-rows 300ms ease-in-out, opacity 300ms ease-in-out"
                        }}
                      >
                        <div className="overflow-hidden">
                          <p className="text-[13.5px] text-gray-600 mt-1.5 leading-relaxed font-sans">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accent image (Middle) */}
            <div className="lg:col-span-2 hidden lg:flex justify-center items-center">
              <img 
                src={getMediaUrl("/Circles.svg")}
                alt="Accent Circles"
                className="opacity-95 max-h-[190px] object-contain"
                loading="lazy"
              />
            </div>

            {/* Circular vector and text details (Right) */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-6 text-center lg:text-right">
              <h4 className="text-xl md:text-2xl font-heading font-bold text-gray-800 max-w-md">
                On-Demand Recruitment, Staff Augmentation, HR &amp; Payroll Services, and more
              </h4>
              <Link 
                href="/contact-us"
                className="px-8 py-3.5 bg-jway-green text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-jway-green/90 transition-all transform hover:-translate-y-0.5"
              >
                Let Us Find a Quality Talent For You
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Section D: Mobile Apps with Vertical Accordion */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Circular vector and details (Left) */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start gap-6 text-center lg:text-left">
              <h4 className="text-xl md:text-2xl font-heading font-bold text-gray-800 max-w-md">
                Flutter Apps for iOS and Android development with iterative design and seamless deployment
              </h4>
              <Link 
                href="/contact-us"
                className="px-8 py-3.5 bg-jway-green text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-jway-green/90 transition-all transform hover:-translate-y-0.5"
              >
                Join the Mobile-centric World Today
              </Link>
            </div>

            {/* Accent image (Middle) */}
            <div className="lg:col-span-2 hidden lg:flex justify-center items-center">
              <img 
                src={getMediaUrl("/Circles-set-v2.svg")}
                alt="Accent Circles"
                className="opacity-90 max-h-[220px] object-contain"
                loading="lazy"
              />
            </div>

            {/* Accordion list (Right) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">How We Do It</span>
              <h3 className="text-3xl font-heading font-bold text-[#2e2f31]">Mobile Development Lifecycle</h3>
              
              <div className="relative border-l-2 border-gray-200 pl-6 flex flex-col gap-4 mt-4">
                {MOBILE_ACCORDION.map((item, idx) => {
                  const isActive = idx === activeMob;
                  return (
                    <div 
                      key={item.title} 
                      onClick={() => setActiveMob(idx)}
                      className="cursor-pointer group flex flex-col text-left transition-colors relative"
                    >
                      <div 
                        className="absolute left-[-25px] top-0.5 w-0.5 bg-jway-green"
                        style={{
                          height: isActive ? "24px" : "0px",
                          opacity: isActive ? 1 : 0,
                          transition: "height 300ms ease-in-out, opacity 300ms ease-in-out"
                        }}
                      />
                      <h4 className={`text-base font-bold transition-colors ${isActive ? "text-jway-green" : "text-gray-600 hover:text-gray-800"}`}>
                        {item.title}
                      </h4>
                      <div 
                        style={{
                          display: "grid",
                          gridTemplateRows: isActive ? "1fr" : "0fr",
                          opacity: isActive ? 1 : 0,
                          transition: "grid-template-rows 300ms ease-in-out, opacity 300ms ease-in-out"
                        }}
                      >
                        <div className="overflow-hidden">
                          <p className="text-[13.5px] text-gray-600 mt-1.5 leading-relaxed font-sans">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
