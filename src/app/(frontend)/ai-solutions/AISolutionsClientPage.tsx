"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMediaUrl } from "@/utils/media";
import LatestPosts from "@/components/LatestPosts";
import { MappedPost } from "@/lib/getContextualPosts";

// Metrics Data
const METRICS = [
  {
    value: "2,500+",
    label: "AI-Vetted Engineers",
    description: "Highly vetted ML practitioners, FDEs, and prompt engineering specialists ready for deployment.",
    icon: (
      <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="5" width="14" height="14" rx="2" ry="2" />
        <path d="M9 5V2M12 5V2M15 5V2M9 19v3M12 19v3M15 19v3M5 9H2M5 12H2M5 15H2M19 9h3M19 12h3M19 15h3" />
        <text x="12" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fontFamily="sans-serif" fill="currentColor" stroke="none">AI</text>
      </svg>
    )
  },
  {
    value: "72 Hours",
    label: "Average Alignment Speed",
    description: "Rapid mapping of dedicated AI specialists tailored to your specific framework and dataset requirements.",
    icon: (
      <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    )
  },
  {
    value: "100% Secure",
    label: "SOC2 & GDPR Frameworks",
    description: "Strict isolation protocols, automated VAPT, PII scrubbing, and secure on-premise pipeline setups.",
    icon: (
      <svg className="w-8 h-8 text-jway-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    )
  }
];

// Talent Cohort Data
const COHORTS = [
  {
    id: "fde",
    title: "Forward Deploy AI Engineers (FDE)",
    subtitle: "Production Integrators & Builders",
    description: "Our FDEs operate directly within your codebase. They construct high-speed API layers, orchestrate complex vector database pipelines, and integrate state-of-the-art LLMs into production-grade systems.",
    deliverables: [
      "Integration of retrieval-augmented generation (RAG) with milvus, pinecone, or pgvector.",
      "Building resilient agentic workflows using agents, Vercel Agent SDK, or Antigravity SDK.",
      "Optimizing model inference time, orchestration layers, and latency budgets.",
      "Setting up standard evaluations, tracing frameworks, and telemetry dashboard platforms."
    ],
    highlight: "Bridges the gap between research models and production applications.",
    badge: "Production Leaders",
    icon: (
      <svg className="w-10 h-10 text-jway-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    )
  },
  {
    id: "finetuning",
    title: "Model Training & Fine-Tuning Specialists",
    subtitle: "Custom Model Engineering Experts",
    description: "Deep learning professionals focused on maximizing your proprietary data values. From custom dataset synthesis to LoRA/QLoRA adjustments and RLHF alignment, they customize models for highly specific domains.",
    deliverables: [
      "Curating, clean-tagging, and preparing high-quality domain-specific datasets.",
      "Applying LoRA, QLoRA, and full parameter tuning to models (Llama, Mistral, Qwen).",
      "Reinforcement Learning from Human Feedback (RLHF) and DPO setup.",
      "Quantization and deployment optimization to minimize GPU host costs."
    ],
    highlight: "Saves up to 65% in token billing while improving domain precision.",
    badge: "ML Specialists",
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.25 0h8.25m0 0v-8.25m0 8.25v8.25" />
      </svg>
    )
  },
  {
    id: "domain",
    title: "AI-Powered Domain Experts",
    subtitle: "Operational Scale & Support Pioneers",
    description: "AI-equipped support specialists, QA testers, HR coordinators, and Virtual Assistants trained to utilize advanced prompt patterns, agent templates, and automation platforms to multiply operational outputs.",
    deliverables: [
      "AI-driven Quality Assurance utilizing automated script writing and regression agents.",
      "Customer & Tech support augmented by custom knowledge agents, resolving issues 3x faster.",
      "Talent vetting and candidate screening leveraging custom automated pipelines.",
      "Virtual Assistants capable of managing complex operations using AI scheduling tools."
    ],
    highlight: "Enhance team productivity and reduce operational response loops by over 70%.",
    badge: "Scale Pioneers",
    icon: (
      <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72" />
      </svg>
    )
  }
];

const ROLES = [
  { value: "FDE", label: "Forward Deploy AI Engineer (FDE)" },
  { value: "Fine-Tuning Specialist", label: "Model Fine-Tuning & training Specialist" },
  { value: "AI QA", label: "AI Quality Assurance Specialist" },
  { value: "AI Support", label: "AI Support & Tech Agent" },
  { value: "AI VA", label: "AI Virtual Assistant" }
];

const ENGAGEMENT_MODELS = [
  { value: "Dedicated Staff Augmentation", label: "Dedicated Staff Augmentation (Flexible Dedicated Team)" },
  { value: "Direct Hire placement", label: "Direct Hire & Placement Services" },
  { value: "Project-Based Cohort", label: "Project-Based AI Delivery Team" }
];

interface AISolutionsClientPageProps {
  posts: MappedPost[];
}

export default function AISolutionsClientPage({ posts }: AISolutionsClientPageProps) {
  const [activeTab, setActiveTab] = useState("fde");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    role: "FDE",
    engagementModel: "Dedicated Staff Augmentation",
    requirements: ""
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    requirements?: string;
  }>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      const sanitized = value.replace(/[^\p{L}\s'’\-.,]/gu, "");
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      if (errors.name) {
        setErrors((prev) => ({ ...prev, name: undefined }));
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
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid business email address.";
    }

    // Company validation
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required.";
    }

    // Phone validation (optional)
    if (formData.phone.trim()) {
      const phoneRegex = /^[+0-9\s()-.]{7,20}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = "Please enter a valid phone number (7-20 digits).";
      }
    }

    // Requirements validation (strictly required, >=10 characters)
    if (!formData.requirements.trim()) {
      newErrors.requirements = "Scope and technical requirements are required.";
    } else if (formData.requirements.trim().length < 10) {
      newErrors.requirements = "Please provide more details (at least 10 characters).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("submitting");
    // Simulate contact form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
  };

  const selectedCohort = COHORTS.find((c) => c.id === activeTab) || COHORTS[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFB] text-[#2e2f31] font-sans">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          className="relative min-h-[85vh] flex items-center py-24 px-4 sm:px-6 lg:px-8 bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url('${getMediaUrl('/about/About-banner.png')}')` }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[1px]"></div>
          
          <div className="relative max-w-7xl mx-auto z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="text-jway-green font-sans font-bold text-xs tracking-widest uppercase bg-[#A8C028]/15 px-4 py-1.5 rounded-full border border-jway-green/20 inline-block mb-3">
                Elite AI Engineering Talent
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-extrabold text-white leading-tight">
                Production-Grade <br />
                <span className="text-jway-green">AI Talent &amp; Execution</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 font-sans max-w-2xl leading-relaxed">
                Empower your systems with elite AI professionals. From Forward Deploy AI Engineers (FDEs) deploying architectures directly, to deep specialists fine-tuning models and AI-augmented support personnel. Complete with security compliance and MLOps maintenance.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#ai-talent-form"
                  className="px-8 py-4 rounded-full bg-jway-green text-white font-bold hover:bg-jway-green/90 transition-all shadow-lg hover:shadow-jway-green/20"
                >
                  Acquire AI Talents
                </a>
                <a
                  href="#talent-cohorts"
                  className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/10 transition-all backdrop-blur-sm"
                >
                  Explore Capabilities
                </a>
              </div>
            </div>

            {/* Hero Right Interactive Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jway-green/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">jway_fde_cluster.log</span>
                </div>
                
                <div className="space-y-4 font-mono text-[13px]">
                  <p className="text-gray-500"># Initializing sequence...</p>
                  <p className="text-jway-green">&gt; Loading vector storage... OK (pgvector)</p>
                  <p className="text-blue-400">&gt; Building model fallback chain... [LLaMA-3 70B &lt;-&gt; Claude-3]</p>
                  <p className="text-purple-400">&gt; Securing pipelines with PII filters... ACTIVE</p>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-jway-green rounded-full animate-pulse" style={{ width: "85%" }}></div>
                  </div>
                  <p className="text-emerald-400 font-bold">&gt; DEPLOYED SUCCESSFULLY to production system.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics Section */}
        <section className="bg-[#F6F7EF] py-16 border-y border-gray-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {METRICS.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-start gap-5"
                >
                  <div className="p-3 bg-jway-green/10 rounded-xl shrink-0">
                    {metric.icon}
                  </div>
                  <div>
                    <h4 className="text-3xl font-extrabold text-[#2e2f31] tracking-tight">
                      {metric.value}
                    </h4>
                    <p className="text-base font-bold text-jway-green mt-1">
                      {metric.label}
                    </p>
                    <p className="text-gray-600 font-sans text-sm mt-2 leading-relaxed">
                      {metric.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Talent Cohorts Grid Section */}
        <section id="talent-cohorts" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
                Professional AI Cohorts
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading font-bold text-[#2e2f31]">
                Vetted Experts for <span className="text-jway-green">Every Stage</span>
              </h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed pt-2">
                We equip our professionals with advanced frameworks, pre-configured workspaces, and ongoing technical mentoring to solve real engineering bottlenecks immediately.
              </p>
            </div>

            {/* Interactive Cohort Switcher */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
              
              {/* Sidebar switch triggers */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {COHORTS.map((cohort) => {
                  const isActive = cohort.id === activeTab;
                  return (
                    <button
                      key={cohort.id}
                      onClick={() => setActiveTab(cohort.id)}
                      className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 group cursor-pointer ${
                        isActive
                          ? "bg-jway-green text-white border-jway-green shadow-xl shadow-jway-green/20 scale-[1.02]"
                          : "bg-slate-50 border-gray-100 hover:border-gray-200 hover:bg-slate-100 text-gray-700"
                      }`}
                    >
                      <div className="flex-grow">
                        <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                          isActive ? "text-white/95" : "text-gray-400 group-hover:text-jway-green/80"
                        }`}>
                          {cohort.badge}
                        </span>
                        <h3 className={`font-heading font-bold text-[16px] mt-0.5 leading-snug ${
                          isActive ? "text-white" : "text-gray-800"
                        }`}>
                          {cohort.title}
                        </h3>
                      </div>
                      <svg className={`w-5 h-5 shrink-0 transition-transform ${
                        isActive ? "text-white translate-x-1" : "text-gray-400 group-hover:translate-x-1"
                      }`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  );
                })}
              </div>

              {/* Viewport for Active Cohort details */}
              <div className="lg:col-span-8">
                <div className="bg-white border border-gray-100 p-8 sm:p-10 rounded-3xl shadow-xl shadow-gray-100/40 relative overflow-hidden transition-all duration-500">
                  <div className="absolute right-[-30px] bottom-[-30px] text-gray-100 pointer-events-none font-bold text-[130px] select-none uppercase tracking-widest leading-none">
                    AI
                  </div>

                  <span className="px-3 py-1 text-xs font-bold bg-jway-green/10 text-jway-green rounded-full border border-jway-green/20 uppercase tracking-wide">
                    {selectedCohort.badge}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#2e2f31] mt-4">
                    {selectedCohort.title}
                  </h3>
                  <p className="text-gray-400 text-sm font-mono mt-1 block">
                    {selectedCohort.subtitle}
                  </p>
                  <p className="text-gray-600 font-sans leading-relaxed text-[16px] mt-4 mb-6">
                    {selectedCohort.description}
                  </p>

                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="font-heading font-bold text-sm text-gray-700 uppercase tracking-wider mb-4">
                      Key Deliverables &amp; Competencies
                    </h4>
                    <ul className="space-y-3">
                      {selectedCohort.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 font-sans">
                          <svg className="w-5 h-5 text-jway-green shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact callout */}
                  <div className="mt-8 p-4 bg-jway-green/10 border border-jway-green/25 rounded-xl">
                    <p className="text-xs sm:text-sm text-gray-700">
                      <strong>Operational Impact:</strong> {selectedCohort.highlight}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Secure MLOps & Production Execution Section */}
        <section className="py-24 bg-[#F6F7EF] border-y border-gray-200/80 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#808080_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Information Blocks */}
              <div className="lg:col-span-6 space-y-6">
                <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
                  Deployment, Maintenance &amp; Security
                </span>
                <h2 className="text-3xl sm:text-5xl font-heading font-bold text-[#2e2f31]">
                  Safe Production <br />
                  <span className="text-jway-green">Integration &amp; Care</span>
                </h2>
                <p className="text-gray-600 font-sans text-base sm:text-lg leading-relaxed">
                  Integrating AI models requires robust infrastructure. JWay ensures that deployed teams enforce strict compliance, maintenance monitoring, and cybersecurity safeguards.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-slate-800 text-base">VAPT &amp; Red-Teaming</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">Regular vulnerability assessments and penetration testing of APIs and prompts to prevent direct jailbreaking or leakage.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-slate-800 text-base">PII Scrubbing</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">Setting up secure token proxy layers to isolate personal data before payloads are sent to third-party endpoints.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-slate-800 text-base">Performance Auditing</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">Constant cost tracking, cache optimization strategies, and latency minimization layers to protect budgets.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-slate-800 text-base">Model Monitoring</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">Telemetry tracking for semantic drift, hallucination detection, and real-time fallback routing mechanisms.</p>
                  </div>
                </div>
              </div>

              {/* Graphic Representation */}
              <div className="lg:col-span-6">
                <div className="bg-white border border-gray-100 p-8 sm:p-10 rounded-3xl shadow-xl relative">
                  <h3 className="text-slate-800 font-heading font-bold text-lg mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-jway-green animate-pulse"></span>
                    JWay Secure MLOps Framework
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex gap-4 items-start relative pb-6 border-l-2 border-gray-100 pl-6 ml-3">
                      <div className="absolute left-[-11px] top-0 w-5 h-5 rounded-full bg-jway-green flex items-center justify-center text-[10px] text-white font-extrabold">1</div>
                      <div>
                        <h4 className="text-sm font-heading font-bold text-slate-800">Ingest &amp; Scrub Layer</h4>
                        <p className="text-xs text-gray-500 mt-1">Strip customer PII and sanitize inputs prior to tokenization.</p>
                      </div>
                    </div>
                    
                    {/* Step 2 */}
                    <div className="flex gap-4 items-start relative pb-6 border-l-2 border-gray-100 pl-6 ml-3">
                      <div className="absolute left-[-11px] top-0 w-5 h-5 rounded-full bg-jway-green flex items-center justify-center text-[10px] text-white font-extrabold">2</div>
                      <div>
                        <h4 className="text-sm font-heading font-bold text-slate-800">Semantic Cache &amp; Routing</h4>
                        <p className="text-xs text-gray-500 mt-1">Pre-cache frequent matches to slash latency and external API cost metrics.</p>
                      </div>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="flex gap-4 items-start relative pl-6 ml-3">
                      <div className="absolute left-[-11px] top-0 w-5 h-5 rounded-full bg-jway-green flex items-center justify-center text-[10px] text-white font-extrabold">3</div>
                      <div>
                        <h4 className="text-sm font-heading font-bold text-slate-800">Evaluation &amp; Tracing</h4>
                        <p className="text-xs text-gray-500 mt-1">Log traces to audit semantic drift and detect output hallucinations.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
        {/* Talent Request Form */}
        <section id="ai-talent-form" className="py-24 bg-[#FAFAFB] border-t border-gray-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left description */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
                  Deploy Talent
                </span>
                <h2 className="text-3xl sm:text-5xl font-heading font-bold text-[#2e2f31] leading-tight">
                  Initiate Your <br />
                  <span className="text-jway-green">AI Talent Pipeline</span>
                </h2>
                <p className="text-gray-600 font-sans text-base leading-relaxed">
                  Partner with the Silicon Valley provider that delivers fully trained, production-capable AI professionals. Submit your criteria and our team will present vetted, qualified candidates in as fast as <strong>72 hours</strong>.
                </p>

                <div className="space-y-4 pt-6 border-t border-gray-200 font-sans">
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-jway-green/10 text-jway-green font-bold text-sm flex items-center justify-center shrink-0">1</span>
                    <div>
                      <h4 className="font-heading font-bold text-slate-800 text-sm">Specification Analysis</h4>
                      <p className="text-gray-500 text-xs mt-0.5">We review your model stack requirements and database integration targets.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-jway-green/10 text-jway-green font-bold text-sm flex items-center justify-center shrink-0">2</span>
                    <div>
                      <h4 className="font-heading font-bold text-slate-800 text-sm">Targeted Mapping</h4>
                      <p className="text-gray-500 text-xs mt-0.5">We match developers with correct domain profiles and run active code checks.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-jway-green/10 text-jway-green font-bold text-sm flex items-center justify-center shrink-0">3</span>
                    <div>
                      <h4 className="font-heading font-bold text-slate-800 text-sm">Secure Placement</h4>
                      <p className="text-gray-500 text-xs mt-0.5">Onboard candidates instantly while JWay manages billing, compliance, and systems.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form box */}
              <div className="lg:col-span-7">
                <div className="bg-white border border-gray-100 p-8 sm:p-10 rounded-3xl shadow-2xl relative">
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-heading font-bold text-slate-800">
                      Request AI Engineering Talent
                    </h3>
                    <p className="text-gray-500 text-xs font-sans mt-1">
                      Provide details about your AI project requirements. Our engineering coordinators will reach out shortly.
                    </p>
                  </div>

                  {status === "success" ? (
                     <div className="py-12 text-center space-y-4 animate-fade-in">
                      <div className="w-16 h-16 bg-jway-green/20 text-jway-green rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-[#2e2f31]">
                        AI Request Logged
                      </h3>
                      <p className="text-gray-600 font-sans text-sm max-w-sm mx-auto leading-relaxed">
                        We have successfully cataloged your requirements. An AI Sourcing Coordinator from our team will contact you at your business email within **24 business hours**.
                      </p>
                      <button
                        onClick={() => {
                          setStatus("idle");
                          setFormData({
                            name: "",
                            email: "",
                            company: "",
                            phone: "",
                            role: "FDE",
                            engagementModel: "Dedicated Staff Augmentation",
                            requirements: ""
                          });
                          setErrors({});
                        }}
                        className="px-6 py-2.5 rounded-full bg-[#2e2f31] text-white font-bold text-xs hover:bg-[#3d3e41] transition-colors cursor-pointer"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                      
                      {/* Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Liam Vance"
                            className={`w-full bg-slate-50 border focus:border-jway-green focus:ring-2 focus:ring-jway-green/20 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-slate-800 placeholder-gray-400 ${
                              errors.name ? "border-red-500" : "border-gray-200"
                            }`}
                          />
                          {errors.name && (
                            <span className="text-red-500 block text-xs mt-1 font-semibold">{errors.name}</span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                            Business Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="e.g. liam@innovate.ai"
                            className={`w-full bg-slate-50 border focus:border-jway-green focus:ring-2 focus:ring-jway-green/20 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-slate-800 placeholder-gray-400 ${
                              errors.email ? "border-red-500" : "border-gray-200"
                            }`}
                          />
                          {errors.email && (
                            <span className="text-red-500 block text-xs mt-1 font-semibold">{errors.email}</span>
                          )}
                        </div>
                      </div>

                      {/* Company & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                            Company Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="company"
                            required
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="e.g. Cognitive Systems"
                            className={`w-full bg-slate-50 border focus:border-jway-green focus:ring-2 focus:ring-jway-green/20 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-slate-800 placeholder-gray-400 ${
                              errors.company ? "border-red-500" : "border-gray-200"
                            }`}
                          />
                          {errors.company && (
                            <span className="text-red-500 block text-xs mt-1 font-semibold">{errors.company}</span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="e.g. +1 415-555-0182"
                            className={`w-full bg-slate-50 border focus:border-jway-green focus:ring-2 focus:ring-jway-green/20 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-slate-800 placeholder-gray-400 ${
                              errors.phone ? "border-red-500" : "border-gray-200"
                            }`}
                          />
                          {errors.phone && (
                            <span className="text-red-500 block text-xs mt-1 font-semibold">{errors.phone}</span>
                          )}
                        </div>
                      </div>

                      {/* Role & Engagement */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                            Required AI Profile <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name="role"
                              value={formData.role}
                              onChange={handleInputChange}
                              className="w-full appearance-none bg-slate-50 border border-gray-200 focus:border-jway-green focus:ring-2 focus:ring-jway-green/20 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none text-slate-800 cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap"
                            >
                              {ROLES.map((r) => (
                                <option key={r.value} value={r.value}>
                                  {r.label}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                            Engagement Framework <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name="engagementModel"
                              value={formData.engagementModel}
                              onChange={handleInputChange}
                              className="w-full appearance-none bg-slate-50 border border-gray-200 focus:border-jway-green focus:ring-2 focus:ring-jway-green/20 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none text-slate-800 cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap"
                            >
                              {ENGAGEMENT_MODELS.map((em) => (
                                <option key={em.value} value={em.value}>
                                  {em.label}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                          Scope &amp; Technical Requirements <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="requirements"
                          rows={3}
                          required
                          value={formData.requirements}
                          onChange={handleInputChange}
                          placeholder="Describe specific model targets, language stacks, database targets, or timeline milestones..."
                          className={`w-full bg-slate-50 border focus:border-jway-green focus:ring-2 focus:ring-jway-green/20 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-slate-800 placeholder-gray-400 resize-none ${
                            errors.requirements ? "border-red-500" : "border-gray-200"
                          }`}
                        ></textarea>
                        {errors.requirements && (
                          <span className="text-red-500 block text-xs mt-1 font-semibold">{errors.requirements}</span>
                        )}
                      </div>

                      {status === "error" && (
                        <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                          Please complete all required fields marked with an asterisk (*).
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full py-4 rounded-xl bg-jway-green text-white font-extrabold tracking-wide hover:bg-jway-green/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] cursor-pointer shadow-md hover:shadow-lg"
                      >
                        {status === "submitting" ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Pipeline request...
                          </>
                        ) : (
                          "Initiate Talent Pipeline"
                        )}
                      </button>
                    </form>
                  )}

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Latest contextual blog posts */}
        <div className="bg-white border-t border-gray-100 py-12">
          <LatestPosts posts={posts} />
        </div>

        {/* FAQ Section */}
        <section className="py-24 bg-[#F6F7EF] border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">FAQ</span>
              <h2 className="text-3xl font-heading font-bold text-[#2e2f31]">
                Frequently Asked <span className="text-jway-green">Questions</span>
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "What makes Forward Deploy AI Engineers (FDEs) unique?",
                  a: "Our FDEs are software engineering veterans trained explicitly in ML implementation. Instead of just creating models in isolation, they build pipelines directly into your production systems, handle vector databases, manage RAG performance, and ensure secure deployment."
                },
                {
                  q: "How does JWay secure enterprise databases and protect data privacy?",
                  a: "All deployed talent follows strict compliance practices. We build custom data proxy layers that automatically redact and scrub PII before passing tokens to APIs. We also audit endpoints using regular Red-Teaming, prompt injection defense reviews, and system level isolation."
                },
                {
                  q: "What domain training do your HR, QA, and VA experts receive?",
                  a: "Our domain experts undergo intensive workshops on prompt patterns, automated regression testing workflows, resume processing pipelines, and tools like custom search agents and scheduling engines. They operate at multiple times the output capacity of traditional professionals."
                },
                {
                  q: "What is the typical ramp time to deploy an AI specialist?",
                  a: "We pre-vet all ML engineers and FDEs in our talent pools. Once requirements are verified, we can present matching candidates in 72 hours, with onboarding completed in as fast as 1-2 weeks."
                }
              ].map((faq, idx) => (
                <div key={idx} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-md">
                  <h4 className="font-heading font-bold text-[#2e2f31] text-base flex items-start gap-3">
                    <span className="text-jway-green font-extrabold">Q.</span>
                    {faq.q}
                  </h4>
                  <p className="text-gray-600 font-sans text-sm mt-3 leading-relaxed pl-6 border-l border-jway-green/30">
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
