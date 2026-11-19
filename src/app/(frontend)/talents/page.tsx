"use client";

import { useState, useMemo, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock Talent Pool Data
interface Talent {
  id: string;
  roleTitle: string;
  category: "ai" | "frontend" | "backend" | "design" | "qa" | "management";
  experienceYears: number;
  vettingScore: number;
  status: "Available Now" | "Interviewing" | "Placed";
  skills: string[];
  pricingNote: string;
  avatarSeed: string;
  brief: string;
}

const TALENT_DATA: Talent[] = [
  {
    id: "Talent AI-301",
    roleTitle: "Lead AI/ML & LLM Engineer",
    category: "ai",
    experienceYears: 7,
    vettingScore: 98,
    status: "Available Now",
    skills: ["PyTorch", "LangChain", "OpenAI API", "Python", "RAG Systems"],
    pricingNote: "$4,500/mo base",
    avatarSeed: "ai-eng-1",
    brief: "AI Engineering specialist focusing on prompt orchestration, custom LLM fine-tuning, and scalable production vector database integrations."
  },
  {
    id: "Talent AI-308",
    roleTitle: "Senior AI-Equipped Full-Stack Engineer",
    category: "ai",
    experienceYears: 6,
    vettingScore: 97,
    status: "Available Now",
    skills: ["Next.js", "LangChain", "Node.js", "Python", "GPT Agent Vetting"],
    pricingNote: "$4,200/mo base",
    avatarSeed: "ai-stack-2",
    brief: "Versatile full-stack developer specializing in integrating cognitive AI features into enterprise SaaS platforms, React interfaces, and serverless APIs."
  },
  {
    id: "Talent J-102",
    roleTitle: "Senior Frontend Engineer (AI-Equipped)",
    category: "frontend",
    experienceYears: 8,
    vettingScore: 97,
    status: "Interviewing",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vite"],
    pricingNote: "$3,600/mo base",
    avatarSeed: "fe-dev-1",
    brief: "UI/UX performance enthusiast with massive expertise in responsive application architecture, client-side rendering, and interactive dashboard builds."
  },
  {
    id: "Talent J-104",
    roleTitle: "Lead Node.js & Cloud Architect",
    category: "backend",
    experienceYears: 9,
    vettingScore: 96,
    status: "Available Now",
    skills: ["Node.js", "Express", "PostgreSQL", "AWS (ECS/S3)", "Docker"],
    pricingNote: "$4,000/mo base",
    avatarSeed: "be-dev-1",
    brief: "Backend expert focusing on high-throughput REST/GraphQL APIs, secure relational databases, and serverless architectures."
  },
  {
    id: "Talent D-205",
    roleTitle: "Lead UI/UX & Product Designer",
    category: "design",
    experienceYears: 6,
    vettingScore: 95,
    status: "Available Now",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research", "Wireframing"],
    pricingNote: "$3,200/mo base",
    avatarSeed: "ux-des-1",
    brief: "Creative product designer dedicated to clean user journeys, functional typography, dynamic micro-interactions, and visual layout alignment."
  },
  {
    id: "Talent Q-401",
    roleTitle: "Senior QA Automation Engineer",
    category: "qa",
    experienceYears: 5,
    vettingScore: 94,
    status: "Interviewing",
    skills: ["Cypress", "Playwright", "Selenium", "CI/CD Pipelines", "Jest"],
    pricingNote: "$3,000/mo base",
    avatarSeed: "qa-eng-1",
    brief: "Detail-oriented QA engineer specialized in writing reliable end-to-end regression suites, load testing, and automating smoke tests on staging."
  },
  {
    id: "Talent P-502",
    roleTitle: "Senior Agile Project Manager",
    category: "management",
    experienceYears: 7,
    vettingScore: 96,
    status: "Available Now",
    skills: ["Scrum Master", "Jira", "Asana", "Agile Coaching", "Risk Management"],
    pricingNote: "$3,500/mo base",
    avatarSeed: "pm-mgr-1",
    brief: "Operational leader driving high-performing engineering squads using agile processes, clear milestone mapping, and transparent stakeholder reporting."
  }
];

const METRICS = [
  {
    value: "25,000+",
    label: "Pre-Vetted Candidates",
    description: "Rigorous technical screening filters standard profiles down to elite developers and AI specialists."
  },
  {
    value: "48 Hours",
    label: "Rapid Delivery Speed",
    description: "Average turnaround to interview matches and begin onboarding top-tier remote talent."
  },
  {
    value: "90 Days",
    label: "Free Replacement",
    description: "Standard guarantee: absolute zero cost to replace or swap talent for total peace of mind."
  }
];

const BONUSES = [
  {
    title: "Bonus #1: Dedicated Relationship Manager",
    value: "$1,500 Value",
    desc: "A dedicated point-of-contact to handle smooth onboarding, payroll syncing, time-sheet approvals, and ongoing integration support."
  },
  {
    title: "Bonus #2: Custom Technical Assessments",
    value: "$500 Value",
    desc: "We build tailored technical tests matching your exact tech stack and company-specific coding guidelines to pre-qualify matches perfectly."
  },
  {
    title: "Bonus #3: 30-Day Zero-Fee EOR Admin",
    value: "$1,200 Value",
    desc: "Complete local employer-of-record administrative management, benefits administration, and tax withholding support with zero management fee for month one."
  }
];

export default function TalentsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTalent, setSelectedTalent] = useState<string>("");
  
  const formRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    requirements: ""
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
  }>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const filteredTalents = useMemo(() => {
    return TALENT_DATA.filter((talent) => {
      const matchesCategory = activeCategory === "all" || talent.category === activeCategory;
      const matchesSearch =
        talent.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talent.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talent.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleSecureTalent = (talentId: string, roleTitle: string) => {
    setSelectedTalent(talentId);
    setFormData((prev) => ({
      ...prev,
      requirements: `Inquiry regarding ${talentId} (${roleTitle}). Please schedule an interview.`
    }));
    
    // Smooth scroll to lead-gen form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      const sanitized = value.replace(/[^\p{L}\s'’\-.,]/gu, "");
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      if (errors.name) {
        setErrors((prev) => ({ ...prev, name: undefined }));
      }
      return;
    }
    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, phone: formatted }));
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: undefined }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    
    // Name validation
    const nameRegex = /^[\p{L}\s'’\-.,]+$/u;
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    } else if (!nameRegex.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters, spaces, hyphens, and apostrophes.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Work email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid work email address.";
    }

    // Company validation
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required.";
    } else if (formData.company.trim().length < 2) {
      newErrors.company = "Company name must be at least 2 characters.";
    }

    // Phone validation (optional)
    if (formData.phone.trim()) {
      const phoneRegex = /^[+0-9\s()-.]{7,20}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = "Please enter a valid phone number (7-20 digits).";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus("error");
      return;
    }
    
    setErrors({});
    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subject: selectedTalent ? `Talent Inquiry: ${selectedTalent}` : "General Talent Sourcing",
          formName: "Talent Sourcing Inquiry",
        }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Talent inquiry submission error:", err);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Header />

      <main className="flex-grow">
        {/* $100M Offers Value-Driven Hero Section */}
        <section className="relative min-h-[85vh] flex items-center py-28 px-4 sm:px-6 lg:px-8 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80')` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/90 to-gray-900/40 backdrop-blur-[1px]"></div>
          
          {/* Subtle light leaks */}
          <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-jway-green/10 blur-[120px] pointer-events-none"></div>

          <div className="relative max-w-7xl mx-auto z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Hero Value Proposition */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-jway-green/20 text-jway-green text-sm font-semibold tracking-wider uppercase border border-jway-green/30">
                Premium Global Placements
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white leading-tight">
                Scale Instantly With Elite <br />
                <span className="text-jway-green">AI &amp; Tech Talent</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 font-sans max-w-2xl leading-relaxed">
                Skip standard recruiting friction. Hire elite software developers, specialized AI engineers, and AI-equipped professionals vetted by industry leaders. Complete global HR, taxes, and compliance handled under one turnkey solution.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#talent-db"
                  className="px-8 py-4 rounded-full bg-jway-green text-white font-bold hover:bg-jway-green/90 hover:scale-105 transition-all shadow-lg shadow-jway-green/20"
                >
                  Explore Talent Database
                </a>
                <a
                  href="#grand-slam-offer"
                  className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm border border-white/20 transition-all"
                >
                  View Placement Offer
                </a>
              </div>
            </div>

            {/* Interactive Live Ticker / Vetting Card */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jway-green/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                
                {/* Simulated database action ticker */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-jway-green animate-ping"></span>
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Database Live Feed</span>
                </div>
                
                <h3 className="text-white text-xl font-bold font-heading mb-4">
                  Why Leading Teams Trust JWay
                </h3>
                
                <ul className="space-y-5 text-gray-200 font-sans text-sm">
                  <li className="flex items-start gap-3">
                    <div className="p-1 bg-jway-green/20 rounded-lg shrink-0 mt-0.5 text-jway-green">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                    <span><strong>Pre-Vetted AI Experts:</strong> Highly skilled AI engineering and AI-equipped talent trained in prompt optimization, LLM architectures, and rapid code augmentation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 bg-jway-green/20 rounded-lg shrink-0 mt-0.5 text-jway-green">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                    <span><strong>Silicon Valley Standard:</strong> Combining over 28 years of IT consulting heritage with highly optimized global hiring models.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 bg-jway-green/20 rounded-lg shrink-0 mt-0.5 text-jway-green">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                    <span><strong>Deferred Invoicing:</strong> Evaluate capabilities on real projects before a single dollar leaves your bank.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Core Metrics Banner */}
        <section className="py-16 bg-gray-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {METRICS.map((metric, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-sm hover:shadow-md transition-all duration-300">
                  <span className="text-3xl font-heading font-extrabold text-gray-800 tracking-tight block">
                    {metric.value}
                  </span>
                  <span className="text-sm font-bold text-jway-green block mt-1 uppercase tracking-wide">
                    {metric.label}
                  </span>
                  <p className="text-gray-500 font-sans text-xs mt-2 leading-relaxed">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simulated Live Talent Database Feed Section */}
        <section id="talent-db" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-4 py-1.5 rounded-full inline-block mb-3">
                Active Talent Pipeline
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-800">
                Explore Available <span className="text-jway-green">Top-Tier Placements</span>
              </h2>
              <div className="h-1 bg-jway-green w-20 mx-auto rounded-full mt-3"></div>
              <p className="text-gray-600 font-sans text-sm max-w-xl mx-auto pt-2 leading-relaxed">
                Direct realtime extraction from our vetting pipeline. Click "Request Interview" to instantly link profile data and lock standard evaluation slots.
              </p>
            </div>

            {/* Filter and Search Actions Row */}
            <div className="max-w-5xl mx-auto mb-8 bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All Tech" },
                  { value: "ai", label: "AI & ML" },
                  { value: "frontend", label: "Frontend" },
                  { value: "backend", label: "Backend" },
                  { value: "design", label: "UI/UX Design" },
                  { value: "qa", label: "QA & Automation" },
                  { value: "management", label: "Agile Mgmt" }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveCategory(tab.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeCategory === tab.value
                        ? "bg-gray-900 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Field */}
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills, ID, or title..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 focus:border-jway-green focus:ring-1 focus:ring-jway-green rounded-xl text-xs focus:outline-none text-gray-800"
                />
              </div>
            </div>

            {/* Grid display of Talents */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTalents.map((talent) => (
                <div
                  key={talent.id}
                  className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                    selectedTalent === talent.id
                      ? "border-jway-green ring-2 ring-jway-green/20 bg-jway-green/5"
                      : "border-gray-100 hover:border-gray-200 hover:shadow-lg"
                  }`}
                >
                  {/* Glowing tag for AI category */}
                  {talent.category === "ai" && (
                    <div className="absolute top-0 right-0 bg-jway-green text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                      Highly Requested
                    </div>
                  )}

                  <div>
                    {/* Header meta */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xs font-bold text-gray-400 block tracking-wide uppercase">
                          {talent.id}
                        </span>
                        <h3 className="font-heading font-bold text-lg text-gray-800 mt-0.5 leading-snug">
                          {talent.roleTitle}
                        </h3>
                      </div>
                      
                      {/* Live availability badges */}
                      <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold tracking-wide uppercase shrink-0 ${
                        talent.status === "Available Now"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          talent.status === "Available Now" ? "bg-green-500 animate-pulse" : "bg-amber-500"
                        }`}></span>
                        {talent.status}
                      </span>
                    </div>

                    <p className="text-gray-500 text-xs font-sans leading-relaxed mb-5">
                      {talent.brief}
                    </p>

                    {/* Vetting Score / Experience row */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50 mb-4 bg-gray-50/50 px-3 rounded-xl">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Vetting Score</span>
                        <span className="font-heading font-extrabold text-sm text-gray-800">{talent.vettingScore}% Verified</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Experience</span>
                        <span className="font-heading font-extrabold text-sm text-gray-800">{talent.experienceYears} Years</span>
                      </div>
                    </div>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {talent.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-600 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing / Booking button row */}
                  <div className="border-t border-gray-100 pt-4 mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-widest">Rate Indicator</span>
                      <span className="font-heading font-extrabold text-sm text-gray-800">
                        {talent.pricingNote}
                      </span>
                      <span className="text-[9px] text-gray-400 block mt-0.5">*Rate determined by individual profile</span>
                    </div>

                    <button
                      onClick={() => handleSecureTalent(talent.id, talent.roleTitle)}
                      className={`px-5 py-2.5 rounded-full font-bold text-xs transition-all duration-300 transform active:scale-95 ${
                        selectedTalent === talent.id
                          ? "bg-jway-green text-slate-950 shadow-md shadow-jway-green/20 hover:bg-jway-green/95 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-jway-green/30"
                          : "bg-gray-900 text-white hover:bg-jway-green hover:text-slate-950 hover:-translate-y-0.5 hover:shadow-md hover:shadow-jway-green/25"
                      }`}
                    >
                      Request Interview
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {filteredTalents.length === 0 && (
              <div className="max-w-md mx-auto text-center py-12">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
                </svg>
                <p className="text-gray-500 font-sans text-sm">No talents match the current filters. Search for different keywords or clear inputs.</p>
              </div>
            )}

          </div>
        </section>

        {/* The $100M Grand Slam Offer & Risk Reversals */}
        <section id="grand-slam-offer" className="py-24 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-jway-green/5 via-transparent to-transparent pointer-events-none"></div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Value Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">The Grand Slam Staffing Offer</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight">
                Zero Upfront Risk. <br />
                <span className="text-jway-green">Invoiced Only After You Hire.</span>
              </h2>
              <div className="h-1 bg-jway-green w-20 mx-auto rounded-full mt-3"></div>
            </div>

            {/* Main Value Proposition Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Guarantee Stack */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl space-y-5">
                  <h3 className="text-2xl font-heading font-bold text-white flex items-start gap-3">
                    <svg className="w-6 h-6 text-jway-green shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                    <span>The Zero Upfront Risk Guarantee</span>
                  </h3>
                  
                  <div className="space-y-4 font-sans text-sm text-gray-300">
                    <div className="flex items-start gap-4">
                      <span className="text-jway-green font-bold text-lg shrink-0 w-12 text-left pt-0.5">$0</span>
                      <div className="min-w-0">
                        <h4 className="text-white font-bold text-sm">No Advanced Placement Fees</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Pay absolutely nothing upfront. We handle sourcing, rigorous tech stack vetting, and interview alignment at zero advanced costs.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <span className="text-jway-green font-bold text-lg shrink-0 w-12 text-left pt-0.5">2d</span>
                      <div className="min-w-0">
                        <h4 className="text-white font-bold text-sm">Deferred Performance Invoicing</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Placement fees are invoiced 2 days AFTER the candidate is officially hired, allowing you to gauge performance on live tasks first.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <span className="text-jway-green font-bold text-lg shrink-0 w-12 text-left pt-0.5">30d</span>
                      <div className="min-w-0">
                        <h4 className="text-white font-bold text-sm">Flexible Payment Terms</h4>
                        <p className="text-xs text-gray-400 mt-0.5">All placement invoices have a 30-day payment schedule to integrate with your accounts payable workflows.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <span className="text-jway-green font-bold text-lg shrink-0 w-12 text-left pt-0.5">90d</span>
                      <div className="min-w-0">
                        <h4 className="text-white font-bold text-sm">90-Day Free Replacement</h4>
                        <p className="text-xs text-gray-400 mt-0.5">If the remote professional doesn't match your workflow or fails to meet deliverables in the first 90 days, we replace them at 100% free of charge.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value-Stacking Bonuses */}
              <div className="lg:col-span-6 space-y-6">
                <h3 className="text-2xl font-heading font-bold text-white mb-2">
                  Value-Stacking Bonuses
                </h3>
                <p className="text-gray-400 font-sans text-sm mb-6 leading-relaxed">
                  We don't just deliver talent—we stack the value to guarantee rapid client alignment. Acquire these bonuses included at no extra charge:
                </p>

                <div className="space-y-4">
                  {BONUSES.map((bonus, idx) => (
                    <div key={idx} className="flex gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="p-2.5 bg-jway-green/20 rounded-xl text-jway-green shrink-0 h-10 w-10 flex items-center justify-center font-heading font-extrabold text-sm">
                        +{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                          <h4 className="font-heading font-bold text-white text-sm min-w-0">{bonus.title}</h4>
                          <span className="px-2.5 py-0.5 bg-jway-green/20 text-jway-green text-[10px] font-bold rounded-full uppercase tracking-wider whitespace-nowrap shrink-0">
                            {bonus.value}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs font-sans mt-1 leading-relaxed">{bonus.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Lead Gen Booking Form */}
        <section ref={formRef} className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          {/* Backdrop lights */}
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-jway-green/5 blur-[90px] pointer-events-none"></div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Copy column */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-4 py-1.5 rounded-full inline-block mb-3">
                  Talent Sourcing
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-800 leading-tight">
                  Request Vetted <br />
                  <span className="text-jway-green">Tech Professionals</span>
                </h2>
                <p className="text-gray-600 font-sans text-sm leading-relaxed">
                  Provide your desired skills and team profile criteria. Our sourcing team evaluates active vetting streams and aligns matching profiles for interview presentation in <strong>48 hours</strong>.
                </p>

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-jway-green/15 text-jway-green font-bold text-xs flex items-center justify-center shrink-0">1</span>
                    <div>
                      <h4 className="font-heading font-bold text-gray-800 text-sm">Lock in Criteria</h4>
                      <p className="text-gray-500 text-xs font-sans mt-0.5">Let us know if you need full-time augmentation or highly specialized AI integrations.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-jway-green/15 text-jway-green font-bold text-xs flex items-center justify-center shrink-0">2</span>
                    <div>
                      <h4 className="font-heading font-bold text-gray-800 text-sm">Vetting Alignment</h4>
                      <p className="text-gray-500 text-xs font-sans mt-0.5">We review code submissions and verify architectural scores of our premium matching pools.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-jway-green/15 text-jway-green font-bold text-xs flex items-center justify-center shrink-0">3</span>
                    <div>
                      <h4 className="font-heading font-bold text-gray-800 text-sm">Risk-Free Launch</h4>
                      <p className="text-gray-500 text-xs font-sans mt-0.5">Receive formal resumes, book matches, and evaluate real deliverables with 0 upfront billing.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form glassmorphic card */}
              <div className="lg:col-span-7">
                <div className="relative bg-white/70 backdrop-blur-xl border border-white p-8 sm:p-10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-jway-green/5 to-transparent rounded-full blur-xl pointer-events-none"></div>

                  <div className="mb-8">
                    <h3 className="text-2xl font-heading font-bold text-gray-800">
                      Submit Talent Inquiry
                    </h3>
                    <p className="text-gray-500 text-xs font-sans mt-1">
                      Complete standard sourcing metadata. High-touch review specialists respond in 24 business hours.
                    </p>
                  </div>

                  {status === "success" ? (
                    <div className="py-12 text-center space-y-4 animate-fade-in">
                      <div className="w-16 h-16 bg-jway-green/20 text-jway-green rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-gray-800">
                        Inquiry Received!
                      </h3>
                      <p className="text-gray-600 font-sans text-sm max-w-sm mx-auto leading-relaxed">
                        Thank you for reaching out. A JWay relationship manager will contact you in the next <strong>24 business hours</strong> to align candidate matches.
                      </p>
                      <button
                        onClick={() => {
                          setStatus("idle");
                          setSelectedTalent("");
                          setFormData({
                            name: "",
                            email: "",
                            company: "",
                            phone: "",
                            requirements: ""
                          });
                          setErrors({});
                        }}
                        className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-semibold text-xs hover:bg-gray-800 transition-colors"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Selected Talent Indicator if linked */}
                      {selectedTalent && (
                        <div className="p-3 bg-jway-green/10 border border-jway-green/20 rounded-xl flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-700">
                            Linked Profile: <span className="text-jway-green">{selectedTalent}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTalent("");
                              setFormData((prev) => ({ ...prev, requirements: "" }));
                            }}
                            className="text-gray-400 hover:text-gray-600 font-bold"
                          >
                            Clear
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Jane Doe"
                            className={`w-full bg-white/70 border ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-jway-green focus:ring-jway-green"} focus:ring-1 rounded-xl px-4 py-3 text-sm focus:outline-none text-gray-800`}
                          />
                          {errors.name && <p className="text-xs font-semibold text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
                            Work Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="e.g. jane@company.com"
                            className={`w-full bg-white/70 border ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-jway-green focus:ring-jway-green"} focus:ring-1 rounded-xl px-4 py-3 text-sm focus:outline-none text-gray-800`}
                          />
                          {errors.email && <p className="text-xs font-semibold text-red-500 mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
                            Company Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="company"
                            required
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="e.g. Acme Corporation"
                            className={`w-full bg-white/70 border ${errors.company ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-jway-green focus:ring-jway-green"} focus:ring-1 rounded-xl px-4 py-3 text-sm focus:outline-none text-gray-800`}
                          />
                          {errors.company && <p className="text-xs font-semibold text-red-500 mt-1">{errors.company}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            maxLength={17}
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (XXX) XXX-XXXX"
                            className={`w-full bg-white/70 border ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-jway-green focus:ring-jway-green"} focus:ring-1 rounded-xl px-4 py-3 text-sm focus:outline-none text-gray-800`}
                          />
                          {errors.phone && <p className="text-xs font-semibold text-red-500 mt-1">{errors.phone}</p>}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
                          Skills or Sourcing Criteria Details
                        </label>
                        <textarea
                          name="requirements"
                          rows={3}
                          value={formData.requirements}
                          onChange={handleInputChange}
                          placeholder="List tech stacks (e.g. Next.js, Python, PyTorch) or specific task instructions..."
                          className="w-full bg-white/70 border border-gray-200 focus:border-jway-green focus:ring-1 focus:ring-jway-green rounded-xl px-4 py-3 text-sm focus:outline-none text-gray-800 resize-none"
                        ></textarea>
                      </div>

                      {status === "error" && (
                        <p className="text-xs font-bold text-red-500 flex items-center gap-1.5">
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                          </svg>
                          Please correct the validation errors in the fields above.
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full py-4 rounded-xl bg-jway-green text-white font-extrabold tracking-wide hover:bg-jway-green/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-jway-green/10 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
                      >
                        {status === "submitting" ? "Processing Inquiry..." : "Submit Risk-Free Inquiry"}
                      </button>
                    </form>
                  )}

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
