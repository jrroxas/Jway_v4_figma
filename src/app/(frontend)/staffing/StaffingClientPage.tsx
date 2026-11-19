"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LatestPosts from "@/components/LatestPosts";
import { MappedPost } from "@/lib/getContextualPosts";

// Metrics Data
const METRICS = [
  {
    value: "25,000+",
    label: "Pre-Vetted Talent",
    description: "Highly skilled, tech-evaluated professionals ready for immediate matching.",
    icon: (
      <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    )
  },
  {
    value: "3-5 Days",
    label: "Endorsement Speed",
    description: "Average turnaround from request placement to qualified candidate profile presentation.",
    icon: (
      <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    )
  },
  {
    value: "98%",
    label: "Client Satisfaction",
    description: "Retention and positive sentiment rate measured across our global partners.",
    icon: (
      <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1 -6.364 0M9 9h.008v.008H9V9zm6 0h.008v.008H15V9z" />
      </svg>
    )
  }
];

// Offerings Data
const OFFERINGS = [
  {
    id: "recruitment",
    title: "On-Demand Recruitment",
    description: "End-to-end recruitment services connecting you with pre-qualified professionals who align with your technological and team environment.",
    bullets: [
      "Access to extensive, exclusive databases of passive & active job-seekers.",
      "Comprehensive screening leveraging technical assessments & direct panel evaluations.",
      "Rubrik-guided profiling & interview facilitation for rapid internal evaluation.",
      "3-5 days delivery for typical tech & project roles."
    ],
    bgGradient: "from-blue-50/50 to-green-50/30",
    borderTheme: "border-blue-100",
    badge: "Most Comprehensive",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-60" />
        <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 18C6 15.2386 8.23858 13 11 13H13C14.1594 13 15.228 13.3934 16.0772 14.0537" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17.5" cy="17.5" r="2.5" stroke="#A8C028" strokeWidth="1.5" />
        <path d="M19.25 19.25L21.5 21.5" stroke="#A8C028" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: "augmentation",
    title: "Staff Augmentation",
    description: "Scale your software, creative, and engineering capacity smoothly to fill technical skill gaps or execute time-bound projects.",
    bullets: [
      "Rapid integration of dedicated engineering squads.",
      "Zero overhead related to recruitment, local benefits, or onboarding hardware.",
      "Flexible contracts enabling easy scale-up or scale-down based on milestones.",
      "Seamless alignment with your timezone, culture, and Git workflows."
    ],
    bgGradient: "from-[#F6F7EF]/60 to-white",
    borderTheme: "border-jway-green/20",
    badge: "Highest Flexibility",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 8L16 16M16 8L8 16" stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
        <circle cx="12" cy="12" r="1.5" fill="#A8C028" />
        <circle cx="6" cy="6" r="2.5" stroke="#A8C028" strokeWidth="1.5" fill="currentColor" />
        <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="6" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="18" r="2.5" stroke="#A8C028" strokeWidth="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    id: "payroll",
    title: "HR & Payroll Services",
    description: "Offload tedious administrative overhead. We handle payroll compliance, employment regulations, benefits, and local taxes.",
    bullets: [
      "End-to-end local entity employment compliance & legal framework support.",
      "Precise monthly/bi-monthly payroll processing with full state & tax withholding.",
      "Comprehensive administration of local benefits, health insurance, & state pensions.",
      "Secure time-tracking, attendance auditing, and expense management."
    ],
    bgGradient: "from-purple-50/50 to-pink-50/30",
    borderTheme: "border-purple-100",
    badge: "Turnkey Compliance",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 11V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H13L19 9V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 3V9H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 9H10M8 13H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 15.5C14 14.5 15.5 13.5 17 13.5C18.5 13.5 20 14.5 20 15.5C20 18.5 17 20 17 20C17 20 14 18.5 14 15.5Z" stroke="#A8C028" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M16 16.5L17 17.5L18.5 15.5" stroke="#A8C028" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
];

const ROLES = [
  { value: "Developer", label: "Software Developer / Engineer" },
  { value: "UI Designer", label: "UI/UX Designer" },
  { value: "QA", label: "Quality Assurance (QA) / Tester" },
  { value: "Project Manager", label: "Project Manager" },
  { value: "Other", label: "Other Specialized Role" }
];

const ENGAGEMENT_MODELS = [
  { value: "Staff Augmentation", label: "Staff Augmentation (Flexible Dedicated Team)" },
  { value: "On-Demand Recruitment", label: "On-Demand Recruitment (Direct Hire)" },
  { value: "HR & Payroll Services", label: "HR & Payroll Services Support" }
];

interface StaffingClientPageProps {
  posts: MappedPost[];
}

const formatPhoneNumber = (value: string): string => {
  if (!value) return "";
  
  let sanitized = value.replace(/[^\d+]/g, "");
  if (!sanitized.startsWith("+")) {
    sanitized = "+" + sanitized.replace(/\+/g, "");
  }

  const digits = sanitized.slice(1).replace(/\D/g, "");
  if (!digits) return "+";

  let formatted = "+";
  if (digits.length <= 1) {
    formatted += digits;
  } else if (digits.length <= 4) {
    formatted += `${digits.slice(0, 1)} (${digits.slice(1)}`;
  } else if (digits.length <= 7) {
    formatted += `${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
  } else if (digits.length <= 11) {
    formatted += `${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
  } else {
    formatted += `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10, 14)}`.trim();
  }

  return formatted.slice(0, 17);
};

export default function StaffingClientPage({ posts }: StaffingClientPageProps) {
  const [activeTab, setActiveTab] = useState("recruitment");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    role: "Developer",
    engagementModel: "Staff Augmentation",
    requirements: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      const sanitized = value.replace(/[^\p{L}\s'’\-.,]/gu, "");
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }
    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, phone: formatted }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) {
      setStatus("error");
      return;
    }
    
    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subject: `${formData.role} (${formData.engagementModel})`,
          formName: "Staffing Talent Request",
        }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Staffing form submission error:", err);
      setStatus("error");
    }
  };

  const selectedOffering = OFFERINGS.find((o) => o.id === activeTab) || OFFERINGS[0];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[75vh] flex items-center py-24 px-4 sm:px-6 lg:px-8 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80')` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-[#2e2f31]/60 backdrop-blur-[1px]"></div>
          
          <div className="relative max-w-7xl mx-auto z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-jway-green/20 text-jway-green text-sm font-semibold tracking-wider uppercase border border-jway-green/30">
                Premium Global Staffing
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white leading-tight">
                Scale Your Capabilities with <span className="text-jway-green">Top-Tier Tech Talent</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 font-sans max-w-2xl leading-relaxed">
                Skip the hiring headache. JWay Group bridges the gap between ambitious enterprises and exceptional, pre-vetted professionals. From developers to project managers, we deliver speed, compliance, and flawless alignment.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#talent-request-form"
                  className="px-8 py-3.5 rounded-full bg-jway-green text-white font-bold hover:bg-jway-green/90 hover:scale-105 transition-all shadow-lg hover:shadow-jway-green/20"
                >
                  Request Talent Now
                </a>
                <a
                  href="#staffing-offerings"
                  className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm border border-white/20 transition-all"
                >
                  Explore Offerings
                </a>
              </div>
            </div>

            {/* Hero Right Widget */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jway-green/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                <h3 className="text-white text-xl font-bold font-heading mb-6 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-jway-green animate-ping"></span>
                  Why Choose JWay Staffing?
                </h3>
                <ul className="space-y-4 text-gray-200 font-sans text-sm">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-jway-green shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span><strong>Rigorous Screening:</strong> Coding tests, multi-round technical interviews, and culture-fit assessments.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-jway-green shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span><strong>Zero Administrative Friction:</strong> We manage employment taxes, hardware procurement, and benefits.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-jway-green shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span><strong>Silicon Valley Heritage:</strong> Over 28 years of IT experience combined with a cost-efficient Philippine development center.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Core Metrics Section */}
        <section className="py-20 bg-gray-50/50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {METRICS.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-5"
                >
                  <div className="p-3 bg-jway-green/10 rounded-xl text-jway-green shrink-0">
                    <div>
                      {metric.icon}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-800 tracking-tight whitespace-nowrap">
                      {metric.value}
                    </h4>
                    <p className="text-sm sm:text-base font-bold text-jway-green mt-1">
                      {metric.label}
                    </p>
                    <p className="text-gray-500 font-sans text-sm mt-2 leading-relaxed">
                      {metric.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offering Details Tabs Section */}
        <section id="staffing-offerings" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-4 py-1.5 rounded-full inline-block mb-3">
                Tailored Engagement Models
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-800">
                End-to-End <span className="text-jway-green">Workforce Strategy</span>
              </h2>
              <div className="h-1.5 w-20 bg-jway-green rounded-full mx-auto"></div>
              <p className="text-gray-600 text-base sm:text-lg font-sans max-w-2xl mx-auto leading-relaxed pt-2">
                We accommodate diverse organizational goals. Select the hiring, scaling, or administrative structure that aligns perfectly with your timeline and budget.
              </p>
            </div>

            {/* Interactive Tabs Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
              
              {/* Tabs Navigator list */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {OFFERINGS.map((offering) => {
                  const isActive = offering.id === activeTab;
                  return (
                    <button
                      key={offering.id}
                      onClick={() => setActiveTab(offering.id)}
                      className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${
                        isActive
                          ? "bg-gray-900 border-gray-900 shadow-xl text-white scale-102"
                          : "bg-gray-50/50 border-gray-100 hover:bg-gray-50 text-gray-700 hover:border-gray-200"
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                        isActive ? "bg-jway-green/20 text-jway-green" : "bg-gray-200/50 text-gray-600 group-hover:bg-jway-green/10 group-hover:text-jway-green"
                      }`}>
                        {offering.icon}
                      </div>
                      <div className="flex-grow">
                        <span className={`text-[12px] font-bold uppercase tracking-wider block ${
                          isActive ? "text-jway-green" : "text-gray-400"
                        }`}>
                          {offering.badge}
                        </span>
                        <h3 className="font-heading font-bold text-[16px] mt-0.5 leading-snug">
                          {offering.title}
                        </h3>
                      </div>
                      <svg className={`w-5 h-5 shrink-0 transition-transform ${
                        isActive ? "text-jway-green translate-x-1" : "text-gray-400 group-hover:translate-x-1"
                      }`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  );
                })}
              </div>

              {/* Tabs Display Content viewport */}
              <div className="lg:col-span-8">
                <div className={`bg-gradient-to-br ${selectedOffering.bgGradient} border ${selectedOffering.borderTheme} p-8 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden transition-all duration-500`}>
                  
                  {/* Decorative faint background tag */}
                  <div className="absolute right-[-40px] bottom-[-40px] text-gray-200/10 pointer-events-none font-bold text-[120px] select-none uppercase tracking-widest leading-none">
                    JWay
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-3 py-1 text-xs font-bold bg-jway-green/10 text-jway-green rounded-full border border-jway-green/20 uppercase tracking-wide">
                      {selectedOffering.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-gray-800 mb-4">
                    {selectedOffering.title}
                  </h3>
                  <p className="text-gray-600 font-sans leading-relaxed text-[16px] mb-8">
                    {selectedOffering.description}
                  </p>

                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="font-heading font-bold text-sm text-gray-800 uppercase tracking-wider mb-4">
                      Key Highlights &amp; Scope
                    </h4>
                    <ul className="space-y-3">
                      {selectedOffering.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 font-sans">
                          <svg className="w-5 h-5 text-jway-green shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-4">
                    <a
                      href="#talent-request-form"
                      onClick={() => setFormData(prev => ({ ...prev, engagementModel: selectedOffering.title }))}
                      className="px-6 py-3 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm transition-all shadow-md"
                    >
                      Inquire About {selectedOffering.title}
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Project Rescue Mission Interactive Game Banner */}
        <section className="py-20 bg-slate-950 border-y border-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-jway-green/5 via-transparent to-transparent pointer-events-none"></div>
          
          {/* Grid ambient background lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-slate-900/60 backdrop-blur-md border border-[#a8c028]/20 rounded-3xl p-8 sm:p-12 text-center space-y-6 relative group hover:border-[#a8c028]/45 transition-all duration-300">
              
              {/* Alert Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-black tracking-widest border border-red-500/20 uppercase animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Triage Simulation Live
              </div>

              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
                Can You Triage a <span className="text-jway-green">Production Bottleneck?</span>
              </h2>

              <p className="text-gray-400 font-sans text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Database handshakes failing? Core Web Vitals dropping? Experience the stress of managing a scaling project. Assign matching JWay Experts to solve infrastructure bottlenecks before your health bar hits zero!
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/staffing/rescue-mission"
                  className="px-8 py-3.5 rounded-full bg-[#a8c028] text-white font-extrabold hover:bg-[#a8c028]/95 hover:scale-105 transition-all text-sm shadow-lg shadow-[#a8c028]/20 flex items-center gap-2 group"
                >
                  Launch Rescue Simulator
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
                <a
                  href="#talent-request-form"
                  className="px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold transition-all text-sm border border-white/10"
                >
                  Request Real-World Experts
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Lead Gen Interactive Glassmorphism Form Section */}
        <section id="talent-request-form" className="py-24 bg-gradient-to-b from-white to-[#F6F7EF] relative overflow-hidden">
          
          {/* Subtle colored background blurs */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-jway-green/10 blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left Column Copy */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-4 py-1.5 rounded-full inline-block mb-3">
                  Talent Matching
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-800 leading-tight">
                  Ready to Build <br />
                  <span className="text-jway-green">Your Dream Team?</span>
                </h2>
                <p className="text-gray-600 font-sans text-base leading-relaxed">
                  Provide your talent criteria using our Request portal. Our sourcing team evaluates active/passive pools, conducts initial coding &amp; background vetting, and endorsements arrive in your inbox in <strong>3-5 days</strong>.
                </p>

                {/* Micro Steps list */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-jway-green/15 text-jway-green font-bold text-sm flex items-center justify-center shrink-0">1</span>
                    <div>
                      <h4 className="font-heading font-bold text-gray-800 text-sm">Specify Role and Model</h4>
                      <p className="text-gray-500 text-xs font-sans mt-0.5">Let us know if you need full-time augmentation or on-demand candidates.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-jway-green/15 text-jway-green font-bold text-sm flex items-center justify-center shrink-0">2</span>
                    <div>
                      <h4 className="font-heading font-bold text-gray-800 text-sm">Technical Pre-Vetting</h4>
                      <p className="text-gray-500 text-xs font-sans mt-0.5">We filter profiles through our rigorous screening process to present top matches.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-jway-green/15 text-jway-green font-bold text-sm flex items-center justify-center shrink-0">3</span>
                    <div>
                      <h4 className="font-heading font-bold text-gray-800 text-sm">Seamless Endorsements</h4>
                      <p className="text-gray-500 text-xs font-sans mt-0.5">Receive standard resumes and interview summaries for final client-side selection.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Glassmorphism Card */}
              <div className="lg:col-span-7">
                <div className="relative bg-white/60 backdrop-blur-xl border border-white/80 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300">
                  
                  {/* Subtle inner card lights */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-jway-green/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>

                  <div className="mb-8">
                    <h3 className="text-2xl font-heading font-bold text-gray-800">
                      Submit Talent Request
                    </h3>
                    <p className="text-gray-500 text-xs font-sans mt-1">
                      Fill out the form below. Our response team will review your specifications immediately.
                    </p>
                  </div>

                  {status === "success" ? (
                    <div className="py-12 px-4 text-center space-y-4 animate-fade-in">
                      <div className="w-16 h-16 bg-jway-green/20 text-jway-green rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-gray-800">
                        Request Received!
                      </h3>
                      <p className="text-gray-600 font-sans text-sm max-w-sm mx-auto leading-relaxed">
                        Thank you for reaching out. A JWay technical sourcing specialist will contact you in the next <strong>24 business hours</strong> to finalize candidate profiles.
                      </p>
                      <button
                        onClick={() => {
                          setStatus("idle");
                          setFormData({
                            name: "",
                            email: "",
                            company: "",
                            phone: "",
                            role: "Developer",
                            engagementModel: "Staff Augmentation",
                            requirements: ""
                          });
                        }}
                        className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-semibold text-xs hover:bg-gray-800 transition-colors"
                      >
                        Submit Another Request
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      
                      {/* Name / Email split row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. John Doe"
                            className="w-full bg-white/70 border border-gray-200 focus:border-jway-green focus:ring-1 focus:ring-jway-green rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-gray-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                            Business Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="e.g. john@company.com"
                            className="w-full bg-white/70 border border-gray-200 focus:border-jway-green focus:ring-1 focus:ring-jway-green rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-gray-800"
                          />
                        </div>
                      </div>

                      {/* Company / Phone split row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                            Company Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="company"
                            required
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="e.g. Acme Tech"
                            className="w-full bg-white/70 border border-gray-200 focus:border-jway-green focus:ring-1 focus:ring-jway-green rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-gray-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                            Phone Number (Optional)
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            maxLength={17}
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (XXX) XXX-XXXX"
                            className="w-full bg-white/70 border border-gray-200 focus:border-jway-green focus:ring-1 focus:ring-jway-green rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-gray-800"
                          />
                        </div>
                      </div>

                      {/* Dropdowns split row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                            Desired Talent Role <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name="role"
                              value={formData.role}
                              onChange={handleInputChange}
                              className="w-full bg-white/80 border border-gray-200 focus:border-jway-green focus:ring-1 focus:ring-jway-green rounded-xl pl-3.5 pr-10 py-3 text-sm focus:outline-none text-gray-800 appearance-none cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap"
                            >
                              {ROLES.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                            Engagement Model <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name="engagementModel"
                              value={formData.engagementModel}
                              onChange={handleInputChange}
                              className="w-full bg-white/80 border border-gray-200 focus:border-jway-green focus:ring-1 focus:ring-jway-green rounded-xl pl-3.5 pr-10 py-3 text-sm focus:outline-none text-gray-800 appearance-none cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap"
                            >
                              {ENGAGEMENT_MODELS.map((model) => (
                                <option key={model.value} value={model.value}>
                                  {model.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detailed requirements */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                          Skills or Special Instructions (Optional)
                        </label>
                        <textarea
                          name="requirements"
                          rows={3}
                          value={formData.requirements}
                          onChange={handleInputChange}
                          placeholder="Describe specific tech stack requirements (e.g. Next.js, Flutter, AWS) or hiring volume..."
                          className="w-full bg-white/70 border border-gray-200 focus:border-jway-green focus:ring-1 focus:ring-jway-green rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-gray-800 resize-none"
                        ></textarea>
                      </div>

                      {status === "error" && (
                        <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                          </svg>
                          Please fill in all required fields marked with an asterisk (*).
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full py-4 rounded-xl bg-jway-green text-white font-extrabold tracking-wide hover:bg-jway-green/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-jway-green/10 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
                      >
                        {status === "submitting" ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Your Request...
                          </>
                        ) : (
                          "Request Candidate Endorsements"
                        )}
                      </button>
                    </form>
                  )}

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Contextual blog insights */}
        <LatestPosts posts={posts} />

        {/* Dynamic FAQ/Trust Accordion Section */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">FAQ</span>
              <h2 className="text-3xl font-heading font-bold text-gray-800">
                Frequently Asked <span className="text-jway-green">Questions</span>
              </h2>
              <div className="h-1.5 w-16 bg-jway-green rounded-full mx-auto"></div>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "How does the JWay screening process ensure talent quality?",
                  a: "Every candidate undergoes a multi-layered verification strategy including standardized coding evaluations, architectural reviews, and deep-dive technical panels matching real-world requirements before they are endorsed to you."
                },
                {
                  q: "Can JWay assist in handling international payroll and taxes?",
                  a: "Yes! Through our HR & Payroll offering, we act as a turnkey employer-of-record (EOR) handling localized compliance, employee contracts, state taxes, pensions, and medical benefits."
                },
                {
                  q: "What is the typical ramp-up time for a designated engineer?",
                  a: "Depending on stack complexity, our pre-vetted active pool allows us to endorse matching CVs in 3-5 days. Actual onboard timing varies from immediate kickoff to standard 2-week transition cycles."
                }
              ].map((faq, idx) => (
                <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100/80">
                  <h4 className="font-heading font-bold text-gray-800 text-base flex items-start gap-3">
                    <span className="text-jway-green font-extrabold">Q.</span>
                    {faq.q}
                  </h4>
                  <p className="text-gray-600 font-sans text-sm mt-3 leading-relaxed pl-6 border-l-2 border-jway-green/30">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
