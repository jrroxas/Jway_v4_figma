"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMediaUrl } from "@/utils/media";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const OFFICES = [
  {
    city: "Milpitas, CA",
    country: "USA",
    tagline: "Global Headquarters",
    address: ["691 South Milpitas Blvd.", "Suite #213", "Milpitas, CA 95035", "USA"],
    phone: "+1 408 247 5929",
    phoneHref: "tel:+14082475929",
    email: "info@jway.com",
    emailHref: "mailto:info@jway.com",
    coordinates: { x: "15.2%", y: "48%" } // Map coordinates approximation
  },
  {
    city: "Ortigas Center",
    country: "Philippines",
    tagline: "Enterprise Delivery Center",
    address: ["30F One Corporate Center", "Ortigas Center", "Pasig City 1605", "Philippines"],
    phone: "+632 8284 8789",
    phoneHref: "tel:+63282848789",
    email: "info@jway.com",
    emailHref: "mailto:info@jway.com",
    coordinates: { x: "80.5%", y: "71%" }
  },
  {
    city: "Baguio City",
    country: "Philippines",
    tagline: "Regional Tech Hub",
    address: ["Good Grind Cafe+Workspace", "204 Newtown Plaza Building", "Navybase Road, St.Joseph Village", "Baguio City, Philippines"],
    phone: "+63 74 620 9871",
    phoneHref: "tel:+63746209871",
    email: "info@jway.com",
    emailHref: "mailto:info@jway.com",
    coordinates: { x: "80.5%", y: "68%" }
  }
];

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

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    form?: string;
  }>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [selectedOfficeIndex, setSelectedOfficeIndex] = useState<number>(0);
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    fetch("/api/recaptcha-config")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data?.siteKey) return;
        const key = String(data.siteKey).trim();
        if (!key) return;
        setRecaptchaSiteKey(key);

        const scriptId = "google-recaptcha-v3-script";
        if (!document.getElementById(scriptId)) {
          const script = document.createElement("script");
          script.id = scriptId;
          script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        }
      })
      .catch(() => {
        // Ignore if reCAPTCHA config is unavailable
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      const sanitized = value.replace(/[^\p{L}\s'’\-.,]/gu, "");
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      if (errors.name || errors.form) {
        setErrors((prev) => ({ ...prev, name: undefined, form: undefined }));
      }
      return;
    }
    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, phone: formatted }));
      if (errors.phone || errors.form) {
        setErrors((prev) => ({ ...prev, phone: undefined, form: undefined }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
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

    // Phone validation (optional)
    if (formData.phone.trim()) {
      if (formData.phone.trim().length < 7) {
        newErrors.phone = "Please enter a valid phone number (e.g. +1 (XXX) XXX-XXXX).";
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Please provide more details (at least 10 characters).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      let recaptchaToken = "";
      if (recaptchaSiteKey && typeof window !== "undefined" && window.grecaptcha) {
        recaptchaToken = await new Promise<string>((resolve) => {
          window.grecaptcha!.ready(async () => {
            try {
              const token = await window.grecaptcha!.execute(recaptchaSiteKey, { action: "contact_submit" });
              resolve(token || "");
            } catch {
              resolve("");
            }
          });
        });
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          formName: "Contact Us Form",
          recaptchaToken,
        }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        const resData = await response.json().catch(() => null);
        if (resData?.error) {
          setErrors({ form: resData.error });
        }
        setStatus("error");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        
        {/* Banner Hero */}
        <section className="relative py-20 bg-[#2e2f31] overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#A8C028_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-jway-green/20 text-jway-green text-xs font-semibold tracking-wider uppercase border border-jway-green/30">
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white">
              Connect With Our <span className="text-jway-green">Global Offices</span>
            </h1>
            <p className="text-gray-300 font-sans text-base sm:text-lg max-w-2xl mx-auto">
              Partner with a Silicon Valley powerhouse backed by premier Philippine delivery capabilities. We are here to support your scaling and product objectives.
            </p>
          </div>
        </section>

        {/* Global Hubs and Inquiry Form Grid */}
        <section className="py-24 bg-gradient-to-b from-white to-[#F6F7EF]/50 relative overflow-hidden">
          
          {/* Background Blurs */}
          <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-jway-green/5 blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[#A8C028]/10 blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Left Column: Office Cards & Maps */}
              <div className="lg:col-span-5 space-y-8">
                
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-800">
                    Our Global <span className="text-jway-green">Footprint</span>
                  </h2>
                  <p className="text-gray-500 font-sans text-sm sm:text-base leading-relaxed">
                    Strategically placed to ensure continuous delivery cycles, immediate timezone alignment, and optimal operational scalability.
                  </p>
                </div>

                {/* Mock Map Card Graphic */}
                <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-jway-green/10 rounded-full blur-xl pointer-events-none"></div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-jway-green animate-ping"></span>
                      Geographic Hubs
                    </span>
                    <span className="text-[11px] text-jway-green font-bold bg-jway-green/10 px-2.5 py-1 rounded-full border border-jway-green/20">
                      24/7 Operations
                    </span>
                  </div>

                  {/* SVG World Map Visualizer */}
                  <div className="relative aspect-[16/9] w-full bg-gray-950/60 border border-gray-800 rounded-2xl overflow-hidden flex items-center justify-center">
                    
                    {/* World Map Dotted Grid */}
                    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" fill="none">
                      <path d="M50 100h700M50 150h700M50 200h700M50 250h700M50 300h700M50 350h700" stroke="#374151" strokeWidth="0.5" strokeDasharray="3 3"/>
                      <path d="M100 50v350M200 50v350M300 50v350M400 50v350M500 50v350M600 50v350M700 50v350" stroke="#374151" strokeWidth="0.5" strokeDasharray="3 3"/>
                    </svg>

                    {/* Actual stylized world map background */}
                    <Image 
                      src={getMediaUrl("/world-map.svg")}
                      alt="World Map Background"
                      fill
                      className="object-cover opacity-80 select-none pointer-events-none"
                      unoptimized
                    />

                    {/* Interactive glowing hot spots */}
                    {OFFICES.map((office, idx) => {
                      const isSelected = selectedOfficeIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedOfficeIndex(idx)}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group/spot focus:outline-none"
                          style={{ left: office.coordinates.x, top: office.coordinates.y }}
                        >
                          <span className={`absolute inline-flex h-6 w-6 rounded-full opacity-75 animate-ping -left-1 -top-1 ${
                            isSelected ? "bg-jway-green" : "bg-white/40"
                          }`}></span>
                          <span className={`relative inline-flex rounded-full h-4 w-4 border shadow-sm transition-all duration-300 ${
                            isSelected 
                              ? "bg-jway-green border-white scale-125" 
                              : "bg-gray-700 border-gray-500 hover:bg-white"
                          }`}></span>
                          
                          {/* Map Label tooltip */}
                          <span className={`absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-0.5 rounded text-[9px] font-bold tracking-wide whitespace-nowrap transition-all duration-300 ${
                            isSelected 
                              ? "bg-jway-green text-white scale-100 opacity-100" 
                              : "bg-gray-800 text-gray-400 scale-75 opacity-0 group-hover/spot:opacity-100 group-hover/spot:scale-95"
                          }`}>
                            {office.city}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active office summary on Map */}
                  <div className="mt-5 border-t border-gray-800 pt-4">
                    <h4 className="text-white font-bold text-sm font-heading flex items-center justify-between">
                      <span>{OFFICES[selectedOfficeIndex].city}</span>
                      <span className="text-xs font-semibold text-jway-green">
                        {OFFICES[selectedOfficeIndex].tagline}
                      </span>
                    </h4>
                    <p className="text-xs text-gray-400 font-sans mt-1.5">
                      {OFFICES[selectedOfficeIndex].address.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Individual Location Cards */}
                <div className="space-y-4">
                  {OFFICES.map((office, idx) => {
                    const isSelected = selectedOfficeIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedOfficeIndex(idx)}
                        className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col gap-4 ${
                          isSelected
                            ? "bg-white border-jway-green shadow-xl ring-1 ring-jway-green/10"
                            : "bg-white/60 hover:bg-white border-gray-150 hover:border-gray-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-jway-green block">
                              {office.tagline}
                            </span>
                            <h3 className="font-heading font-extrabold text-gray-800 text-lg mt-0.5">
                              {office.city}, {office.country}
                            </h3>
                          </div>
                          <div className={`p-2 rounded-xl transition-colors ${
                            isSelected ? "bg-jway-green/10 text-jway-green" : "bg-gray-100 text-gray-500"
                          }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                          </div>
                        </div>

                        <div className="text-[13px] text-gray-500 space-y-1 pl-0.5 leading-relaxed font-sans border-l border-gray-200 ml-1.5">
                          {office.address.map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100 text-[13px] font-sans">
                          <a
                            href={office.phoneHref}
                            className="flex items-center gap-2 text-gray-600 hover:text-jway-green transition-colors font-semibold"
                          >
                            <svg className="w-4 h-4 text-jway-green shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.145-.44.02-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5a2.25 2.25 0 0 0-2.25 4.5v2.25Z" />
                            </svg>
                            {office.phone}
                          </a>
                          
                          <a
                            href={office.emailHref}
                            className="flex items-center gap-2 text-gray-600 hover:text-jway-green transition-colors font-semibold"
                          >
                            <svg className="w-4 h-4 text-jway-green shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                            {office.email}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Right Column: Glassmorphism Inquiry Form */}
              <div className="lg:col-span-7">
                <div className="bg-white/60 backdrop-blur-xl border border-white/80 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300">
                  
                  {/* Internal card details lights */}
                  <div className="absolute top-0 right-0 w-52 h-52 bg-gradient-to-br from-jway-green/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>

                  <div className="mb-8">
                    <h3 className="text-2xl font-heading font-extrabold text-gray-800">
                      Send a Message
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm font-sans mt-1">
                      Have a project scope, staffing request, or operational query? Let us know, and we will get back to you promptly.
                    </p>
                  </div>

                  {status === "success" ? (
                    <div className="py-16 px-4 text-center space-y-4 animate-fade-in">
                      <div className="w-16 h-16 bg-jway-green/20 text-jway-green rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-gray-800">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-gray-600 font-sans text-sm max-w-sm mx-auto leading-relaxed">
                        Thank you for reaching out to JWay Group. A local representative from our closest operational hub will contact you within **1 business day**.
                      </p>
                      <button
                        onClick={() => {
                          setStatus("idle");
                          setFormData({
                            name: "",
                            email: "",
                            company: "",
                            phone: "",
                            subject: "General Inquiry",
                            message: ""
                          });
                        }}
                        className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-semibold text-xs hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        Submit Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                      
                      {/* Name / Email row */}
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
                            placeholder="e.g. Sarah Jenkins"
                            className={`w-full bg-white/80 border ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-jway-green focus:ring-jway-green"} focus:ring-1 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-gray-800`}
                          />
                          {errors.name && <p className="text-xs font-semibold text-red-500 mt-1">{errors.name}</p>}
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
                            placeholder="e.g. sarah@domain.com"
                            className={`w-full bg-white/80 border ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-jway-green focus:ring-jway-green"} focus:ring-1 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-gray-800`}
                          />
                          {errors.email && <p className="text-xs font-semibold text-red-500 mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      {/* Company / Phone row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                            Company Name
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="e.g. Innovate Corp"
                            className="w-full bg-white/80 border border-gray-200 focus:border-jway-green focus:ring-1 focus:ring-jway-green rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-gray-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            maxLength={17}
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (XXX) XXX-XXXX"
                            className={`w-full bg-white/80 border ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-jway-green focus:ring-jway-green"} focus:ring-1 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-gray-800`}
                          />
                          {errors.phone && <p className="text-xs font-semibold text-red-500 mt-1">{errors.phone}</p>}
                        </div>
                      </div>

                      {/* Subject dropdown */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                          Subject / Inquiry Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full bg-white/80 border border-gray-200 focus:border-jway-green focus:ring-1 focus:ring-jway-green rounded-xl pl-3.5 pr-10 py-3 text-sm focus:outline-none text-gray-800 cursor-pointer appearance-none truncate text-ellipsis overflow-hidden whitespace-nowrap"
                          >
                            <option value="General Inquiry">General Corporate Inquiry</option>
                            <option value="Staffing Solutions">On-Demand Staffing &amp; Recruitment</option>
                            <option value="Enterprise Solutions">Enterprise Software Development</option>
                            <option value="Mobile Solutions">Mobile Design &amp; Architecture</option>
                            <option value="Support & Maintenance">Maintenance &amp; Support Contracts</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Message text area */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                          Message / Requirements <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Please detail your project scope, technical requirements, or general support questions..."
                          className={`w-full bg-white/85 border ${errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-jway-green focus:ring-jway-green"} focus:ring-1 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none text-gray-800 resize-none`}
                        ></textarea>
                        {errors.message && <p className="text-xs font-semibold text-red-500 mt-1">{errors.message}</p>}
                      </div>

                      {status === "error" && (
                        <p className="text-xs font-bold text-red-500 flex items-center gap-1.5">
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                          </svg>
                          {errors.form || "Please correct the validation errors in the fields above."}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full py-4 rounded-xl bg-jway-green text-white font-extrabold tracking-wide hover:bg-jway-green/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-jway-green/10 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] cursor-pointer"
                      >
                        {status === "submitting" ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Inquiry...
                          </>
                        ) : (
                          "Send Inquiry Message"
                        )}
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
