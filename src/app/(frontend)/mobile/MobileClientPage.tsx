"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LatestPosts from "@/components/LatestPosts";
import { MappedPost } from "@/lib/getContextualPosts";

// Key Stats
const STATS = [
  { label: "Successful App Launches", value: "100+" },
  { label: "Single-Codebase Savings", value: "Up to 50%" },
  { label: "Cloud Uptime SLA", value: "99.99%" },
  { label: "VAPT Security Audits", value: "100%" },
];

// Interactive Service Types
interface MobileService {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  bulletPoints: string[];
  techStack: string[];
  icon: React.ReactNode;
  accentBg: string;
  codeSnippet?: string;
  codeLanguage?: string;
}

const SERVICES_DATA: MobileService[] = [
  {
    id: "flutter",
    title: "Flutter Development",
    subtitle: "High-Performance Cross-Platform Applications",
    tagline: "Single codebase, native speed, massive cost reduction.",
    description: "Build beautiful, natively compiled applications for mobile (iOS and Android), web, and desktop from a single codebase. JWay leverages Flutter's revolutionary rendering engine to deliver fluid user experiences, slashing development overhead and time-to-market.",
    bulletPoints: [
      "Up to 50% reduction in development costs and engineering hours.",
      "Faster turnover and agile release cycles with hot-reload features.",
      "Pixel-perfect UI design that looks and feels native on both iOS and Android.",
      "Consistent business logic and simplified future maintenance workflows."
    ],
    techStack: ["Flutter", "Dart", "Provider / BLoC", "Firebase", "SQLite", "GraphQL"],
    accentBg: "from-blue-500/10 to-emerald-500/10",
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    codeSnippet: `import 'package:flutter/material.dart';

void main() => runApp(const JWayApp());

class JWayApp extends StatelessWidget {
  const JWayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'JWay Mobile Solutions',
      theme: ThemeData(primaryColor: const Color(0xFFA8C028)),
      home: const Center(child: Text('Natively Nurtured.')),
    );
  }
}`,
    codeLanguage: "dart"
  },
  {
    id: "native",
    title: "Native iOS & Android",
    subtitle: "No-Compromise Platform Excellence",
    tagline: "Unleash the full potential of Apple and Google hardware capabilities.",
    description: "For apps requiring complex background processing, low-level hardware access, advanced AR/VR, or heavy on-device processing, our native Swift (iOS) and Kotlin (Android) solutions offer unparalleled system performance, deep OS integration, and compliance with the latest SDKs.",
    bulletPoints: [
      "Premium, ultra-responsive UI scrolling at a locked 120Hz refresh rate.",
      "Direct integration with CoreBluetooth, NFC, HealthKit, and Google Fit.",
      "Custom widgets, dark mode adaptation, and OS-specific interactive features.",
      "Absolute compliance with Apple Human Interface and Google Material Design."
    ],
    techStack: ["Swift", "SwiftUI", "Kotlin", "Jetpack Compose", "CoreData", "Room DB"],
    accentBg: "from-amber-500/10 to-orange-500/10",
    icon: (
      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    codeSnippet: `import SwiftUI

struct JWayAppView: View {
    var body: some View {
        VStack {
            Image(systemName: "iphone.radiowaves.left.and.right")
                .foregroundColor(Color(hex: "A8C028"))
            Text("Native Performance. Built for Tomorrow.")
        }
    }
}`,
    codeLanguage: "swift"
  },
  {
    id: "cloud",
    title: "Cloud System Architecture",
    subtitle: "Enterprise-Scale Cloud Foundations",
    tagline: "Resilient infrastructure built for millions of concurrent sessions.",
    description: "A stellar mobile front-end requires an bulletproof backend infrastructure. JWay designs and provisions highly scalable, cost-optimized cloud architectures (AWS, Google Cloud, Azure) that adapt dynamically to traffic spikes and guarantee maximum uptime.",
    bulletPoints: [
      "Auto-scaling compute instances (AWS EC2/ECS, GCP GKE) with load balancers.",
      "Secure global Content Delivery Networks (CDNs) for static and dynamic assets.",
      "Database clusters with active replicas and automated point-in-time recovery.",
      "Infrastructure as Code (IaC) deployment pipelines with Terraform."
    ],
    techStack: ["AWS", "Google Cloud", "Microsoft Azure", "Terraform", "Kubernetes", "Docker"],
    accentBg: "from-purple-500/10 to-indigo-500/10",
    icon: (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    codeSnippet: `resource "aws_ecs_cluster" "jway_cluster" {
  name = "jway-mobile-backend-prod"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}`,
    codeLanguage: "hcl"
  },
  {
    id: "backend",
    title: "Backend Development",
    subtitle: "Secure APIs & Data Synchronization",
    tagline: "Microservices & APIs designed for lightning-fast synchronization.",
    description: "We build secure, low-latency APIs and robust microservices that drive real-time data sync, secure user authentications, and complex background workflows, maintaining high speed even on slower mobile cellular networks.",
    bulletPoints: [
      "High-performance RESTful and GraphQL API design with clean documentation.",
      "Serverless computing architectures (AWS Lambda, Cloud Functions) to cut costs.",
      "Advanced WebSockets setups for instant messaging and live push notifications.",
      "Encrypted token-based authentications (JWT, OAuth 2.0, multi-factor auth)."
    ],
    techStack: ["Node.js", "Python / Django", "Go", "PostgreSQL", "Redis", "GraphQL API"],
    accentBg: "from-teal-500/10 to-cyan-500/10",
    icon: (
      <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    codeSnippet: `const express = require('express');
const app = express();

app.get('/api/v1/mobile/sync', async (req, res) => {
  const syncData = await getRealtimeMobileSync(req.user.id);
  res.status(200).json({ success: true, data: syncData });
});`,
    codeLanguage: "javascript"
  },
  {
    id: "vapt",
    title: "VAPT Security Services",
    subtitle: "Hardened Security for Peace of Mind",
    tagline: "Vulnerability assessment and penetration testing to guarantee safety.",
    description: "A single mobile vulnerability can compromise millions of users and cost millions in compliance penalties. JWay delivers robust, comprehensive VAPT audits, deep static/dynamic code analysis, and live penetration testing simulated by ethical security experts.",
    bulletPoints: [
      "Deep audits conforming to OWASP Mobile Top 10 standards.",
      "Dynamic application security testing (DAST) on live simulated networks.",
      "Thorough cryptographic review of local data storage (Keychain, SharedPrefs).",
      "Rigorous compliance reporting (HIPAA, PCI-DSS, GDPR, ISO 27001)."
    ],
    techStack: ["OWASP Mobile 10", "Static Analysis (SAST)", "Dynamic Testing", "SSL Pinning", "Penetration Testing"],
    accentBg: "from-rose-500/10 to-red-500/10",
    icon: (
      <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    codeSnippet: `### JWAY SECURITY AUDIT REPORT
[STATUS] CRYPTOGRAPHIC INTEGRITY: PASSED
[STATUS] SSL PINNING CONFIGURATION: ENFORCED
[STATUS] OWASP MOBILE TOP 10 SANITIZATION: VERIFIED
[ACTION] Penetration testing completed on Android & iOS package.`,
    codeLanguage: "text"
  }
];

// Interactive Mobile Lifecycle Steps
const LIFECYCLE_STEPS = [
  {
    step: "01",
    title: "Discovery & User Mapping",
    desc: "We research your user profiles, map out clean navigation wireframes, define performance objectives, and align technology choices.",
    badge: "Strategic Blueprint"
  },
  {
    step: "02",
    title: "Architectural Planning & IaC",
    desc: "Our cloud team designs the server and security layout, planning APIs, serverless infrastructure, load testing limits, and security frameworks.",
    badge: "Cloud Layout"
  },
  {
    step: "03",
    title: "High-Fidelity Code Execution",
    desc: "NATIVE or FLUTTER developers build the visual flows. Clean React-like reactivity, offline database sync, and sleek animations.",
    badge: "Agile Sprints"
  },
  {
    step: "04",
    title: "VAPT Hardening",
    desc: "Our penetration specialists launch simulated digital attacks. We check certificates, API protection layers, code injections, and patch gaps.",
    badge: "Security Fortification"
  },
  {
    step: "05",
    title: "Store Audits & Launch",
    desc: "We shepherd the applications through the rigorous App Store and Google Play reviews, optimizing assets, search visibility, and privacy rules.",
    badge: "Production Release"
  },
  {
    step: "06",
    title: "Continuous Maintenance",
    desc: "We deliver continuous support, monitoring crash reports, optimizing performance metrics, and updating libraries for upcoming OS releases.",
    badge: "Adaptive Evolution"
  }
];

interface MobileClientPageProps {
  posts: MappedPost[];
}

export default function MobileClientPage({ posts }: MobileClientPageProps) {
  const [activeTab, setActiveTab] = useState("flutter");
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", projectType: "Flutter Development", details: "" });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    details?: string;
  }>({});

  const activeService = SERVICES_DATA.find((s) => s.id === activeTab) || SERVICES_DATA[0];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleFormSubmit = async (e: React.FormEvent) => {
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

    // Details validation
    if (!formData.details.trim()) {
      newErrors.details = "Requirements details are required.";
    } else if (formData.details.trim().length < 10) {
      newErrors.details = "Please provide more details (at least 10 characters).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setConsultationSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFB] text-[#2e2f31] transition-colors duration-300">
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-cover bg-center overflow-hidden bg-slate-900">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-[#A8C028]/10 opacity-90 z-0"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#A8C028]/15 blur-3xl animate-pulse pointer-events-none"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 w-full">
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#A8C028]/10 text-[#A8C028] border border-[#A8C028]/25">
                Premium Mobile Solutions
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
                Engaging Mobile Apps. <br />
                <span className="text-[#A8C028]">Native Speed & Scale.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-sans max-w-2xl leading-relaxed">
                JWay Group engineers world-class mobile ecosystems. From cross-platform cost efficiency with <strong>Flutter</strong> to native iOS & Android masterpieces, backed by hardened cloud backend layers and state-of-the-art <strong>VAPT security assessments</strong>.
              </p>
              
              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="#services-interactive"
                  className="px-8 py-3.5 rounded-full bg-[#A8C028] text-slate-950 font-bold hover:bg-[#A8C028]/95 transition-all text-center shadow-lg hover:shadow-[#A8C028]/20 transform hover:-translate-y-0.5"
                >
                  Explore Capabilities
                </Link>
                <Link
                  href="#contact-form"
                  className="px-8 py-3.5 rounded-full bg-slate-800/80 text-white font-bold hover:bg-slate-800 transition-all text-center border border-slate-700/60 backdrop-blur-sm"
                >
                  Request Architecture Call
                </Link>
              </div>
            </div>

            {/* Hero Right Visual Column - Modern Smartphone Wireframe Grid */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-80 h-[560px] bg-slate-950 rounded-[40px] p-3 border-4 border-slate-800 shadow-2xl overflow-hidden group">
                {/* Phone Notch/Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>

                {/* Phone screen elements */}
                <div className="h-full w-full bg-slate-900 rounded-[32px] overflow-hidden p-6 flex flex-col justify-between relative">
                  {/* Decorative glowing gradient inside screen */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#A8C028]/10 blur-xl rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-xl rounded-full"></div>

                  <div className="mt-8 flex justify-between items-center z-10">
                    <span className="text-xs font-semibold text-[#A8C028]">JWay Hub</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">PROD-v2.8</span>
                  </div>

                  {/* Inside card demo mockups */}
                  <div className="space-y-4 my-auto z-10">
                    <div className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-300">Active Architecture</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      </div>
                      <div className="text-lg font-bold text-white">Flutter Engine</div>
                      <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#A8C028] h-full w-[85%]"></div>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400">
                        <span>Speed: Native</span>
                        <span>Performance: 99.8%</span>
                      </div>
                    </div>

                    <div className="bg-slate-800/40 backdrop-blur border border-slate-700/30 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-rose-500/15 text-rose-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">VAPT Shield</div>
                          <div className="text-[9px] text-slate-400">Deep Audit Passed</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#A8C028] bg-[#A8C028]/10 px-2 py-0.5 rounded">Active</span>
                    </div>

                    <div className="bg-slate-800/40 backdrop-blur border border-slate-700/30 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-purple-500/15 text-purple-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">Cloud Sync</div>
                          <div className="text-[9px] text-slate-400">Multi-Region Active</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">AWS</span>
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-slate-500 z-10">
                    JWay Group Inc. © 2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KEY METRICS GRID */}
        <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-8 sm:p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center space-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#A8C028] tracking-tight whitespace-nowrap">{stat.value}</div>
                <div className="text-xs sm:text-sm font-medium text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES INTERACTIVE SECTION */}
        <section id="services-interactive" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#A8C028] font-bold text-sm tracking-wider uppercase bg-[#A8C028]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Comprehensive Offerings
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight">
              Interactive <span className="text-[#A8C028]">Mobile Capabilities</span>
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed font-sans">
              Click through our specialized modules to inspect our technologies, execution paths, code structures, and architectural benefits.
            </p>
          </div>

          {/* Interactive tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Tab Buttons Side */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-thin">
              {SERVICES_DATA.map((service) => {
                const isSelected = service.id === activeTab;
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveTab(service.id)}
                    className={`flex items-center gap-4 text-left px-5 py-4 rounded-2xl border transition-all duration-300 w-full min-w-[260px] lg:min-w-0 ${
                      isSelected
                        ? "bg-slate-50 border-[#A8C028] shadow-md translate-x-1"
                        : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${isSelected ? "bg-[#A8C028]/10" : "bg-slate-50"}`}>
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base leading-snug break-words">{service.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{service.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tab Details Side */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 transition-all duration-300">
              <div className={`bg-gradient-to-r ${activeService.accentBg} rounded-2xl p-6 sm:p-8 border border-white/40 relative overflow-hidden`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <span className="text-[#A8C028] font-bold text-xs uppercase tracking-wider block">Service Highlight</span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-heading mt-1">{activeService.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeService.techStack.map((tech) => (
                      <span key={tech} className="bg-slate-900/80 text-white text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full border border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[#A8C028] text-sm sm:text-base font-semibold leading-normal mb-3 font-heading">
                  “{activeService.tagline}”
                </p>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans mb-6">
                  {activeService.description}
                </p>

                {/* Key Benefits Bullet Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeService.bulletPoints.map((bp, index) => (
                    <div key={index} className="flex gap-2.5 items-start">
                      <div className="p-1 rounded bg-[#A8C028]/10 text-[#A8C028] mt-0.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-normal">{bp}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Code / Stack Inspection */}
              {activeService.codeSnippet && (
                <div className="mt-6 rounded-2xl bg-slate-950 p-6 border border-slate-800 relative overflow-hidden">
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-3.5 border-b border-slate-900 pb-3">
                    <span className="font-mono">Active Stack Blueprint (JWay Standard)</span>
                    <span className="uppercase text-[10px] font-bold text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                      {activeService.codeLanguage}
                    </span>
                  </div>
                  <pre className="text-xs sm:text-[13px] text-slate-300 font-mono overflow-x-auto whitespace-pre leading-relaxed max-h-56">
                    <code>{activeService.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECURITY & VAPT HARDENING HUB */}
        <section className="bg-slate-950 text-white py-24 relative overflow-hidden">
          {/* Subtle overlay grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Security info */}
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/25">
                  VAPT Audits & Hardening
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-white">
                  Zero Trust Mobile Safety. <br />
                  <span className="text-rose-400">Hardened Penetration Auditing.</span>
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  We don&apos;t just build responsive interfaces — we safeguard your intellectual assets and customer data. Every JWay mobile project goes through rigorous <strong>Vulnerability Assessment and Penetration Testing (VAPT)</strong> audits by our internal cybersecurity divisions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      OWASP Mobile Top 10
                    </h4>
                    <p className="text-xs text-slate-400 leading-normal">
                      We check package configurations for reverse engineering, code injections, insecure communication channels, and local cache leaks.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      Cryptographic Audits
                    </h4>
                    <p className="text-xs text-slate-400 leading-normal">
                      Every secure parameter is protected using RSA/AES military-grade encryption inside Keychain or Android Secure Shared Preferences.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      API Protection & Tokens
                    </h4>
                    <p className="text-xs text-slate-400 leading-normal">
                      SSL pinning configurations are implemented to completely thwart Man-in-the-Middle (MitM) sniffing attempts.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      Regulatory Standards
                    </h4>
                    <p className="text-xs text-slate-400 leading-normal">
                      We conform perfectly to international and regional regulations, satisfying HIPAA, PCI-DSS, GDPR, and localized criteria.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual dashboard mockup */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
                  <div className="absolute -top-3 -left-3 bg-rose-500 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md animate-bounce">
                    Shield Engaged
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                      <span className="font-bold text-sm">VAPT Live Audit Console</span>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">STANDBY</span>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-xl space-y-2.5 border border-slate-800">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Dynamic Testing Analysis</span>
                        <span className="text-emerald-400 font-bold">100% SECURE</span>
                      </div>
                      <div className="h-1.5 bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 w-full"></div>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl space-y-2.5 border border-slate-800">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Cryptographic Key Scans</span>
                        <span className="text-emerald-400 font-bold">PASS</span>
                      </div>
                      <div className="h-1.5 bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 w-full"></div>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl space-y-2.5 border border-slate-800">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">SSL Certificate Pinning</span>
                        <span className="text-[#A8C028] font-bold">ENFORCED</span>
                      </div>
                      <div className="h-1.5 bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-[#A8C028] w-full"></div>
                      </div>
                    </div>

                    {/* Security Seals */}
                    <div className="flex items-center justify-around pt-2">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" />
                          </svg>
                        </div>
                        <span className="text-[9px] text-slate-400">OWASP Checked</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-[#A8C028]/10 flex items-center justify-center text-[#A8C028]">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <span className="text-[9px] text-slate-400">SSL Hardened</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-[9px] text-slate-400">ISO Standards</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VISUAL DEVELOPMENT LIFECYCLE */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-[#A8C028] font-bold text-sm tracking-wider uppercase bg-[#A8C028]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
                JWay Development Lifecycle
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-heading font-bold tracking-tight">
                Our Mobile <span className="text-[#A8C028]">SOP Execution</span>
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed font-sans">
                Six disciplined steps, thoroughly tested and audited at each milestone, to guarantee premium outcomes and lightning-fast turnover.
              </p>
            </div>

            {/* Lifecycle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {LIFECYCLE_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-slate-100 hover:border-[#A8C028]/45 hover:-translate-y-1.5 transition-all duration-300 relative group"
                >
                  <div className="absolute top-6 right-8 text-4xl sm:text-5xl font-extrabold text-slate-100 font-heading group-hover:text-[#A8C028]/10 transition-colors">
                    {step.step}
                  </div>
                  
                  <span className="bg-[#A8C028]/10 text-[#A8C028] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {step.badge}
                  </span>

                  <h3 className="text-lg sm:text-xl font-bold font-heading mt-5 mb-3">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest at JWay contextual insights */}
        <LatestPosts posts={posts} />

        {/* CONSULTATION & CTA FORM */}
        <section id="contact-form" className="py-24 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-b from-[#F6F7EF] to-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#A8C028]/10 blur-3xl rounded-full"></div>
            
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
              <span className="text-[#A8C028] font-bold text-xs uppercase tracking-wider bg-[#A8C028]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">Ignite Your Solution</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading">Let&apos;s Architect Your Mobile Future</h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                Fill out the secure blueprint request form below, and JWay&apos;s Mobile Applications Architects will connect with a preliminary layout.
              </p>
            </div>

            {consultationSubmitted ? (
              <div className="bg-[#A8C028]/10 border border-[#A8C028]/35 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#A8C028] text-slate-950 font-bold rounded-full flex items-center justify-center mx-auto shadow-md">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Architecture Request Received!</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Our senior engineers are reviewing your target parameters for <strong>{formData.projectType}</strong>. We will contact you at <strong>{formData.email}</strong> within 12 hours.
                </p>
                <button
                  onClick={() => setConsultationSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-[#A8C028] text-slate-950 text-xs font-bold shadow hover:bg-[#A8C028]/90"
                >
                  Submit Another Blueprint
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Full Name <span className="text-red-500">*</span></label>
                    <input
                       type="text"
                       name="name"
                       required
                       value={formData.name}
                       onChange={handleFormChange}
                       placeholder="e.g. Sarah Jenkins"
                       className={`w-full bg-white border ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-[#A8C028] focus:ring-[#A8C028]"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors`}
                    />
                    {errors.name && <p className="text-xs font-semibold text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Business Email <span className="text-red-500">*</span></label>
                    <input
                       type="email"
                       name="email"
                       required
                       value={formData.email}
                       onChange={handleFormChange}
                       placeholder="e.g. sarah@enterprise.com"
                       className={`w-full bg-white border ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-[#A8C028] focus:ring-[#A8C028]"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors`}
                    />
                    {errors.email && <p className="text-xs font-semibold text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Target Core Focus</label>
                  <div className="relative">
                    <select
                       name="projectType"
                       value={formData.projectType}
                       onChange={handleFormChange}
                       className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-[#A8C028] transition-colors appearance-none truncate text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer text-slate-800"
                    >
                      <option value="Flutter Development">Flutter Development (Cross-Platform iOS/Android)</option>
                      <option value="Native iOS & Android Development">Native iOS & Android Development</option>
                      <option value="Cloud System Architecture">Cloud System Architecture</option>
                      <option value="Backend Development">Backend Development & API Sync</option>
                      <option value="VAPT & Security Assessment">VAPT Security Audits</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Briefly Describe Your Requirements <span className="text-red-500">*</span></label>
                  <textarea
                     name="details"
                     required
                     value={formData.details}
                     onChange={handleFormChange}
                     rows={4}
                     placeholder="Describe your user objectives, performance demands, and timeline goals..."
                     className={`w-full bg-white border ${errors.details ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-[#A8C028] focus:ring-[#A8C028]"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors`}
                  ></textarea>
                  {errors.details && <p className="text-xs font-semibold text-red-500 mt-1">{errors.details}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#A8C028] text-slate-950 font-bold hover:bg-[#A8C028]/95 shadow-lg transform hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider"
                >
                  Generate My Draft
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
