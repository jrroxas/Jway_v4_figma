"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getMediaUrl } from "@/utils/media";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

// ── Navigation Mega-Menu Data (from Figma node 482:3215) ──────────────────
interface CapabilityItem {
  title: string;
  desc: string;
}

const CAPABILITIES_BY_SUBSERVICE: Record<string, CapabilityItem[]> = {
  "Digital Strategy & Future Architecture": [
    { title: "Digital Strategy", desc: "Aligns digital priorities with business goals." },
    { title: "Solution Architecture", desc: "Defines how systems and technology work together." },
    { title: "Transformation Roadmaps", desc: "Sequences initiatives into an actionable plan." },
    { title: "Modernization Planning", desc: "Plans the evolution of existing applications." },
    { title: "Consumer Data Platform Strategy", desc: "Plans how customer data is unified and used." },
  ],
  "Product & Platform Engineering": [
    { title: "Platforms", desc: "Creates the foundations for digital products." },
    { title: "Software Engineering", desc: "Builds and maintains business applications." },
    { title: "Cloud Engineering/Application Modernization", desc: "Modernizes applications for cloud environments." },
    { title: "APIs", desc: "Connects applications through reusable interfaces." },
    { title: "Systems Integration", desc: "Brings systems and data into connected workflows." },
  ],
  "Experience Platforms & Commerce Intelligence": [
    { title: "UI/UX Design", desc: "Shapes clear and usable digital experiences." },
    { title: "Product Design", desc: "Turns user needs into practical product designs." },
    { title: "Digital Commerce", desc: "Connects commerce experiences and customer journeys." },
    { title: "Responsible AI", desc: "Guides the fair, transparent, and safe use of AI." },
    { title: "Opportunity Assessment", desc: "Identifies and prioritizes where AI can deliver business value." },
  ],
  "Cloud Infrastructure & Operations": [
    { title: "DevOps", desc: "Improves software delivery and operations." },
    { title: "Cloud Infrastructure", desc: "Establishes cloud environments for business workloads." },
    { title: "Infrastructure Modernization", desc: "Updates the foundations supporting applications." },
    { title: "Responsible AI", desc: "Guides the fair, transparent, and safe use of AI." },
    { title: "Opportunity Assessment", desc: "Identifies and prioritizes where AI can deliver business value." },
  ],
  "Cyber Resilience for the AI Era": [
    { title: "Security Infrastructure", desc: "Strengthens the infrastructure protecting systems and data." },
    { title: "Readiness", desc: "Assesses whether data, technology, and teams are prepared for AI adoption." },
    { title: "Governance", desc: "Establishes rules, responsibilities, and oversight for AI use." },
    { title: "Responsible AI", desc: "Guides the fair, transparent, and safe use of AI." },
    { title: "Opportunity Assessment", desc: "Identifies and prioritizes where AI can deliver business value." },
  ],
  "AI Strategy & Governance": [
    { title: "AI Strategy", desc: "Defines how AI can support business goals." },
    { title: "Readiness", desc: "Assesses whether data, technology, and teams are prepared for AI adoption." },
    { title: "Governance", desc: "Establishes rules, responsibilities, and oversight for AI use." },
    { title: "Responsible AI", desc: "Guides the fair, transparent, and safe use of AI." },
    { title: "Opportunity Assessment", desc: "Identifies and prioritizes where AI can deliver business value." },
  ],
  "Agentic Systems & Digital Workers": [
    { title: "AI Agents & Digital Workers", desc: "Applies AI agents to defined business tasks." },
    { title: "Conversational & Voice AI", desc: "Enables conversational and voice interactions." },
    { title: "Private AI & Enterprise Knowledge", desc: "Connects AI with private enterprise knowledge." },
    { title: "Intelligent Automation & Orchestration", desc: "Coordinates automated tasks across business workflows." },
    { title: "Opportunity Assessment", desc: "Identifies and prioritizes where AI can deliver business value." },
  ],
  "AI-Integrated Applications": [
    { title: "AI Assisted Engineering & Delivery", desc: "Integrates AI assistance into engineering and delivery." },
    { title: "Readiness", desc: "Assesses whether data, technology, and teams are prepared for AI adoption." },
    { title: "Governance", desc: "Establishes rules, responsibilities, and oversight for AI use." },
    { title: "Responsible AI", desc: "Guides the fair, transparent, and safe use of AI." },
    { title: "Opportunity Assessment", desc: "Identifies and prioritizes where AI can deliver business value." },
  ],
  "AI Institute": [
    { title: "Talent Readiness", desc: "Assesses skills needed for applied AI work." },
    { title: "AI Engineering Training Program", desc: "Develops practical AI engineering capabilities." },
    { title: "Applied AI Training", desc: "Builds hands-on skills for applying AI." },
    { title: "Certification", desc: "Validates learning and demonstrated capabilities." },
    { title: "Opportunity Assessment", desc: "Identifies and prioritizes where AI can deliver business value." },
  ],
  "AI Professionals": [
    { title: "AI Talent Deployment", desc: "Matches AI professionals with delivery needs." },
    { title: "Forward Deployed AI Professionals", desc: "Embeds AI professionals in business teams." },
    { title: "Turnkey AI Teams", desc: "Brings AI professionals together for delivery." },
    { title: "Responsible AI", desc: "Guides the fair, transparent, and safe use of AI." },
    { title: "Opportunity Assessment", desc: "Identifies and prioritizes where AI can deliver business value." },
  ],
};

const SERVICE_COLUMNS = [
  {
    title: "Design & Engineer",
    items: [
      "Digital Strategy & Future Architecture",
      "Product & Platform Engineering",
      "Experience Platforms & Commerce Intelligence",
      "Cloud Infrastructure & Operations",
      "Cyber Resilience for the AI Era",
    ],
  },
  {
    title: "Applied AI & Automation",
    items: [
      "AI Strategy & Governance",
      "Agentic Systems & Digital Workers",
      "AI-Integrated Applications",
      "AI Institute",
    ],
  },
  {
    title: "Talent Manufacturing",
    items: ["AI Professionals"],
  },
];

// ── Client Logos Data (from Figma node 748:8011) ──────────────────────────
const ROW_A_LOGOS = [
  { name: "Capgemini", src: "/clients/capgemini.png", width: 166, height: 38 },
  { name: "Lazada", src: "/clients/lazada.png", width: 145, height: 38 },
  { name: "Sun Microsystems", src: "/clients/sun-microsystems.png", width: 121, height: 52 },
  { name: "Omnicell", src: "/clients/omnicell.png", width: 178, height: 43 },
  { name: "Johnson & Johnson", src: "/clients/johnson-johnson.png", width: 127, height: 47 },
  { name: "Cisco", src: "/clients/cisco.png", width: 100, height: 52 },
  { name: "FMC", src: "/clients/fmc.png", width: 119, height: 36 },
];

const ROW_B_LOGOS = [
  { name: "OnRamp Lab", src: "/clients/onramplab.svg", width: 216, height: 23 },
  { name: "IDT", src: "/clients/idt.png", width: 116, height: 42 },
  { name: "AEHR Test Systems", src: "/clients/aehr.png", width: 152, height: 26 },
  { name: "Lionbridge", src: "/clients/lionbridge.png", width: 200, height: 28 },
  { name: "SM Retail", src: "/clients/sm-retail.png", width: 111, height: 52 },
  { name: "D.W. Morgan", src: "/clients/morgan.png", width: 149, height: 36 },
  { name: "Pointwest", src: "/clients/pointwest.png", width: 157, height: 52 },
];

// ── 02 Our Services Data (from Figma node 472:1586) ───────────────────────
const SERVICES_DATA = [
  {
    id: 0,
    num: "01",
    tabName: "Design & Engineer",
    description:
      "We turn business priorities into clear AI strategies, secure systems, and custom software built for the way you work.",
    image: getMediaUrl("/new-homepage/service-card-1.png"),
    bgFallback: "linear-gradient(180deg, #CFD8C0 0%, #9FB07A 100%)",
    vennHighlight: "top" as const,
  },
  {
    id: 1,
    num: "02",
    tabName: "Applied AI & Automation",
    description:
      "We build intelligent digital workers, connect business systems, and automate repetitive tasks so your teams can focus on work that matters.",
    image: getMediaUrl("/new-homepage/service-card-2.png"),
    bgFallback: "linear-gradient(180deg, #C9D6E3 0%, #89A1B5 100%)",
    vennHighlight: "bottom-left" as const,
  },
  {
    id: 2,
    num: "03",
    tabName: "Talent Manufacturing",
    description:
      "We bring AI into everyday business through connected workspaces, intelligent content creation, digital media, and practical training.",
    image: getMediaUrl("/new-homepage/service-card-3.png"),
    bgFallback: "linear-gradient(180deg, #DCDCD6 0%, #A7A8A6 100%)",
    vennHighlight: "bottom-right" as const,
  },
];

// ── 03 Why JWay Data (from Figma node 472:1629 & 437:1892) ────────────────
const WHY_JWAY_CARDS = [
  {
    id: "understand",
    title: "Understand",
    body: "People who understand the challenge.",
    image: getMediaUrl("/new-homepage/why-card-1.png"),
    ringColor: "rgba(168, 192, 39, 0.35)",
  },
  {
    id: "connect",
    title: "Connect",
    body: "Engineers who connect the systems.",
    image: getMediaUrl("/new-homepage/why-card-2.png"),
    ringColor: "rgba(167, 168, 166, 0.35)",
  },
  {
    id: "apply",
    title: "Apply",
    body: "AI professionals who turn possibilities into practical applications.",
    image: getMediaUrl("/new-homepage/why-card-3.png"),
    ringColor: "rgba(168, 192, 39, 0.35)",
  },
  {
    id: "sustain",
    title: "Sustain",
    body: "Development, automation, training, and continued support that build the capability to move forward.",
    image: getMediaUrl("/new-homepage/why-card-4.png"),
    ringColor: "rgba(167, 168, 166, 0.35)",
  },
];

// ── 05 Industries Data (from Figma node 472:1696 & 544:3465) ──────────────
const INDUSTRY_FILTERS = [
  "Tech",
  "Finance",
  "Healthcare & Life Sciences",
  "Business Services",
  "Logistics & Supply Chain",
] as const;

type IndustryFilter = (typeof INDUSTRY_FILTERS)[number];

const INDUSTRY_CATEGORY_HITS: Record<IndustryFilter, Set<string>> = {
  Tech: new Set([
    "SaaS",
    "Software Development",
    "Cloud Computing",
    "Cybersecurity",
    "Artificial Intelligence",
    "IT Services",
    "Data Analytics",
    "Enterprise Software",
    "IT Infrastructure",
    "Telecom Operators",
    "Internet Service Providers",
    "Digital Media",
    "Broadcasting",
    "Streaming Platforms",
    "Advertising Technology",
    "Universities",
    "Schools",
    "Online Learning",
    "EdTech Platforms",
    "Corporate Training",
    "Learning Management Systems",
    "Professional Certification",
    "Gaming",
    "Game Development",
    "Film & Television",
    "Music",
    "Digital Content",
    "Animation",
    "Esports",
    "Entertainment Platforms",
  ]),
  Finance: new Set([
    "Banking",
    "FinTech",
    "Insurance",
    "Investment Management",
    "Wealth Management",
    "Lending",
    "Payments",
    "Digital Banking",
  ]),
  "Healthcare & Life Sciences": new Set([
    "Healthcare Providers",
    "HealthTech",
    "Pharmaceuticals",
    "Biotechnology",
    "Medical Devices",
    "Diagnostics",
    "Telehealth",
  ]),
  "Business Services": new Set([
    "Consulting",
    "Business Process Outsourcing",
    "Knowledge Process Outsourcing",
    "Staffing & Recruitment",
    "Legal Services",
    "Accounting",
    "Managed Services",
    "Commercial Real Estate",
    "Residential Development",
    "Property Management",
    "PropTech",
    "Architecture",
    "Engineering",
    "Construction Technology",
    "Online Retail",
    "E-Commerce Platforms",
    "Consumer Goods",
    "Supermarkets",
    "Fashion",
    "Luxury Goods",
    "Direct-to-Consumer (DTC)",
    "Marketplaces",
    "Food & Beverage",
    "Personal Care",
    "Household Products",
    "Cosmetics",
    "Packaged Goods",
    "Consumer Electronics",
  ]),
  "Logistics & Supply Chain": new Set([
    "Transportation",
    "Freight",
    "Shipping",
    "Warehousing",
    "Distribution",
    "Supply Chain Management",
    "Third-Party Logistics",
    "Delivery Services",
    "Automotive",
    "Electronics",
    "Semiconductors",
    "Industrial Equipment",
    "Consumer Products",
    "Industrial Automation",
    "Smart Manufacturing",
    "Automotive Manufacturing",
    "Electric Vehicles",
    "Mobility Platforms",
    "Autonomous Vehicles",
    "Fleet Management",
    "Automotive Technology",
  ]),
};

const ALL_INDUSTRY_CHIPS = [
  // Row 1
  "SaaS",
  "Banking",
  "Healthcare Providers",
  "Consulting",
  "Transportation",
  "Software Development",
  "FinTech",
  // Row 2
  "HealthTech",
  "Business Process Outsourcing",
  "Freight",
  "Cloud Computing",
  "Insurance",
  "Pharmaceuticals",
  // Row 3
  "Knowledge Process Outsourcing",
  "Shipping",
  "Cybersecurity",
  "Investment Management",
  "Biotechnology",
  // Row 4
  "Staffing & Recruitment",
  "Warehousing",
  "Artificial Intelligence",
  "Wealth Management",
  "Medical Devices",
  // Row 5
  "Legal Services",
  "Distribution",
  "IT Services",
  "Lending",
  "Diagnostics",
  "Accounting",
  "Supply Chain Management",
  // Row 6
  "Data Analytics",
  "Payments",
  "Telehealth",
  "Managed Services",
  "Third-Party Logistics",
  "Enterprise Software",
  // Row 7
  "Digital Banking",
  "Commercial Real Estate",
  "Delivery Services",
  "IT Infrastructure",
  "Residential Development",
  // Rows 8-14 (visible when See All Industries is toggled)
  "Automotive",
  "Telecom Operators",
  "Property Management",
  "Electronics",
  "Internet Service Providers",
  "PropTech",
  "Semiconductors",
  "Digital Media",
  "Architecture",
  "Industrial Equipment",
  "Broadcasting",
  "Engineering",
  "Consumer Products",
  "Streaming Platforms",
  "Construction Technology",
  "Industrial Automation",
  "Advertising Technology",
  "Online Retail",
  "Smart Manufacturing",
  "Universities",
  "E-Commerce Platforms",
  "Automotive Manufacturing",
  "Schools",
  "Consumer Goods",
  "Electric Vehicles",
  "Online Learning",
  "Supermarkets",
  "Mobility Platforms",
  "EdTech Platforms",
  "Fashion",
  "Autonomous Vehicles",
  "Corporate Training",
  "Luxury Goods",
  "Fleet Management",
  "Learning Management Systems",
  "Direct-to-Consumer (DTC)",
  "Automotive Technology",
  "Professional Certification",
  "Marketplaces",
  "Gaming",
  "Food & Beverage",
  "Game Development",
  "Personal Care",
  "Film & Television",
  "Household Products",
  "Music",
  "Cosmetics",
  "Digital Content",
  "Packaged Goods",
  "Animation",
  "Consumer Electronics",
  "Esports",
  "Entertainment Platforms",
];

// ── Section / Partners Orb Cluster Data (from Figma node 748:8014) ─────────
// Cluster box: 760x600 @ (3990, 3765) in Figma canvas
const PARTNER_ORBS = [
  // Large 168x168 orbs (logo box 116x44)
  { name: "Claude", src: getMediaUrl("/new-homepage/partners/claude.png"), size: 168, logoW: 116, logoH: 44, left: 23, top: 382, hasShadow: true },
  { name: "Optimizely", src: getMediaUrl("/new-homepage/partners/optimizely.png"), size: 168, logoW: 116, logoH: 44, left: 280, top: 37, hasShadow: true },
  { name: "Zoho", src: getMediaUrl("/new-homepage/partners/zoho.png"), size: 168, logoW: 116, logoH: 44, left: 587, top: 177, hasShadow: true },
  { name: "Google", src: getMediaUrl("/new-homepage/partners/google.png"), size: 168, logoW: 112, logoH: 34, left: 300, top: 427, hasShadow: true },
  { name: "AWS", src: getMediaUrl("/new-homepage/partners/aws.png"), size: 168, logoW: 116, logoH: 44, left: 8, top: 141, hasShadow: true },
  // Medium 132x132 orbs (logo box 92x36)
  { name: "Gemini", src: getMediaUrl("/new-homepage/partners/gemini.png"), size: 132, logoW: 92, logoH: 36, left: 545, top: 45, hasShadow: false },
  { name: "Jira", src: getMediaUrl("/new-homepage/partners/jira.png"), size: 132, logoW: 92, logoH: 36, left: 58, top: 0, hasShadow: false },
  { name: "Figma", src: getMediaUrl("/new-homepage/partners/figma.png"), size: 132, logoW: 92, logoH: 36, left: 479, top: 441, hasShadow: false },
  { name: "Python", src: getMediaUrl("/new-homepage/partners/python.png"), size: 132, logoW: 92, logoH: 36, left: 221, top: 197, hasShadow: false },
  // Small 104x104 orbs (logo box 72x28)
  { name: "ChatGPT", src: getMediaUrl("/new-homepage/partners/chatgpt.png"), size: 104, logoW: 72, logoH: 28, left: 448, top: 127, hasShadow: false },
  { name: "GitLab", src: getMediaUrl("/new-homepage/partners/gitlab.png"), size: 104, logoW: 72, logoH: 28, left: 426, top: 345, hasShadow: false },
  { name: "Azure", src: getMediaUrl("/new-homepage/partners/azure.png"), size: 104, logoW: 72, logoH: 28, left: 315, top: 312, hasShadow: false },
  { name: "Docker", src: getMediaUrl("/new-homepage/partners/docker.png"), size: 104, logoW: 72, logoH: 28, left: 186, top: 482, hasShadow: false },
  { name: "React", src: getMediaUrl("/new-homepage/partners/react.png"), size: 104, logoW: 72, logoH: 28, left: 169, top: 99, hasShadow: false },
  { name: "n8n", src: getMediaUrl("/new-homepage/partners/n8n.png"), size: 104, logoW: 72, logoH: 28, left: 132, top: 289, hasShadow: false },
  { name: "PostgreSQL", src: getMediaUrl("/new-homepage/partners/postgresql.png"), size: 104, logoW: 72, logoH: 28, left: 443, top: 0, hasShadow: false },
  { name: "TestRail", src: getMediaUrl("/new-homepage/partners/testrail.png"), size: 104, logoW: 72, logoH: 28, left: 364, top: 207, hasShadow: false },
  { name: "Reflect", src: getMediaUrl("/new-homepage/partners/reflect.png"), size: 104, logoW: 72, logoH: 28, left: 541, top: 334, hasShadow: false },
  { name: "Flutter", src: getMediaUrl("/new-homepage/partners/flutter.png"), size: 104, logoW: 72, logoH: 28, left: 619, top: 420, hasShadow: false },
  { name: "Canva", src: getMediaUrl("/new-homepage/partners/canva.png"), size: 104, logoW: 72, logoH: 28, left: 475, top: 239, hasShadow: false },
  { name: "Hugging Face", src: getMediaUrl("/new-homepage/partners/hugging-face.png"), size: 104, logoW: 72, logoH: 28, left: 215, top: 370, hasShadow: false },
];

// ── Tablet Partners Orb Cluster Data (from Figma node 898:1305 · 452x356.842) ─
const TABLET_PARTNER_ORBS = [
  { name: "Claude", src: getMediaUrl("/new-homepage/partners/claude.png"), size: 99.916, logoW: 78.933, logoH: 17.042, left: 13.68, top: 227.19, hasShadow: true },
  { name: "Optimizely", src: getMediaUrl("/new-homepage/partners/optimizely.png"), size: 99.916, logoW: 83.522, logoH: 19.362, left: 166.53, top: 22.01, hasShadow: true },
  { name: "Zoho", src: getMediaUrl("/new-homepage/partners/zoho.png"), size: 99.916, logoW: 78.933, logoH: 33.918, left: 349.11, top: 105.27, hasShadow: true },
  { name: "Google", src: getMediaUrl("/new-homepage/partners/google.png"), size: 99.916, logoW: 78.933, logoH: 23.972, left: 178.42, top: 253.95, hasShadow: true },
  { name: "AWS", src: getMediaUrl("/new-homepage/partners/aws.png"), size: 99.916, logoW: 61.948, logoH: 37.236, left: 4.76, top: 83.86, hasShadow: true },
  { name: "Gemini", src: getMediaUrl("/new-homepage/partners/gemini.png"), size: 78.505, logoW: 62.019, logoH: 22.552, left: 324.13, top: 26.76, hasShadow: false },
  { name: "Jira", src: getMediaUrl("/new-homepage/partners/jira.png"), size: 78.505, logoW: 35.145, logoH: 38.468, left: 34.49, top: 0, hasShadow: false },
  { name: "Figma", src: getMediaUrl("/new-homepage/partners/figma.png"), size: 78.505, logoW: 25.703, logoH: 38.468, left: 284.88, top: 262.28, hasShadow: false },
  { name: "Python", src: getMediaUrl("/new-homepage/partners/python.png"), size: 78.505, logoW: 38.468, logoH: 38.468, left: 131.44, top: 117.16, hasShadow: false },
  { name: "ChatGPT", src: getMediaUrl("/new-homepage/partners/chatgpt.png"), size: 61.853, logoW: 28.517, logoH: 30.308, left: 266.44, top: 75.53, hasShadow: false },
  { name: "GitLab", src: getMediaUrl("/new-homepage/partners/gitlab.png"), size: 61.853, logoW: 51.956, logoH: 11.336, left: 253.36, top: 205.18, hasShadow: false },
  { name: "Azure", src: getMediaUrl("/new-homepage/partners/azure.png"), size: 61.853, logoW: 32.236, logoH: 30.308, left: 187.34, top: 185.56, hasShadow: false },
  { name: "Docker", src: getMediaUrl("/new-homepage/partners/docker.png"), size: 61.853, logoW: 51.956, logoH: 11.808, left: 110.62, top: 286.66, hasShadow: false },
  { name: "React", src: getMediaUrl("/new-homepage/partners/react.png"), size: 61.853, logoW: 51.956, logoH: 17.594, left: 100.51, top: 58.88, hasShadow: false },
  { name: "n8n", src: getMediaUrl("/new-homepage/partners/n8n.png"), size: 61.853, logoW: 51.956, logoH: 14.406, left: 78.51, top: 171.88, hasShadow: false },
  { name: "PostgreSQL", src: getMediaUrl("/new-homepage/partners/postgresql.png"), size: 61.853, logoW: 30.446, logoH: 30.308, left: 263.47, top: 0, hasShadow: false },
  { name: "TestRail", src: getMediaUrl("/new-homepage/partners/testrail.png"), size: 61.853, logoW: 51.956, logoH: 12.871, left: 216.48, top: 123.11, hasShadow: false },
  { name: "Reflect", src: getMediaUrl("/new-homepage/partners/reflect.png"), size: 61.853, logoW: 51.956, logoH: 11.926, left: 321.75, top: 198.64, hasShadow: false },
  { name: "Flutter", src: getMediaUrl("/new-homepage/partners/flutter.png"), size: 61.853, logoW: 20.94, logoH: 30.308, left: 368.14, top: 249.79, hasShadow: false },
  { name: "Canva", src: getMediaUrl("/new-homepage/partners/canva.png"), size: 61.853, logoW: 51.956, logoH: 16.65, left: 282.5, top: 142.14, hasShadow: false },
  { name: "Hugging Face", src: getMediaUrl("/new-homepage/partners/hugging-face.png"), size: 61.853, logoW: 33.339, logoH: 30.308, left: 127.87, top: 220.05, hasShadow: false },
];

// ── Tablet Industries Cards Data (from Figma node 924:11156 & 950:13636) ───
const TABLET_INDUSTRY_CARDS = [
  {
    id: "technology",
    title: "Technology",
    icon: "/icons/industries/technology.svg",
    count: 30,
    hasFade: true,
    tags: Array.from(INDUSTRY_CATEGORY_HITS.Tech),
  },
  {
    id: "finance",
    title: "Finance",
    icon: "/icons/industries/finance.svg",
    count: 8,
    hasFade: true,
    tags: Array.from(INDUSTRY_CATEGORY_HITS.Finance),
  },
  {
    id: "healthcare",
    title: "Healthcare & Life Sciences",
    icon: "/icons/industries/healthcare.svg",
    count: 7,
    hasFade: false,
    tags: Array.from(INDUSTRY_CATEGORY_HITS["Healthcare & Life Sciences"]),
  },
  {
    id: "business-services",
    title: "Business Services",
    icon: "/icons/industries/business-services.svg",
    count: 28,
    hasFade: true,
    tags: Array.from(INDUSTRY_CATEGORY_HITS["Business Services"]),
  },
  {
    id: "logistics",
    title: "Logistics & Supply Chain",
    icon: "/icons/industries/logistics.svg",
    count: 21,
    hasFade: true,
    tags: Array.from(INDUSTRY_CATEGORY_HITS["Logistics & Supply Chain"]),
  },
];

// ── Tablet Client Logos Data (0.8x scale from Figma node 898:1075) ─────────
const TABLET_ROW_A_LOGOS = [
  { name: "Capgemini", src: "/clients/capgemini.png", width: 132.8, height: 30.24 },
  { name: "Lazada", src: "/clients/lazada.png", width: 116.24, height: 30.48 },
  { name: "Sun Microsystems", src: "/clients/sun-microsystems.png", width: 96.8, height: 41.6 },
  { name: "Omnicell", src: "/clients/omnicell.png", width: 142.32, height: 34.64 },
  { name: "Johnson & Johnson", src: "/clients/johnson-johnson.png", width: 101.36, height: 37.92 },
  { name: "Cisco", src: "/clients/cisco.png", width: 79.6, height: 41.6 },
  { name: "FMC", src: "/clients/fmc.png", width: 94.8, height: 28.64 },
];

const TABLET_ROW_B_LOGOS = [
  { name: "OnRamp Lab", src: "/clients/onramplab.svg", width: 172.8, height: 18.56 },
  { name: "IDT", src: "/clients/idt.png", width: 92.4, height: 33.2 },
  { name: "AEHR Test Systems", src: "/clients/aehr.png", width: 121.44, height: 21.12 },
  { name: "Lionbridge", src: "/clients/lionbridge.png", width: 160.08, height: 22.72 },
  { name: "SM Retail", src: "/clients/sm-retail.png", width: 88.64, height: 41.6 },
  { name: "D.W. Morgan", src: "/clients/morgan.png", width: 118.96, height: 28.96 },
  { name: "Pointwest", src: "/clients/pointwest.png", width: 125.68, height: 41.6 },
];

// ── Mobile Client Logos Data (0.65x scale from Figma node 898:1484) ────────
const MOBILE_ROW_A_LOGOS = [
  { name: "Capgemini", src: "/clients/capgemini.png", width: 107.9, height: 24.57 },
  { name: "Lazada", src: "/clients/lazada.png", width: 94.445, height: 24.765 },
  { name: "Sun Microsystems", src: "/clients/sun-microsystems.png", width: 78.65, height: 33.8 },
  { name: "Omnicell", src: "/clients/omnicell.png", width: 115.635, height: 28.145 },
  { name: "Johnson & Johnson", src: "/clients/johnson-johnson.png", width: 82.355, height: 30.81 },
  { name: "Cisco", src: "/clients/cisco.png", width: 64.675, height: 33.8 },
  { name: "FMC", src: "/clients/fmc.png", width: 77.025, height: 23.27 },
];

const MOBILE_ROW_B_LOGOS = [
  { name: "OnRamp Lab", src: "/clients/onramplab.svg", width: 140.4, height: 15.08 },
  { name: "IDT", src: "/clients/idt.png", width: 75.075, height: 26.975 },
  { name: "AEHR Test Systems", src: "/clients/aehr.png", width: 98.67, height: 17.16 },
  { name: "Lionbridge", src: "/clients/lionbridge.png", width: 130.065, height: 18.46 },
  { name: "SM Retail", src: "/clients/sm-retail.png", width: 72.02, height: 33.8 },
  { name: "D.W. Morgan", src: "/clients/morgan.png", width: 96.655, height: 23.53 },
  { name: "Pointwest", src: "/clients/pointwest.png", width: 102.115, height: 33.8 },
];

// ── Mobile Partners Orb Cluster Data (from Figma node 898:1714 · 368x290.526) ─
const MOBILE_PARTNER_ORBS = [
  { name: "Claude", src: getMediaUrl("/new-homepage/partners/claude.png"), size: 81.347, logoW: 64.264, logoH: 13.875, left: 11.14, top: 184.97, hasShadow: true },
  { name: "Optimizely", src: getMediaUrl("/new-homepage/partners/optimizely.png"), size: 81.347, logoW: 68, logoH: 15.764, left: 135.58, top: 17.92, hasShadow: true },
  { name: "Zoho", src: getMediaUrl("/new-homepage/partners/zoho.png"), size: 81.347, logoW: 64.264, logoH: 27.615, left: 284.23, top: 85.71, hasShadow: true },
  { name: "Google", src: getMediaUrl("/new-homepage/partners/google.png"), size: 81.347, logoW: 64.264, logoH: 19.517, left: 145.26, top: 206.76, hasShadow: true },
  { name: "AWS", src: getMediaUrl("/new-homepage/partners/aws.png"), size: 81.347, logoW: 50.435, logoH: 30.316, left: 3.87, top: 68.27, hasShadow: true },
  { name: "Gemini", src: getMediaUrl("/new-homepage/partners/gemini.png"), size: 63.916, logoW: 50.493, logoH: 18.361, left: 263.89, top: 21.79, hasShadow: false },
  { name: "Jira", src: getMediaUrl("/new-homepage/partners/jira.png"), size: 63.916, logoW: 28.614, logoH: 31.319, left: 28.08, top: 0, hasShadow: false },
  { name: "Figma", src: getMediaUrl("/new-homepage/partners/figma.png"), size: 63.916, logoW: 20.927, logoH: 31.319, left: 231.94, top: 213.54, hasShadow: false },
  { name: "Python", src: getMediaUrl("/new-homepage/partners/python.png"), size: 63.916, logoW: 31.319, logoH: 31.319, left: 107.01, top: 95.39, hasShadow: false },
  { name: "ChatGPT", src: getMediaUrl("/new-homepage/partners/chatgpt.png"), size: 50.358, logoW: 23.217, logoH: 24.675, left: 216.93, top: 61.49, hasShadow: false },
  { name: "GitLab", src: getMediaUrl("/new-homepage/partners/gitlab.png"), size: 50.358, logoW: 42.301, logoH: 9.229, left: 206.27, top: 167.05, hasShadow: false },
  { name: "Azure", src: getMediaUrl("/new-homepage/partners/azure.png"), size: 50.358, logoW: 26.246, logoH: 24.675, left: 152.53, top: 151.07, hasShadow: false },
  { name: "Docker", src: getMediaUrl("/new-homepage/partners/docker.png"), size: 50.358, logoW: 42.301, logoH: 9.614, left: 90.06, top: 233.39, hasShadow: false },
  { name: "React", src: getMediaUrl("/new-homepage/partners/react.png"), size: 50.358, logoW: 42.301, logoH: 14.325, left: 81.83, top: 47.94, hasShadow: false },
  { name: "n8n", src: getMediaUrl("/new-homepage/partners/n8n.png"), size: 50.358, logoW: 42.301, logoH: 11.729, left: 63.92, top: 139.94, hasShadow: false },
  { name: "PostgreSQL", src: getMediaUrl("/new-homepage/partners/postgresql.png"), size: 50.358, logoW: 24.788, logoH: 24.675, left: 214.51, top: 0, hasShadow: false },
  { name: "TestRail", src: getMediaUrl("/new-homepage/partners/testrail.png"), size: 50.358, logoW: 42.301, logoH: 10.479, left: 176.25, top: 100.23, hasShadow: false },
  { name: "Reflect", src: getMediaUrl("/new-homepage/partners/reflect.png"), size: 50.358, logoW: 42.301, logoH: 9.71, left: 261.96, top: 161.73, hasShadow: false },
  { name: "Flutter", src: getMediaUrl("/new-homepage/partners/flutter.png"), size: 50.358, logoW: 17.048, logoH: 24.675, left: 299.73, top: 203.37, hasShadow: false },
  { name: "Canva", src: getMediaUrl("/new-homepage/partners/canva.png"), size: 50.358, logoW: 42.301, logoH: 13.555, left: 230, top: 115.73, hasShadow: false },
  { name: "Hugging Face", src: getMediaUrl("/new-homepage/partners/hugging-face.png"), size: 50.358, logoW: 27.143, logoH: 24.675, left: 104.11, top: 179.16, hasShadow: false },
];

// ── 07 CTA + FAQ Data (from Figma node 472:1779) ──────────────────────────
const FAQ_ITEMS = [
  {
    question: "What business challenges can JWay help us solve?",
    answer:
      "From disconnected systems and manual tasks to finding the right AI expertise, we help businesses address challenges through engineering, applied AI, and talent. Tell us what’s slowing your team down. A brief conversation can help us understand where we could make a difference.",
  },
  {
    question: "How much do your services cost?",
    answer:
      "Pricing depends on the scope, complexity, and expertise involved. Share your priorities and any budget parameters in a short call, and we can discuss a suitable approach and the details needed for an estimate.",
  },
  {
    question: "Can JWay support both our technology and talent needs?",
    answer:
      "Yes. We bring software engineering, AI and automation, recruitment, staffing, and training together in one organization. Whether you need a specific service or support across several areas, let’s discuss what fits your business.",
  },
];

// ── Footer Data (from Figma node 748:8016) ────────────────────────────────
const FOOTER_OFFICES = [
  {
    city: "Milpitas, CA, USA",
    addressLines: ["691 South Milpitas Blvd.", "Suite #213", "Milpitas, CA 95035", "USA"],
    phone: "+1 408 247 5929",
    telHref: "tel:+14082475929",
  },
  {
    city: "Ortigas Center, Philippines",
    addressLines: [
      "30F One Corporate Center",
      "Ortigas Center",
      "Pasig City 1605",
      "Philippines",
    ],
    phone: "+632 8284 8789",
    telHref: "tel:+63282848789",
  },
  {
    city: "Baguio City, Philippines",
    addressLines: [
      "Good Grind Cafe+Workspace",
      "204 Newtown Plaza Building",
      "Navybase Road, St.Joseph Village",
      "Baguio City, Philippines",
    ],
    phone: "+63 74 620 9871",
    telHref: "tel:+63746209871",
  },
];

function VennIcon({ highlight }: { highlight: "top" | "bottom-left" | "bottom-right" }) {
  const activeFill = "#A8C027";
  const activeFillOpacity = 0.6;
  const activeStroke = "#C9DB5A";

  const inactiveFill = "#FFFFFF";
  const inactiveFillOpacity = 0.1;
  const inactiveStroke = "#FFFFFF";
  const inactiveStrokeOpacity = 0.75;

  return (
    <svg
      width="72"
      height="65"
      viewBox="0 0 72 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 w-[50px] h-[46px] md:w-[72px] md:h-[65px]"
    >
      {/* Top Circle */}
      <path
        d="M36.0001 43.2872C47.2667 43.2872 56.4001 34.1646 56.4001 22.9113C56.4001 11.658 47.2667 2.5354 36.0001 2.5354C24.7335 2.5354 15.6001 11.658 15.6001 22.9113C15.6001 34.1646 24.7335 43.2872 36.0001 43.2872Z"
        fill={highlight === "top" ? activeFill : inactiveFill}
        fillOpacity={highlight === "top" ? activeFillOpacity : inactiveFillOpacity}
        strokeWidth="1.3"
        stroke={highlight === "top" ? activeStroke : inactiveStroke}
        strokeOpacity={highlight === "top" ? 1 : inactiveStrokeOpacity}
      />
      {/* Bottom-Left Circle */}
      <path
        d="M24.0001 62.4645C35.2667 62.4645 44.4001 53.3419 44.4001 42.0887C44.4001 30.8354 35.2667 21.7128 24.0001 21.7128C12.7335 21.7128 3.6001 30.8354 3.6001 42.0887C3.6001 53.3419 12.7335 62.4645 24.0001 62.4645Z"
        fill={highlight === "bottom-left" ? activeFill : inactiveFill}
        fillOpacity={highlight === "bottom-left" ? activeFillOpacity : inactiveFillOpacity}
        strokeWidth="1.3"
        stroke={highlight === "bottom-left" ? activeStroke : inactiveStroke}
        strokeOpacity={highlight === "bottom-left" ? 1 : inactiveStrokeOpacity}
      />
      {/* Bottom-Right Circle */}
      <path
        d="M48.0001 62.4645C59.2667 62.4645 68.4001 53.3419 68.4001 42.0887C68.4001 30.8354 59.2667 21.7128 48.0001 21.7128C36.7335 21.7128 27.6001 30.8354 27.6001 42.0887C27.6001 53.3419 36.7335 62.4645 48.0001 62.4645Z"
        fill={highlight === "bottom-right" ? activeFill : inactiveFill}
        fillOpacity={highlight === "bottom-right" ? activeFillOpacity : inactiveFillOpacity}
        strokeWidth="1.3"
        stroke={highlight === "bottom-right" ? activeStroke : inactiveStroke}
        strokeOpacity={highlight === "bottom-right" ? 1 : inactiveStrokeOpacity}
      />
    </svg>
  );
}

function JWayLogoHorizontal() {
  return (
    <svg width="136" height="34" viewBox="0 0 136 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_472_1802)">
        <path
          d="M28.8263 11.7481C28.8263 16.3877 26.9907 26.0198 16.0789 25.6672C7.08497 25.296 5.11189 14.0121 8.60838 9.2797C10.6475 6.71423 13.5926 5.05053 16.8221 4.63992C14.3907 4.25689 11.9018 4.69031 9.73727 5.87403C6.98404 7.34951 5.1485 10.987 5.1485 10.987C5.63951 9.21951 6.47588 7.56928 7.60814 6.13393C8.82494 4.86873 10.3001 3.88702 11.9306 3.25726C10.7504 3.38085 9.60097 3.71381 8.53502 4.24096C7.51992 4.70532 6.62934 5.40845 5.93785 6.29168C7.03825 4.47268 8.61788 2.99965 10.4998 2.03754C12.3819 1.07544 14.4916 0.662382 16.5927 0.844634C19.0131 1.13088 21.3547 1.89373 23.4851 3.09032C20.9155 1.07406 17.7522 -0.0145548 14.4997 -0.00184305C11.2472 0.0107155 8.09241 1.12383 5.53827 3.16016C2.98414 5.19633 1.17754 8.03839 0.406417 11.2333C-0.364709 14.4282 -0.0557991 17.7923 1.28368 20.7892C2.62316 23.7862 4.91617 26.2434 7.79728 27.7696C10.6786 29.2956 13.9819 29.8027 17.1813 29.2098C20.3805 28.617 23.2915 26.9583 25.4502 24.4984C27.6089 22.0384 28.8911 18.9185 29.0925 15.6362C29.1713 14.3339 29.0819 13.0267 28.8263 11.7481Z"
          fill="#A8C027"
        />
        <path
          d="M16.8405 22.2707C16.8405 17.6309 18.6761 7.99878 29.5881 8.35149C38.5727 8.68552 40.5459 19.96 37.0584 24.6741C35.0085 27.25 32.0448 28.9148 28.7987 29.3139C31.2274 29.6969 33.7133 29.2633 35.8746 28.0796C38.6278 26.6041 40.4632 22.9666 40.4632 22.9666C39.9936 24.7375 39.1759 26.3943 38.0588 27.8384C36.8269 29.1071 35.3361 30.0888 33.6903 30.7151C34.8694 30.5855 36.0179 30.2529 37.086 29.7314C38.1179 29.2737 39.0248 28.57 39.7291 27.6806C38.6264 29.4996 37.045 30.9725 35.1615 31.9345C33.2782 32.8964 31.1672 33.3096 29.0649 33.1277C26.6451 32.8387 24.3041 32.0758 22.1727 30.882C24.8806 33.0067 28.2419 34.0998 31.667 33.9696C35.0921 33.8392 38.3627 32.4939 40.905 30.1697C43.4475 27.8453 45.0996 24.6902 45.5716 21.2574C46.0436 17.8248 45.3054 14.3337 43.4866 11.396C41.6677 8.45854 38.8842 6.26218 35.6241 5.19209C32.364 4.12201 28.8353 4.24653 25.6569 5.54358C22.4784 6.84079 19.8531 9.22799 18.241 12.2865C16.629 15.3449 16.1331 18.8795 16.8405 22.2707Z"
          fill="#6B6C6E"
        />
        <path
          d="M53.5409 19.6541V18.6333H54.8441V19.6541C54.8418 19.8547 54.8814 20.0535 54.9605 20.2374C55.0395 20.4214 55.1564 20.5861 55.3029 20.7212C55.4457 20.8672 55.6158 20.9825 55.8034 21.0606C55.991 21.1387 56.1923 21.1779 56.3951 21.1759C56.8294 21.183 57.251 21.0277 57.5789 20.7398C57.7411 20.6106 57.8718 20.4455 57.9607 20.2573C58.0499 20.0691 58.0951 19.8628 58.0929 19.6541V12.0635H59.3869V19.6819C59.3877 20.0487 59.3054 20.4109 59.1463 20.7407C58.9872 21.0704 58.7556 21.359 58.4692 21.5842C57.8865 22.0857 57.1418 22.3532 56.3768 22.3359C55.6394 22.3489 54.9257 22.073 54.3852 21.5657C54.1111 21.332 53.8927 21.0387 53.7464 20.7077C53.6002 20.3766 53.53 20.0164 53.5409 19.6541Z"
          fill="#6A6B6D"
        />
        <path
          d="M60.626 12.0635H61.8924L64.0491 19.9325L66.2058 12.0635H67.4816L69.6381 19.9325L71.8132 12.0635H73.0155L70.2622 22.2152H69.0142L66.8391 14.105L64.6916 22.2152H63.416L60.626 12.0635Z"
          fill="#6A6B6D"
        />
        <path
          d="M73.0154 22.1874L76.5762 12.0635H78.3382L81.89 22.2152H80.5317L79.4304 19.1808H75.4749L74.3829 22.2152L73.0154 22.1874ZM75.8695 18.0116H79.0358L77.4573 13.6224L75.8695 18.0116Z"
          fill="#6A6B6D"
        />
        <path
          d="M80.3208 12.0635H81.6791L85.1022 17.0279L88.5713 12.0635H89.9387L85.8181 18.0395V22.2152H84.4324V18.0395L80.3208 12.0635Z"
          fill="#6A6B6D"
        />
        <path
          d="M91.7739 20.5728C90.8616 19.5609 90.3744 18.2297 90.4158 16.8609C90.3802 15.4933 90.8665 14.1642 91.7739 13.1493C92.179 12.669 92.6829 12.284 93.2503 12.021C93.8179 11.7582 94.4353 11.6239 95.0595 11.6274C95.9866 11.6138 96.8902 11.9216 97.6199 12.4996C98.3234 13.0192 98.8004 13.7942 98.9507 14.6618H98.29C98.1534 13.9806 97.7579 13.381 97.1887 12.9914C96.5727 12.5325 95.8245 12.2913 95.0595 12.3048C94.5224 12.3014 93.9914 12.4196 93.5055 12.6509C93.0195 12.8822 92.591 13.2205 92.2512 13.641C91.469 14.5316 91.0494 15.6887 91.0765 16.8796C91.0484 18.0705 91.4682 19.2279 92.2512 20.118C92.591 20.5386 93.0195 20.8769 93.5055 21.1082C93.9914 21.3394 94.5224 21.4577 95.0595 21.4543C95.509 21.4647 95.9556 21.3773 96.369 21.1979C96.7822 21.0187 97.1525 20.7516 97.4548 20.415C98.1028 19.7104 98.4549 18.7789 98.4369 17.8168V17.5383H95.0595V16.8982H98.9507V21.8441H98.4369V19.8119C98.2004 20.496 97.7408 21.0786 97.1337 21.4636C96.5208 21.8801 95.7979 22.1 95.0595 22.0946C94.4353 22.0982 93.8179 21.9638 93.2503 21.701C92.6829 21.4381 92.179 21.053 91.7739 20.5728Z"
          fill="#6A6B6D"
        />
        <path
          d="M101.025 21.8436V11.9424H105.705C106.029 11.94 106.35 12.0075 106.646 12.1403C106.942 12.2731 107.206 12.4682 107.421 12.7127C107.655 12.9594 107.838 13.2505 107.959 13.5691C108.08 13.8876 108.138 14.2273 108.128 14.5686C108.144 15.1496 107.995 15.723 107.697 16.2203C107.582 16.4288 107.425 16.6096 107.235 16.7505C107.045 16.8916 106.826 16.9893 106.596 17.0369C106.828 17.1251 107.038 17.2653 107.21 17.4468C107.381 17.6283 107.51 17.8467 107.587 18.0856C107.852 18.7676 107.98 19.4964 107.963 20.2291C107.945 20.5783 107.945 20.9284 107.963 21.2776C107.965 21.4794 108.008 21.6787 108.092 21.8623H107.431C107.292 21.6436 107.219 21.3891 107.22 21.1292L107.165 19.7095C107.184 19.1011 107.017 18.5017 106.687 17.9928C106.576 17.7843 106.412 17.6093 106.212 17.4854C106.012 17.3616 105.784 17.2933 105.549 17.2875H101.686V21.8623L101.025 21.8436ZM105.614 16.6472C105.865 16.6464 106.114 16.5932 106.345 16.4911C106.575 16.3889 106.782 16.2399 106.953 16.0534C107.313 15.6636 107.507 15.1475 107.495 14.615C107.503 14.0832 107.309 13.5685 106.953 13.1767C106.782 12.9919 106.574 12.8445 106.343 12.7439C106.113 12.6434 105.865 12.5917 105.614 12.5921H101.686V16.6472H105.614Z"
          fill="#6A6B6D"
        />
        <path
          d="M110.881 20.5725C110.044 19.5271 109.622 18.2037 109.698 16.8607C109.629 15.4958 110.049 14.1516 110.881 13.0746C111.283 12.628 111.773 12.2712 112.319 12.0271C112.865 11.7829 113.455 11.6567 114.052 11.6567C114.649 11.6567 115.24 11.7829 115.786 12.0271C116.332 12.2712 116.821 12.628 117.223 13.0746C118.063 14.1482 118.487 15.494 118.416 16.8607C118.494 18.2056 118.068 19.5306 117.223 20.5725C116.817 21.0116 116.326 21.3617 115.781 21.6011C115.235 21.8405 114.647 21.9639 114.052 21.9639C113.458 21.9639 112.87 21.8405 112.324 21.6011C111.779 21.3617 111.288 21.0116 110.881 20.5725ZM116.746 20.127C117.456 19.2086 117.814 18.0621 117.755 16.8978C117.812 15.7053 117.455 14.5304 116.746 13.5757C116.412 13.1835 115.999 12.8686 115.534 12.6528C115.069 12.4371 114.564 12.3253 114.052 12.3253C113.541 12.3253 113.035 12.4371 112.57 12.6528C112.105 12.8686 111.692 13.1835 111.359 13.5757C110.653 14.5316 110.299 15.7064 110.358 16.8978C110.297 18.0608 110.652 19.2073 111.359 20.127C111.698 20.5099 112.113 20.8162 112.577 21.0259C113.041 21.2357 113.544 21.344 114.052 21.344C114.561 21.344 115.063 21.2357 115.527 21.0259C115.992 20.8162 116.407 20.5099 116.746 20.127Z"
          fill="#6A6B6D"
        />
        <path
          d="M121.27 21.0924C120.934 20.7884 120.667 20.4148 120.486 19.9969C120.305 19.5789 120.216 19.1265 120.224 18.6704V11.9429H120.885V18.6704C120.883 19.0495 120.964 19.4242 121.123 19.7676C121.282 20.1111 121.514 20.4145 121.803 20.6564C122.379 21.2008 123.144 21.4941 123.932 21.4728C124.309 21.4794 124.684 21.4106 125.035 21.2705C125.387 21.1304 125.707 20.9218 125.978 20.6564C126.249 20.4041 126.465 20.0967 126.61 19.7546C126.756 19.4125 126.828 19.0429 126.823 18.6704V11.9429H127.483V18.6704C127.489 19.1262 127.399 19.5777 127.218 19.9954C127.038 20.413 126.772 20.7869 126.437 21.0924C126.102 21.4237 125.704 21.6831 125.267 21.8554C124.83 22.0275 124.364 22.1089 123.895 22.0946C122.925 22.1171 121.984 21.7578 121.27 21.0924Z"
          fill="#6A6B6D"
        />
        <path
          d="M129.273 21.8436V11.9424H133.706C134.017 11.9406 134.324 12.0107 134.604 12.1475C134.884 12.2841 135.129 12.4838 135.321 12.7312C135.764 13.2448 136.006 13.9052 136 14.5871C136.016 15.3043 135.775 16.0031 135.321 16.5543C135.133 16.8084 134.89 17.0145 134.609 17.1564C134.329 17.2982 134.019 17.3717 133.706 17.3709H129.934V21.8157L129.273 21.8436ZM133.586 16.7678C133.825 16.7683 134.06 16.7142 134.274 16.6098C134.489 16.5053 134.677 16.3531 134.825 16.1645C135.17 15.7682 135.354 15.2542 135.339 14.7263C135.351 14.1765 135.168 13.6404 134.825 13.2137C134.681 13.0197 134.494 12.8624 134.279 12.7546C134.064 12.6466 133.826 12.5909 133.586 12.5919H129.915V16.7678H133.586Z"
          fill="#6A6B6D"
        />
      </g>
      <defs>
        <clipPath id="clip0_472_1802">
          <rect width="136" height="34" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function NewHomepageClient() {
  // Navigation state
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [activeSubService, setActiveSubService] = useState<string | null>(null);
  const [tabletMenuOpen, setTabletMenuOpen] = useState(false);

  // 02 Our Services state
  const [selectedServiceIdx, setSelectedServiceIdx] = useState<number>(0);

  // 03 Why JWay hover state (Desktop) & carousel slide state (Tablet)
  const [hoveredWhyCard, setHoveredWhyCard] = useState<string | null>(null);
  const [activeWhySlide, setActiveWhySlide] = useState<number>(0);

  // 05 Industries state (Desktop chip field & Tablet modal overlay)
  const [activeIndustryFilter, setActiveIndustryFilter] = useState<IndustryFilter | "All">("All");
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const [tabletOverlayIndustryId, setTabletOverlayIndustryId] = useState<string | null>(null);

  // 07 FAQ Accordion state (item 0 open by default per Figma)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Contact form state & validation
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [discussionNote, setDiscussionNote] = useState("");
  const [formErrors, setFormErrors] = useState<{
    fullName?: string;
    companyName?: string;
    workEmail?: string;
    discussionNote?: string;
    submit?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
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

  // Determine slot position for each card in the 3-card stack:
  const getCardSlot = (cardIdx: number) => {
    return (cardIdx - selectedServiceIdx + 3) % 3;
  };

  // Tablet Why JWay Carousel track offsets per Figma nodes 924:11928–924:12017
  const whyCarouselOffsets = [0, -616, -1232, -1664];

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: {
      fullName?: string;
      companyName?: string;
      workEmail?: string;
      discussionNote?: string;
      submit?: string;
    } = {};

    const trimmedName = fullName.trim();
    if (trimmedName.length < 2 || !/^[\p{L}\s'’\-.,]+$/u.test(trimmedName)) {
      errors.fullName = "Please enter a valid full name (at least 2 characters).";
    }

    const trimmedEmail = workEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.workEmail = "Please enter a valid work email address.";
    }

    if (discussionNote.trim().length > 0 && discussionNote.trim().length < 10) {
      errors.discussionNote = "Please enter at least 10 characters if providing a note.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      let recaptchaToken = "";
      if (recaptchaSiteKey && typeof window !== "undefined" && window.grecaptcha) {
        recaptchaToken = await new Promise<string>((resolve) => {
          window.grecaptcha!.ready(async () => {
            try {
              const token = await window.grecaptcha!.execute(recaptchaSiteKey, {
                action: "contact_submit",
              });
              resolve(token || "");
            } catch {
              resolve("");
            }
          });
        });
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formName: "Homepage Form",
          name: trimmedName,
          company: companyName.trim(),
          email: trimmedEmail,
          subject: "Homepage Inquiry",
          message: discussionNote.trim(),
          recaptchaToken,
        }),
      });
      if (res.ok) {
        setFormSubmitted(true);
      } else {
        const resData = await res.json().catch(() => null);
        setFormErrors({
          submit:
            resData?.error ||
            "Unable to submit your request at this time. Please try again.",
        });
      }
    } catch {
      setFormErrors({
        submit: "Unable to submit your request at this time. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeTabletIndustry = TABLET_INDUSTRY_CARDS.find(
    (card) => card.id === tabletOverlayIndustryId
  );

  return (
    <div className="min-h-screen bg-white text-[#4A4C4E] font-sans antialiased selection:bg-[#A8C027]/20">
      {/* Keyframes for infinite client logo marquee */}
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marqueeLeft 85s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marqueeRight 90s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-left,
          .animate-marquee-right {
            animation: none;
          }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          HEADER (Desktop 472:1864, Tablet 898:1047, Mobile 898:1456 · collapsed nav)
         ══════════════════════════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50 w-full bg-white border-b-0 lg:border-b border-[#E0E6EB] shadow-none lg:shadow-[0_6px_24px_0_rgba(74,76,78,0.08)]"
        onMouseLeave={() => {
          setServicesMenuOpen(false);
          setActiveSubService(null);
        }}
      >
        <div className="max-w-[1440px] mx-auto h-[72px] md:h-[80px] px-[17px] md:px-[25px] lg:px-[128px] flex items-center justify-between">
          {/* Logo / Horizontal (136x34) */}
          <Link href="/" className="shrink-0 flex items-center" aria-label="JWay Group Home">
            <JWayLogoHorizontal />
          </Link>

          {/* Desktop Nav (hidden on mobile and tablet, visible on lg+) */}
          <nav className="hidden lg:flex items-center gap-[40px]">
            <div
              className="relative h-[80px] flex items-center"
              onMouseEnter={() => setServicesMenuOpen(true)}
            >
              <button
                type="button"
                onClick={() => setServicesMenuOpen((prev) => !prev)}
                className={`pt-[6px] pb-[8px] text-[16px] leading-[19.2px] font-medium transition-colors cursor-pointer ${
                  servicesMenuOpen ? "text-[#657317]" : "text-[#4A4C4E] hover:text-[#657317]"
                }`}
              >
                Services
              </button>
            </div>
            <a
              href="#industries"
              className="pt-[6px] pb-[8px] text-[16px] leading-[19.2px] font-medium text-[#4A4C4E] hover:text-[#657317] transition-colors"
            >
              Industries
            </a>
            <a
              href="#why-jway"
              className="pt-[6px] pb-[8px] text-[16px] leading-[19.2px] font-medium text-[#4A4C4E] hover:text-[#657317] transition-colors"
            >
              Who We Are
            </a>
            <Link
              href="/blog"
              className="pt-[6px] pb-[8px] text-[16px] leading-[19.2px] font-medium text-[#4A4C4E] hover:text-[#657317] transition-colors"
            >
              JWay Insights
            </Link>
            <Link
              href="/talents"
              className="pt-[6px] pb-[8px] text-[16px] leading-[19.2px] font-medium text-[#4A4C4E] hover:text-[#657317] transition-colors"
            >
              Careers
            </Link>
          </nav>

          {/* Right Navigation Actions (Mobile 898:1458 gap=12, Tablet 898:1049 gap=24: CTA + 44px Hamburger Menu) */}
          <div className="flex items-center gap-[12px] md:gap-[24px] shrink-0">
            <a
              href="#contact"
              className="h-[44px] w-[132px] md:w-auto px-[14px] md:px-[22px] lg:min-w-[155px] rounded-full bg-[#A8C027] hover:bg-[#96ad21] text-white font-semibold text-[16px] leading-[16px] inline-flex items-center justify-center transition-colors shrink-0 whitespace-nowrap"
            >
              Book a Call →
            </a>

            {/* Mobile & Tablet Hamburger Menu · 44px touch target (Figma node 898:1460 / 898:1051) */}
            <button
              type="button"
              onClick={() => setTabletMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={tabletMenuOpen}
              className="flex lg:hidden flex-col gap-[6px] items-start justify-center px-[10px] py-[13px] size-[44px] shrink-0 cursor-pointer"
            >
              <span className="bg-[#3d4540] h-[2px] w-[24px] rounded-[1px] shrink-0" />
              <span className="bg-[#3d4540] h-[2px] w-[24px] rounded-[1px] shrink-0" />
              <span className="bg-[#3d4540] h-[2px] w-[24px] rounded-[1px] shrink-0" />
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Collapsed Navigation Drawer */}
        {tabletMenuOpen && (
          <div className="block lg:hidden w-full border-t border-[#E0E6EB] bg-white px-[17px] md:px-[25px] py-[24px] shadow-[0_12px_28px_rgba(74,76,78,0.10)]">
            <nav className="flex flex-col gap-[16px]">
              <a
                href="#what-we-do"
                onClick={() => setTabletMenuOpen(false)}
                className="text-[#4A4C4E] hover:text-[#657317] font-medium text-[16px] leading-[24px]"
              >
                Services
              </a>
              <a
                href="#industries"
                onClick={() => setTabletMenuOpen(false)}
                className="text-[#4A4C4E] hover:text-[#657317] font-medium text-[16px] leading-[24px]"
              >
                Industries
              </a>
              <a
                href="#why-jway"
                onClick={() => setTabletMenuOpen(false)}
                className="text-[#4A4C4E] hover:text-[#657317] font-medium text-[16px] leading-[24px]"
              >
                Who We Are
              </a>
              <Link
                href="/blog"
                onClick={() => setTabletMenuOpen(false)}
                className="text-[#4A4C4E] hover:text-[#657317] font-medium text-[16px] leading-[24px]"
              >
                JWay Insights
              </Link>
              <Link
                href="/talents"
                onClick={() => setTabletMenuOpen(false)}
                className="text-[#4A4C4E] hover:text-[#657317] font-medium text-[16px] leading-[24px]"
              >
                Careers
              </Link>
            </nav>
          </div>
        )}

        {/* Desktop Services Overlay Panel (1440x434 @ y=80) */}
        {servicesMenuOpen && (
          <div className="hidden lg:block w-full border-t border-[#E0E6EB] bg-gradient-to-b from-white to-[#F7FAFC] shadow-[0_16px_36px_rgba(74,76,78,0.10)]">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-[128px] py-[33px] min-h-[434px] grid grid-cols-1 md:grid-cols-4 gap-[32px]">
              {SERVICE_COLUMNS.map((col) => (
                <div key={col.title} className="w-full max-w-[259px] flex flex-col">
                  <div className="px-[12px] pb-[12px] mb-[4px]">
                    <span className="text-[#657317] font-semibold text-[18px] leading-[25px]">
                      {col.title}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    {col.items.map((item) => {
                      const isActive = activeSubService === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onMouseEnter={() => setActiveSubService(item)}
                          onClick={() => setActiveSubService(item)}
                          className={`w-full text-left px-[12px] py-[10px] rounded-[10px] flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                            isActive ? "bg-[#F6F9E9]" : "hover:bg-[#F6F9E9]/60"
                          }`}
                        >
                          <span className="text-[#4A4C4E] font-normal text-[15px] leading-[20px]">
                            {item}
                          </span>
                          <span className="text-[#657317] text-[18px] leading-[18px] shrink-0">
                            ›
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Column 4 · Capabilities (Level 3) */}
              <div className="w-full max-w-[311px] pl-[16px] border-l border-[#E0E6EB]">
                {activeSubService && CAPABILITIES_BY_SUBSERVICE[activeSubService] ? (
                  <div className="flex flex-col gap-[12px]">
                    <h4 className="text-[#4A4C4E] font-semibold text-[16px] leading-[24px]">
                      {activeSubService}
                    </h4>
                    <div className="flex flex-col gap-[10px]">
                      {CAPABILITIES_BY_SUBSERVICE[activeSubService].map((cap) => (
                        <div key={cap.title} className="flex flex-col gap-[2px]">
                          <span className="text-[#657317] font-semibold text-[14px] leading-[17px]">
                            {cap.title}
                          </span>
                          <span className="text-[#6D6E6A] font-normal text-[13px] leading-[19px]">
                            {cap.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center text-[#8A8B88] text-[14px]">
                    Hover a service to explore capabilities
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ══════════════════════════════════════════════════════════════════════
            01 HERO AND CLIENTS (Desktop 472:1552, Tablet 898:1055+1075, Mobile 898:1464+1484)
           ══════════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full overflow-hidden bg-white">
          {/* ── Section / Hero (Desktop 748:8013 · 1440x568 | Tablet 898:1055 · pt=80 pb=56 px=25 | Mobile 898:1464 · pt=56 pb=48 px=17) ── */}
          <div className="relative w-full min-h-0 lg:min-h-[568px] pt-[56px] md:pt-[80px] lg:pt-[112px] pb-[48px] md:pb-[56px] lg:pb-[24px] px-[17px] md:px-[25px] lg:px-[128px] flex flex-col items-center">
            {/* Background · Horizon wash + hero-light image + gradients (full viewport width stretch) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" aria-hidden="true">
              <div className="relative w-full h-full">
                {/* Blurred color ellipses stretched proportionally across full width */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: "67vw",
                    height: 467,
                    left: "57%",
                    top: 247,
                    background: "rgba(184, 209, 61, 0.15)",
                    filter: "blur(110px)",
                  }}
                />
                <div
                  className="absolute rounded-full"
                  style={{
                    width: "46vw",
                    height: 440,
                    left: "-5%",
                    top: -56,
                    background: "rgba(194, 218, 239, 0.55)",
                    filter: "blur(180px)",
                  }}
                />
                <div
                  className="absolute rounded-full"
                  style={{
                    width: "43vw",
                    height: 420,
                    left: "-14%",
                    top: 336,
                    background: "rgba(199, 219, 92, 0.75)",
                    filter: "blur(140px)",
                  }}
                />
                <div
                  className="absolute rounded-full"
                  style={{
                    width: "57vw",
                    height: 460,
                    left: "69%",
                    top: -220,
                    background: "rgba(171, 201, 226, 0.70)",
                    filter: "blur(120px)",
                  }}
                />
                <div
                  className="absolute rounded-full"
                  style={{
                    width: "68vw",
                    height: 320,
                    left: "16.6%",
                    top: -28,
                    background: "rgba(192, 207, 118, 0.37)",
                    filter: "blur(100px)",
                  }}
                />
                <div
                  className="absolute rounded-full"
                  style={{
                    width: "57vw",
                    height: 320,
                    left: "21.5%",
                    top: 110,
                    background: "rgba(255, 255, 255, 0.40)",
                    filter: "blur(120px)",
                  }}
                />
              </div>

              {/* Background image (hero-light) flipped horizontally on Mobile & Tablet per Figma 898:1472 / 898:1063 */}
              <img
                src={getMediaUrl("/new-homepage/hero-light.png")}
                alt=""
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply -scale-x-100 lg:scale-x-100"
              />

              {/* Left white wash (opacity 0.5 per Figma 472:1555 / 898:1064 / 898:1473) */}
              <div
                className="absolute inset-0 w-full h-full opacity-50"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.80) 38%, rgba(255,255,255,0.00) 70%)",
                }}
              />

              {/* Fade into Trusted by */}
              <div
                className="absolute bottom-0 left-0 right-0 w-full h-[150px]"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 100%)",
                }}
              />
            </div>

            {/* Hero Copy (Mobile 898:1475: 368px gap=32 | Tablet 898:1066: 784px gap=40 | Desktop: 840px gap=48) */}
            <div className="relative z-10 w-full max-w-[368px] md:max-w-[784px] lg:max-w-[840px] flex flex-col items-center gap-[32px] md:gap-[40px] lg:gap-[48px]">
              {/* Headline + body (Mobile 898:1476: gap=24 | Tablet/Desktop: gap=26) */}
              <div className="w-full flex flex-col items-center gap-[24px] md:gap-[26px]">
                {/* Eyebrow (gap=10) */}
                <div className="inline-flex items-center gap-[10px]">
                  <span className="w-[24px] h-[3px] rounded-[3px] bg-[#657317] shrink-0" />
                  <span className="text-[#657317] font-semibold text-[16px] md:text-[20px] leading-[1.2] md:leading-[24px] tracking-[1.28px] md:tracking-[1.6px] uppercase">
                    30+ Years of Experience
                  </span>
                </div>

                {/* Headline (Mobile 898:1478: 40px, lh=1.05, ls=-1px, w=368px | Tablet 898:1069: 56px, lh=1.12, ls=-1.4px, w=720px | Desktop: 72px, lh=75.6px, ls=-1.8px) */}
                <h1 className="text-[#4A4C4E] font-semibold text-[40px] md:text-[56px] lg:text-[72px] leading-[1.05] md:leading-[1.12] lg:leading-[75.6px] tracking-[-1px] md:tracking-[-1.4px] lg:tracking-[-1.8px] text-center max-w-[368px] md:max-w-[720px] lg:max-w-[840px]">
                  Build smarter. Apply AI. Put talent to work.
                </h1>

                {/* Body (Mobile 898:1479: 18px, lh=1.6, w=368px | Tablet/Desktop: 20px, lh=32px, w=784px) */}
                <p className="text-[#4A4C4E] font-normal text-[18px] md:text-[20px] leading-[1.6] md:leading-[32px] text-center max-w-[368px] md:max-w-[784px]">
                  From designing and engineering digital platforms to introducing AI into
                  everyday operations and deploying specialized technology professionals, we
                  bring the expertise to turn ambitious plans into working technology.
                </p>
              </div>

              {/* Actions (Mobile 898:1480: col gap=12 w=368px | Tablet 898:1071: row gap=24 | Desktop: row gap=32) */}
              <div className="w-full max-w-[368px] md:max-w-none flex flex-col md:flex-row flex-wrap items-center justify-center gap-[12px] md:gap-[24px] lg:gap-[32px]">
                {/* CTA · Book a Call (Mobile 898:1482: 368x56 | Tablet/Desktop: 174x60) */}
                <a
                  href="#contact"
                  className="w-full md:w-auto h-[56px] md:h-[60px] px-[36px] md:min-w-[174px] rounded-full bg-[#A8C027] hover:bg-[#96ad21] text-white font-semibold text-[18px] leading-[18px] inline-flex items-center justify-center transition-colors"
                >
                  Book a Call
                </a>

                {/* Button · See the Blueprint (Mobile 898:1483: 368x56 1px #DCE6A9 | Tablet 898:842: 251x60 1px #DCE6A9 | Desktop: 2px #A8C027) */}
                <a
                  href="#what-we-do"
                  className="w-full md:w-auto h-[56px] md:h-[60px] px-[36px] md:min-w-[251px] rounded-full bg-[#F6F9E9] hover:bg-[#edf3d0] border border-[#DCE6A9] lg:border-2 lg:border-[#A8C027] text-[#434D10] font-semibold text-[18px] leading-[18px] inline-flex items-center justify-center transition-colors"
                >
                  See the Blueprint →
                </a>
              </div>
            </div>
          </div>

          {/* ── Section / Client Logo Marquee (Desktop 748:8011 | Tablet 898:1075: pt=24 pb=56 px=25 gap=28 | Mobile 898:1484: pt=24 pb=40 px=17 gap=28) ── */}
          <div className="relative z-10 w-full pt-[24px] lg:pt-[48px] pb-[40px] md:pb-[56px] lg:pb-[96px] px-[17px] md:px-[25px] lg:px-0 flex flex-col items-center gap-[28px] lg:gap-[48px] overflow-hidden">
            {/* Title (20px, lh=24px, ls=-0.2px, weight=600, #869A1F) */}
            <h2 className="text-[#869A1F] font-semibold text-[20px] leading-[24px] tracking-[-0.2px] text-center max-w-[368px] md:max-w-none">
              Trusted by leading global businesses.
            </h2>

            {/* Desktop Logo rows (gap=48) */}
            <div className="relative w-full hidden lg:flex flex-col gap-[48px] overflow-hidden">
              {/* Edge fade left (144x278) */}
              <div
                className="pointer-events-none absolute left-0 top-0 bottom-0 w-[144px] z-10"
                style={{
                  background: "linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)",
                }}
              />
              {/* Edge fade right (144x278) */}
              <div
                className="pointer-events-none absolute right-0 top-0 bottom-0 w-[144px] z-10"
                style={{
                  background: "linear-gradient(270deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)",
                }}
              />

              {/* Row A · scrolls left (h=56, gap=96) */}
              <div className="w-full h-[56px] flex items-center overflow-hidden">
                <div className="animate-marquee-left items-center">
                  {[...ROW_A_LOGOS, ...ROW_A_LOGOS, ...ROW_A_LOGOS, ...ROW_A_LOGOS].map(
                    (logo, idx) => (
                      <div
                        key={`row-a-${idx}`}
                        className="mr-[96px] shrink-0 flex items-center justify-center"
                        style={{ width: logo.width, height: logo.height }}
                      >
                        <img
                          src={logo.src}
                          alt={logo.name}
                          width={logo.width}
                          height={logo.height}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Row B · scrolls right (h=56, gap=96) */}
              <div className="w-full h-[56px] flex items-center overflow-hidden">
                <div className="animate-marquee-right items-center">
                  {[...ROW_B_LOGOS, ...ROW_B_LOGOS, ...ROW_B_LOGOS, ...ROW_B_LOGOS].map(
                    (logo, idx) => (
                      <div
                        key={`row-b-${idx}`}
                        className="mr-[96px] shrink-0 flex items-center justify-center"
                        style={{ width: logo.width, height: logo.height }}
                      >
                        <img
                          src={logo.src}
                          alt={logo.name}
                          width={logo.width}
                          height={logo.height}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Tablet Logo rows (Figma node 898:1077 · gap=24, row h=52, 0.8x logo dimensions, gap=76.8px) */}
            <div className="hidden md:flex lg:hidden w-full max-w-[784px] flex-col gap-[24px] items-center overflow-hidden">
              {/* Row A · scrolls left (h=52, gap=76.8) */}
              <div className="w-full h-[52px] flex items-center overflow-hidden">
                <div className="animate-marquee-left items-center">
                  {[
                    ...TABLET_ROW_A_LOGOS,
                    ...TABLET_ROW_A_LOGOS,
                    ...TABLET_ROW_A_LOGOS,
                    ...TABLET_ROW_A_LOGOS,
                  ].map((logo, idx) => (
                    <div
                      key={`tablet-row-a-${idx}`}
                      className="mr-[76.8px] shrink-0 flex items-center justify-center"
                      style={{ width: logo.width, height: logo.height }}
                    >
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row B · scrolls right (h=52, gap=76.8) */}
              <div className="w-full h-[52px] flex items-center overflow-hidden">
                <div className="animate-marquee-right items-center">
                  {[
                    ...TABLET_ROW_B_LOGOS,
                    ...TABLET_ROW_B_LOGOS,
                    ...TABLET_ROW_B_LOGOS,
                    ...TABLET_ROW_B_LOGOS,
                  ].map((logo, idx) => (
                    <div
                      key={`tablet-row-b-${idx}`}
                      className="mr-[76.8px] shrink-0 flex items-center justify-center"
                      style={{ width: logo.width, height: logo.height }}
                    >
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Logo rows (Figma node 898:1486 · gap=24, row h=42, 0.65x logo dimensions, gap=62.4px) */}
            <div className="flex md:hidden w-full max-w-[368px] flex-col gap-[24px] items-center overflow-hidden">
              {/* Row A · scrolls left (h=42, gap=62.4) */}
              <div className="w-full h-[42px] flex items-center overflow-hidden">
                <div className="animate-marquee-left items-center">
                  {[
                    ...MOBILE_ROW_A_LOGOS,
                    ...MOBILE_ROW_A_LOGOS,
                    ...MOBILE_ROW_A_LOGOS,
                    ...MOBILE_ROW_A_LOGOS,
                  ].map((logo, idx) => (
                    <div
                      key={`mobile-row-a-${idx}`}
                      className="mr-[62.4px] shrink-0 flex items-center justify-center"
                      style={{ width: logo.width, height: logo.height }}
                    >
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row B · scrolls right (h=42, gap=62.4) */}
              <div className="w-full h-[42px] flex items-center overflow-hidden">
                <div className="animate-marquee-right items-center">
                  {[
                    ...MOBILE_ROW_B_LOGOS,
                    ...MOBILE_ROW_B_LOGOS,
                    ...MOBILE_ROW_B_LOGOS,
                    ...MOBILE_ROW_B_LOGOS,
                  ].map((logo, idx) => (
                    <div
                      key={`mobile-row-b-${idx}`}
                      className="mr-[62.4px] shrink-0 flex items-center justify-center"
                      style={{ width: logo.width, height: logo.height }}
                    >
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            02 OUR SERVICES · "WHAT WE DO"
            Desktop: Figma node 472:1586 (2-column + 3-card stack)
            Tablet:  Figma node 924:13198 (Alt / What We Do / Tablet · Collapsible tabs)
            Mobile:  Figma node 956:3466  (Alt / What We Do / Mobile · Accordion)
           ══════════════════════════════════════════════════════════════════════ */}
        <section
          id="what-we-do"
          className="w-full"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #F7FAFC 100%)",
          }}
        >
          {/* Desktop View (lg+) */}
          <div className="max-w-[1440px] mx-auto py-[80px] px-6 lg:px-[128px] lg:min-h-[964px] hidden lg:flex flex-col lg:flex-row items-start justify-between gap-[56px]">
            {/* Left · Stage (564x565 | gap=72) */}
            <div className="w-full lg:w-[564px] flex flex-col gap-[72px] shrink-0">
              {/* Section head (600x141 | gap=16) */}
              <div className="w-full lg:w-[600px] flex flex-col gap-[16px]">
                {/* Eyebrow (gap=10) */}
                <div className="inline-flex items-center gap-[10px]">
                  <span className="w-[24px] h-[3px] rounded-[3px] bg-[#657317] shrink-0" />
                  <span className="text-[#657317] font-semibold text-[16px] leading-[19.2px] tracking-[1.28px] uppercase">
                    What We Do
                  </span>
                </div>

                {/* Title (48px, lh=52.8px, ls=-0.48px, weight=600) */}
                <h2 className="font-semibold text-[36px] sm:text-[48px] leading-[1.1] sm:leading-[52.8px] tracking-[-0.48px]">
                  <span className="text-[#4A4C4E] block">Three core strengths.</span>
                  <span className="text-[#A8C027] block">One connected vision.</span>
                </h2>
              </div>

              {/* List + CTA (505x352 | gap=48) */}
              <div className="w-full max-w-[505px] flex flex-col gap-[48px]">
                {/* Service list (505x250 | stroke=1px #E0E6EB) */}
                <div className="w-full border-t border-b border-[#E0E6EB] divide-y divide-[#E0E6EB]">
                  {SERVICES_DATA.map((service, idx) => {
                    const isSelected = selectedServiceIdx === idx;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setSelectedServiceIdx(idx)}
                        className={`relative w-full h-[83px] py-[26px] flex items-center text-left transition-all cursor-pointer ${
                          isSelected ? "pl-[30px]" : "pl-[22px] hover:pl-[26px]"
                        }`}
                      >
                        {/* Active green vertical rail (3x55 @ left=0, top=14) */}
                        {isSelected && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55px] rounded-[3px] bg-[#A8C027]" />
                        )}
                        <span
                          className={`font-semibold text-[22px] sm:text-[24px] leading-[30px] transition-colors ${
                            isSelected ? "text-[#4A4C4E]" : "text-[#8A8B88] hover:text-[#4A4C4E]"
                          }`}
                        >
                          {service.tabName}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Detail Button (245x54 | r=100 | #A8C027) */}
                <div>
                  <Link
                    href="/services"
                    className="h-[54px] px-[30px] min-w-[245px] rounded-full bg-[#A8C027] hover:bg-[#96ad21] text-white font-semibold text-[16px] leading-[16px] inline-flex items-center justify-center transition-colors"
                  >
                    Explore Our Services →
                  </Link>
                </div>
              </div>
            </div>

            {/* Right · Cards (564x804 | pad=[152,0,152,0]) */}
            <div className="w-full lg:w-[564px] lg:py-[152px] flex items-center justify-center shrink-0">
              {/* Card stack (564x500) */}
              <div className="relative w-full max-w-[564px] h-[440px] sm:h-[500px]">
                {SERVICES_DATA.map((card, idx) => {
                  const slot = getCardSlot(idx);
                  const slotStyles = [
                    {
                      left: "0px",
                      top: "64px",
                      width: "min(100%, 543px)",
                      height: "436px",
                      borderRadius: "28px",
                      zIndex: 30,
                      boxShadow: "0px 24px 60px 0px rgba(74, 76, 78, 0.12)",
                      padding: "32px 30px 30px 30px",
                      isFront: true,
                    },
                    {
                      left: "45.6px",
                      top: "32px",
                      width: "min(calc(100% - 45.6px), 516px)",
                      height: "414px",
                      borderRadius: "26.6px",
                      zIndex: 20,
                      boxShadow: "0px 9.5px 28.5px 0px rgba(74, 76, 78, 0.07)",
                      padding: "30.4px 34.2px",
                      isFront: false,
                    },
                    {
                      left: "91.2px",
                      top: "0px",
                      width: "min(calc(100% - 91.2px), 489px)",
                      height: "392px",
                      borderRadius: "25.2px",
                      zIndex: 10,
                      boxShadow: "0px 9px 27px 0px rgba(74, 76, 78, 0.07)",
                      padding: "28.8px 32.4px",
                      isFront: false,
                    },
                  ][slot];

                  return (
                    <div
                      key={card.id}
                      onClick={() => {
                        if (!slotStyles.isFront) setSelectedServiceIdx(idx);
                      }}
                      style={{
                        left: slotStyles.left,
                        top: slotStyles.top,
                        width: slotStyles.width,
                        height: slotStyles.height,
                        borderRadius: slotStyles.borderRadius,
                        zIndex: slotStyles.zIndex,
                        boxShadow: slotStyles.boxShadow,
                        padding: slotStyles.padding,
                        background: card.bgFallback,
                      }}
                      className={`absolute overflow-hidden border border-[#E0E6EB] flex flex-col justify-between transition-all duration-500 ease-out ${
                        !slotStyles.isFront ? "cursor-pointer" : ""
                      }`}
                    >
                      {/* Background Photo */}
                      <img
                        src={card.image}
                        alt={card.tabName}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />

                      {/* Dark bottom gradient: rgba(15, 15, 16, 0.00)@30% -> rgba(15, 15, 16, 0.70)@100% */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(15, 15, 16, 0.00) 30%, rgba(15, 15, 16, 0.70) 100%)",
                        }}
                      />

                      {/* Top Spacer (Number badge has opacity=0 in Figma) */}
                      <div className="opacity-0 pointer-events-none select-none">
                        <span className="inline-block px-[11px] py-[5px] rounded-full bg-[#A8C027] text-[#657317] font-semibold text-[14px] leading-[16.8px]">
                          {card.num}
                        </span>
                      </div>

                      {/* Bottom Overlay · Venn + title */}
                      <div className="relative z-10 flex items-center gap-[18px]">
                        <VennIcon highlight={card.vennHighlight} />
                        <p className="text-white font-normal text-[15px] sm:text-[16px] leading-[25.6px] max-w-[391px]">
                          {card.description}
                        </p>
                      </div>

                      {/* Behind overlay on non-front cards: rgba(247, 250, 252, 0.62) */}
                      <div
                        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                          slotStyles.isFront ? "opacity-0" : "opacity-100"
                        }`}
                        style={{ backgroundColor: "rgba(247, 250, 252, 0.62)" }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile & Tablet View · Collapsible Tabs / Accordion (Mobile 956:3466 / Tablet 924:13198) */}
          <div className="flex lg:hidden w-full px-[17px] md:px-[25px] py-[56px] md:py-[64px] flex-col items-start">
            <div className="w-full max-w-[368px] md:max-w-none mx-auto flex flex-col gap-[32px] items-start">
              {/* Section head (Mobile 924:12412 / Tablet 924:13141) */}
              <div className="w-full flex flex-col gap-[16px] items-start">
                <div className="inline-flex items-center gap-[10px]">
                  <span className="w-[24px] h-[3px] rounded-[3px] bg-[#657317] shrink-0" />
                  <span className="text-[#657317] font-semibold text-[14px] md:text-[16px] leading-[1.2] md:leading-[19.2px] tracking-[1.12px] md:tracking-[1.28px] uppercase">
                    What We Do
                  </span>
                </div>

                {/* Heading (Mobile 924:12414: 36px, lh=1.1, ls=-0.36px | Tablet 924:13143: 40px, lh=1.1, ls=-0.4px) */}
                <h2 className="font-semibold text-[36px] md:text-[40px] leading-[1.1] tracking-[-0.36px] md:tracking-[-0.4px] w-full">
                  <span className="text-[#4A4C4E]">Three core strengths.</span>{" "}
                  <span className="text-[#A8C027]">One connected vision.</span>
                </h2>
              </div>

              {/* List + CTA (Mobile 924:12415 / Tablet 924:13144) */}
              <div className="w-full flex flex-col gap-[32px] items-start">
                {/* Accordion (Mobile 924:12416 / Tablet 924:13145) */}
                <div className="w-full border-t border-[#E0E6EB] flex flex-col items-start">
                  {SERVICES_DATA.map((service, idx) => {
                    const isSelected = selectedServiceIdx === idx;
                    return (
                      <div
                        key={`tablet-service-${service.id}`}
                        className={`w-full flex flex-col items-start ${
                          isSelected ? "py-[16px]" : ""
                        }`}
                      >
                        {isSelected ? (
                          <div
                            className="relative w-full h-[300px] md:h-[420px] rounded-[20px] md:rounded-[24px] border border-[#E0E6EB] p-[20px] md:p-[28px] flex flex-col justify-between overflow-hidden shadow-[0px_24px_60px_0px_rgba(74,76,78,0.12)]"
                            style={{ background: service.bgFallback }}
                          >
                            {/* Background Photo */}
                            <img
                              src={service.image}
                              alt={service.tabName}
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            />
                            {/* Bottom dark gradient */}
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background:
                                  "linear-gradient(180deg, rgba(15, 15, 16, 0) 30%, rgba(15, 15, 16, 0.7) 100%)",
                              }}
                            />
                            {/* Top dark gradient (Behind overlay 924:12420 / 924:13149) */}
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background:
                                  "linear-gradient(180deg, rgba(15, 15, 16, 0.6) 0%, rgba(15, 15, 16, 0) 45%)",
                              }}
                            />

                            {/* Top Card Title (Mobile 24px / Tablet 30px SemiBold white) */}
                            <h3 className="relative z-10 text-white font-semibold text-[24px] md:text-[30px] leading-normal">
                              {service.tabName}
                            </h3>

                            {/* Bottom Overlay · Venn + description (Mobile 16px / Tablet 18px Regular white) */}
                            <div className="relative z-10 w-full flex items-center gap-[11.75px]">
                              <VennIcon highlight={service.vennHighlight} />
                              <p className="text-white font-normal text-[16px] md:text-[18px] leading-[1.6] flex-1">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedServiceIdx(idx)}
                            className="w-full border-b border-[#E0E6EB] py-[26px] pl-[22px] flex items-baseline text-left cursor-pointer"
                          >
                            <span className="text-[#8A8B88] hover:text-[#4A4C4E] font-semibold text-[20px] md:text-[24px] leading-[1.25] transition-colors">
                              {service.tabName}
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Detail CTA (Mobile 924:12457 / Tablet 924:13186) */}
                <div>
                  <Link
                    href="/services"
                    className="h-[54px] px-[30px] rounded-full bg-[#A8C027] hover:bg-[#96ad21] text-white font-semibold text-[16px] leading-[16px] inline-flex items-center justify-center transition-colors"
                  >
                    Explore Our Services →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            03 WHY JWAY
            Desktop: Figma node 472:1629 (4-card hover accordion)
            Tablet:  Figma node 924:11928 (Alt / Why JWay / Tablet · Carousel)
            Mobile:  Figma node 956:3835  (Alt / Why JWay / Mobile · Stacked strips option B)
           ══════════════════════════════════════════════════════════════════════ */}
        <section id="why-jway" className="relative w-full overflow-hidden bg-[#F7FAFC]">
          {/* Background image (wave-light) stretched 100% full width */}
          <img
            src={getMediaUrl("/new-homepage/wave-light.png")}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Desktop View (lg+) */}
          <div className="relative z-10 max-w-[1440px] mx-auto py-[80px] px-6 lg:px-[128px] lg:min-h-[859px] hidden lg:flex flex-col gap-[48px]">
            {/* Copy (783x231 | gap=24) */}
            <div className="w-full max-w-[783px] flex flex-col gap-[24px]">
              {/* Heading (gap=18) */}
              <div className="flex flex-col gap-[18px]">
                {/* Eyebrow (gap=10) */}
                <div className="inline-flex items-center gap-[10px]">
                  <span className="w-[24px] h-[3px] rounded-[3px] bg-[#657317] shrink-0" />
                  <span className="text-[#657317] font-semibold text-[16px] leading-[19.2px] tracking-[1.28px] uppercase">
                    Why JWay
                  </span>
                </div>

                {/* Title (48px, lh=52.8px, ls=-0.48px, weight=600) */}
                <h2 className="font-semibold text-[36px] sm:text-[48px] leading-[1.1] sm:leading-[52.8px] tracking-[-0.48px] text-[#4A4C4E]">
                  The future of your business needs{" "}
                  <span className="text-[#A8C027]">builders.</span>
                </h2>
              </div>

              {/* Paragraph (20px, lh=32px, weight=400, #4A4C4E) */}
              <p className="text-[#4A4C4E] font-normal text-[18px] sm:text-[20px] leading-[32px]">
                JWay brings them together, from the first plan to the workflows your teams use
                every day.
              </p>
            </div>

            {/* Why JWay Cards (1184x420 | gap=16 | hover accordion 472px vs 221px) */}
            <div
              className="w-full flex flex-col lg:flex-row gap-[16px]"
              onMouseLeave={() => setHoveredWhyCard(null)}
            >
              {WHY_JWAY_CARDS.map((card) => {
                const isHovered = hoveredWhyCard === card.id;
                const flexGrow =
                  hoveredWhyCard === null ? 284 : isHovered ? 472 : 221;

                return (
                  <div
                    key={card.id}
                    onMouseEnter={() => setHoveredWhyCard(card.id)}
                    onClick={() =>
                      setHoveredWhyCard((prev) => (prev === card.id ? null : card.id))
                    }
                    style={{ flex: `${flexGrow} 1 0%` }}
                    className="relative h-[420px] rounded-[20px] border border-[#E0E6EB] bg-white overflow-hidden px-[26px] py-[24px] flex flex-col justify-end transition-all duration-500 ease-out cursor-pointer"
                  >
                    {/* Card Background Photo */}
                    <img
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />

                    {/* Decorative Top-Right Ring (110x110 @ top=-40, right=-39) */}
                    <div
                      className="pointer-events-none absolute -top-[40px] -right-[39px] w-[110px] h-[110px] rounded-full border-2"
                      style={{ borderColor: card.ringColor }}
                    />

                    {/* Bottom Text Overlay Gradient (h=170px, rgba(255,255,255,0)@0% -> rgba(0,0,0,0.50)@70%) */}
                    <div
                      className="pointer-events-none absolute bottom-0 left-0 right-0 h-[170px]"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(0, 0, 0, 0.50) 70%)",
                      }}
                    />

                    {/* Card Text Content */}
                    <div className="relative z-10 flex flex-col">
                      <h3 className="text-[#DCE6A9] font-semibold text-[24px] leading-[30px]">
                        {card.title}
                      </h3>
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-out ${
                          isHovered ? "max-h-[110px] opacity-100 mt-[8px]" : "max-h-0 opacity-0 mt-0"
                        }`}
                      >
                        <p className="text-white font-normal text-[16px] leading-[25.6px] max-w-[380px]">
                          {card.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tablet View · Carousel (Figma node 924:11928) */}
          <div className="relative z-10 hidden md:flex lg:hidden w-full px-[25px] py-[64px] flex-col gap-[40px] items-start overflow-hidden">
            {/* Copy (924:11850) */}
            <div className="w-full max-w-[784px] flex flex-col gap-[24px] items-start">
              <div className="w-full flex flex-col gap-[18px] items-start">
                <div className="inline-flex items-center gap-[10px]">
                  <span className="w-[24px] h-[3px] rounded-[3px] bg-[#657317] shrink-0" />
                  <span className="text-[#657317] font-semibold text-[16px] leading-[19.2px] tracking-[1.28px] uppercase">
                    Why JWay
                  </span>
                </div>

                {/* Title (40px, lh=1.12, ls=-0.4px per 924:11853) */}
                <h2 className="font-semibold text-[40px] leading-[1.12] tracking-[-0.4px] text-[#4A4C4E] w-full">
                  The future of your business needs{" "}
                  <span className="text-[#A8C027]">builders.</span>
                </h2>
              </div>

              <p className="text-[#4A4C4E] font-normal text-[20px] leading-[1.6] w-full">
                JWay brings them together, from the first plan to the workflows your teams use
                every day.
              </p>
            </div>

            {/* Carousel viewport (924:11855 · h=420) */}
            <div className="relative w-full h-[420px] overflow-hidden">
              <div
                className="absolute top-0 left-0 h-[420px] flex gap-[16px] items-start transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(${whyCarouselOffsets[activeWhySlide] ?? 0}px)`,
                }}
              >
                {WHY_JWAY_CARDS.map((card, idx) => {
                  const isActive = activeWhySlide === idx;
                  return (
                    <div
                      key={`tablet-why-${card.id}`}
                      onClick={() => setActiveWhySlide(idx)}
                      className="relative w-[600px] h-[420px] shrink-0 rounded-[20px] border border-[#E0E6EB] bg-white overflow-hidden p-[24px] flex flex-col justify-end cursor-pointer"
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-[20px]"
                      />

                      {/* Decorative Top-Right Ring (110x110 @ top=-41, right=-42 per 924:11859) */}
                      <div
                        className="pointer-events-none absolute -top-[41px] -right-[42px] w-[110px] h-[110px] rounded-full border-2"
                        style={{ borderColor: card.ringColor }}
                      />

                      {/* Bottom Text Overlay Gradient (h=260px @ top=159 per 924:11857) */}
                      <div
                        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[260px]"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(0, 0, 0, 0.50) 70%)",
                        }}
                      />

                      <div className="relative z-10 flex flex-col items-start w-full">
                        <h3 className="text-[#DCE6A9] font-semibold text-[24px] leading-[1.25]">
                          {card.title}
                        </h3>
                        <div
                          className={`w-full overflow-hidden transition-all duration-300 ${
                            isActive ? "pt-[8px] opacity-100 max-h-[100px]" : "h-0 opacity-0 max-h-0"
                          }`}
                        >
                          <p className="text-white font-normal text-[16px] leading-[1.6] w-full">
                            {card.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls (924:11917 · Dots + Arrows) */}
            <div className="w-full flex items-center justify-between">
              {/* Dots (924:11918) */}
              <div className="flex items-center gap-[8px] h-[8px]">
                {WHY_JWAY_CARDS.map((card, idx) => {
                  const isActive = activeWhySlide === idx;
                  return (
                    <button
                      key={`why-dot-${card.id}`}
                      type="button"
                      aria-label={`Go to slide ${idx + 1}`}
                      onClick={() => setActiveWhySlide(idx)}
                      className={`h-[8px] rounded-[4px] transition-all cursor-pointer ${
                        isActive ? "w-[28px] bg-[#657317]" : "w-[8px] bg-[#E0E6EB]"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Arrows (924:11919) */}
              <div className="flex items-center gap-[12px] h-[48px]">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() =>
                    setActiveWhySlide((prev) => (prev - 1 + WHY_JWAY_CARDS.length) % WHY_JWAY_CARDS.length)
                  }
                  className="size-[48px] rounded-[24px] bg-white border border-[#E0E6EB] hover:border-[#A8C027] flex items-center justify-center text-[20px] text-[#4A4C4E] transition-colors cursor-pointer"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() =>
                    setActiveWhySlide((prev) => (prev + 1) % WHY_JWAY_CARDS.length)
                  }
                  className="size-[48px] rounded-[24px] bg-white border border-[#E0E6EB] hover:border-[#A8C027] flex items-center justify-center text-[20px] text-[#4A4C4E] transition-colors cursor-pointer"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Mobile View · Stacked strips option B (Figma node 956:3835 / 925:17346–925:17411) */}
          <div className="relative z-10 flex md:hidden w-full px-[17px] py-[56px] flex-col items-start">
            <div className="w-full max-w-[368px] mx-auto flex flex-col gap-[32px] items-start">
              {/* Copy (925:17326) */}
              <div className="w-full flex flex-col gap-[24px] items-start">
                <div className="w-full flex flex-col gap-[18px] items-start">
                  <div className="inline-flex items-center gap-[10px]">
                    <span className="w-[24px] h-[3px] rounded-[3px] bg-[#657317] shrink-0" />
                    <span className="text-[#657317] font-semibold text-[14px] leading-[1.2] tracking-[1.12px] uppercase">
                      Why JWay
                    </span>
                  </div>

                  {/* Title (36px, lh=1.12, ls=-0.36px per 925:17329) */}
                  <h2 className="font-semibold text-[36px] leading-[1.12] tracking-[-0.36px] text-[#4A4C4E] w-full">
                    The future of your business needs{" "}
                    <span className="text-[#A8C027]">builders.</span>
                  </h2>
                </div>

                {/* Paragraph (18px, lh=1.6 per 925:17330) */}
                <p className="text-[#4A4C4E] font-normal text-[18px] leading-[1.6] w-full">
                  JWay brings them together, from the first plan to the workflows your teams use
                  every day.
                </p>
              </div>

              {/* Stacked Strips (925:17331 · gap=12) */}
              <div className="w-full flex flex-col gap-[12px] items-start">
                {WHY_JWAY_CARDS.map((card, idx) => {
                  const isActive = activeWhySlide === idx;
                  const ringSvg =
                    idx % 2 === 0
                      ? "/icons/why-jway-ring-1.svg"
                      : "/icons/why-jway-ring-2.svg";
                  return (
                    <div
                      key={`mobile-why-${card.id}`}
                      onClick={() => setActiveWhySlide(idx)}
                      className={`relative w-full ${
                        isActive ? "h-[340px]" : "h-[96px]"
                      } rounded-[20px] border border-[#E0E6EB] bg-white overflow-hidden p-[20px] flex flex-col justify-end transition-all duration-300 ease-out cursor-pointer`}
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-[20px]"
                      />

                      {/* Decorative Top-Right Ring (110x110 @ top=-41, right=-43 per 925:17335) */}
                      <div className="pointer-events-none absolute -top-[41px] -right-[43px] size-[110px]">
                        <img
                          src={ringSvg}
                          alt=""
                          width={110}
                          height={110}
                          className="block max-w-none size-full"
                        />
                      </div>

                      {/* Overlay Gradient (h=340px @ top=-1, from rgba(0,0,0,0.15) to rgba(0,0,0,0.62) per 925:17333) */}
                      <div
                        className="pointer-events-none absolute -top-[1px] -left-[1px] -right-[1px] h-[340px]"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.62) 100%)",
                        }}
                      />

                      <div className="relative z-10 flex flex-col items-start w-full">
                        <h3 className="text-[#DCE6A9] font-semibold text-[20px] leading-[1.25] w-full">
                          {card.title}
                        </h3>
                        {isActive && (
                          <div className="pt-[8px] w-full">
                            <p className="text-white font-normal text-[16px] leading-[1.6] w-full">
                              {card.body}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            05 INDUSTRIES
            Desktop: Figma node 472:1696 (Filter pills + Chip Field)
            Tablet:  Figma node 924:11156 (Alt / Industries / Tablet · Cards + View all)
                     + Overlay modal 950:13636–950:13765
            Mobile:  Figma node 956:3468  (Alt / Industries / Mobile · Cards + View all)
                     + Bottom sheet overlay 963:11540
           ══════════════════════════════════════════════════════════════════════ */}
        <section id="industries" className="w-full bg-white">
          {/* Desktop View (lg+) */}
          <div className="max-w-[1440px] mx-auto py-[80px] px-6 lg:px-[128px] hidden lg:flex flex-col gap-[48px]">
            {/* Head row (1184x88) */}
            <div className="w-full flex items-end justify-between gap-[24px]">
              {/* Section head (gap=16) */}
              <div className="flex flex-col gap-[16px]">
                {/* Eyebrow (gap=10) */}
                <div className="inline-flex items-center gap-[10px]">
                  <span className="w-[24px] h-[3px] rounded-[3px] bg-[#657317] shrink-0" />
                  <span className="text-[#657317] font-semibold text-[16px] leading-[19.2px] tracking-[1.28px] uppercase">
                    Industries
                  </span>
                </div>

                {/* Title (48px, lh=52.8px, ls=-0.48px, weight=600, #4A4C4E) */}
                <h2 className="text-[#4A4C4E] font-semibold text-[36px] sm:text-[48px] leading-[1.1] sm:leading-[52.8px] tracking-[-0.48px]">
                  Industries we support
                </h2>
              </div>
            </div>

            {/* Industries / Chip Field (1184x542 | gap=12) */}
            <div className="w-full flex flex-col gap-[12px]">
              {/* Filters (py=12, gap=10) */}
              <div className="w-full py-[12px] flex flex-wrap items-center gap-[10px]">
                {INDUSTRY_FILTERS.map((filter) => {
                  const isActive = activeIndustryFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() =>
                        setActiveIndustryFilter((prev) => (prev === filter ? "All" : filter))
                      }
                      className={`h-[46px] px-[22px] py-[12px] rounded-full border font-medium text-[16px] leading-[20px] inline-flex items-center justify-center transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#DCE6A9] border-[#CBD97D] text-[#434D10]"
                          : "bg-white border-[#E0E6EB] text-[#4A4C4E] hover:border-[#A8C027]"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}

                {/* Explore chip · See All Industries → (205x46 | fill=#F6F9E9 | stroke=2px #A8C027) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveIndustryFilter("All");
                    setShowAllIndustries((prev) => !prev);
                  }}
                  className="h-[46px] pl-[22px] pr-[20px] py-[12px] rounded-full bg-[#F6F9E9] hover:bg-[#edf3d0] border-2 border-[#A8C027] text-[#434D10] font-medium text-[16px] leading-[20px] inline-flex items-center gap-[8px] transition-colors cursor-pointer"
                >
                  <span>{showAllIndustries ? "Show Less" : "See All Industries"}</span>
                  <span className="text-[#657317]">→</span>
                </button>
              </div>

              {/* Field (1184x460 | r=24 | pad=[48,40,48,40] | gradient #F6F9E9 -> #F7FAFC) */}
              <div
                className={`relative w-full rounded-[24px] border border-[#E0E6EB] px-[24px] sm:px-[40px] py-[48px] overflow-hidden transition-all duration-500 ${
                  showAllIndustries ? "max-h-[1200px]" : "h-[460px]"
                }`}
                style={{
                  background: "linear-gradient(180deg, #F6F9E9 0%, #F7FAFC 100%)",
                }}
              >
                <div className="flex flex-wrap justify-center content-start gap-x-[10px] gap-y-[12px]">
                  {ALL_INDUSTRY_CHIPS.map((chip) => {
                    const isHit =
                      activeIndustryFilter !== "All" &&
                      INDUSTRY_CATEGORY_HITS[activeIndustryFilter].has(chip);
                    const isDim =
                      activeIndustryFilter !== "All" &&
                      !INDUSTRY_CATEGORY_HITS[activeIndustryFilter].has(chip);

                    return (
                      <span
                        key={chip}
                        className={`h-[40px] px-[18px] py-[10px] rounded-full text-[16px] leading-[20px] font-normal inline-flex items-center justify-center transition-all duration-300 ${
                          isHit
                            ? "bg-[#DCE6A9] text-[#434D10]"
                            : isDim
                            ? "opacity-35 text-[#44505A]"
                            : "text-[#44505A]"
                        }`}
                      >
                        {chip}
                      </span>
                    );
                  })}
                </div>

                {/* Bottom Fade (1184x120 | rgba(247,249,244,0)@0% -> #F7F9F4@70% -> #F7F9F4@100%) */}
                {!showAllIndustries && (
                  <div
                    className="pointer-events-none absolute bottom-0 left-0 right-0 h-[120px]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(247, 249, 244, 0.00) 0%, #F7F9F4 70%, #F7F9F4 100%)",
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Tablet View · Cards + View all (Figma node 924:11156) */}
          <div className="hidden md:flex lg:hidden w-full px-[25px] py-[64px] flex-col gap-[40px] items-start">
            {/* Head row (924:10648) */}
            <div className="w-full flex items-end justify-between">
              <div className="w-full max-w-[784px] flex flex-col gap-[16px] items-start">
                <div className="inline-flex items-center gap-[10px]">
                  <span className="w-[24px] h-[3px] rounded-[3px] bg-[#657317] shrink-0" />
                  <span className="text-[#657317] font-semibold text-[16px] leading-[19.2px] tracking-[1.28px] uppercase">
                    Industries
                  </span>
                </div>

                <h2 className="text-[#4A4C4E] font-semibold text-[40px] leading-[1.12] tracking-[-0.4px]">
                  Industries we support
                </h2>
              </div>
            </div>

            {/* Cards viewport (924:11073 · 2-col grid gap=16 pb=96) */}
            <div className="relative w-full grid grid-cols-2 gap-[16px] pb-[96px]">
              {TABLET_INDUSTRY_CARDS.map((card) => (
                <button
                  key={`tablet-industry-${card.id}`}
                  type="button"
                  onClick={() => setTabletOverlayIndustryId(card.id)}
                  className="relative w-full h-[304px] rounded-[20px] bg-white border border-[#E0E6EB] p-[28px] flex flex-col gap-[18px] items-start overflow-hidden text-left cursor-pointer hover:border-[#A8C027] transition-colors"
                >
                  {/* Icon circle (52x52 rounded-full #F6F9E9) */}
                  <div className="size-[52px] rounded-[26px] bg-[#F6F9E9] flex items-center justify-center shrink-0">
                    <img
                      src={card.icon}
                      alt=""
                      width={26}
                      height={26}
                      className="size-[26px] shrink-0"
                    />
                  </div>

                  {/* Card Title (24px SemiBold #4A4C4E) */}
                  <h3 className="text-[#4A4C4E] font-semibold text-[24px] leading-[1.25] whitespace-nowrap">
                    {card.title}
                  </h3>

                  {/* Tag Cloud (924:13704–924:13708) */}
                  <div className="w-full flex flex-wrap gap-[6px] items-start content-start">
                    {card.tags.map((tag) => (
                      <span
                        key={`${card.id}-${tag}`}
                        className="bg-[#F7FAFC] px-[10px] py-[6px] rounded-[100px] text-[13px] leading-[1.2] font-normal text-[#44505A] whitespace-nowrap shrink-0"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Card fade (924:14757 · h=104px bottom white gradient) */}
                  {card.hasFade && (
                    <div
                      className="pointer-events-none absolute -bottom-[1px] -left-[1px] -right-[1px] h-[104px]"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 45%, #FFFFFF 100%)",
                      }}
                    />
                  )}

                  {/* View all X → (950:14695 · bottom-[43px] translate-y-full left-[27px]) */}
                  <span className="absolute bottom-[43px] translate-y-full left-[27px] text-[#657317] font-semibold text-[14px] leading-normal whitespace-nowrap">
                    View all {card.count} →
                  </span>
                </button>
              ))}

              {/* Fade + CTA (924:11140) */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[150px] pb-[12px] flex flex-col items-center justify-end">
                <a
                  href="#contact"
                  className="pointer-events-auto h-[54px] px-[30px] rounded-full bg-[#A8C027] hover:bg-[#96ad21] text-white font-semibold text-[16px] leading-[16px] inline-flex items-center justify-center transition-colors"
                >
                  Explore all Industries →
                </a>
              </div>
            </div>
          </div>

          {/* Mobile View · Cards + View all (Figma node 956:3468) */}
          <div className="flex md:hidden w-full px-[17px] py-[56px] flex-col items-start">
            <div className="w-full max-w-[368px] mx-auto flex flex-col gap-[32px] items-start">
              {/* Head row (924:11157) */}
              <div className="w-full flex items-end justify-between">
                <div className="w-full flex flex-col gap-[16px] items-start">
                  <div className="inline-flex items-center gap-[10px]">
                    <span className="w-[24px] h-[3px] rounded-[3px] bg-[#657317] shrink-0" />
                    <span className="text-[#657317] font-semibold text-[14px] leading-[1.2] tracking-[1.12px] uppercase">
                      Industries
                    </span>
                  </div>

                  {/* Title (36px, lh=1.12, ls=-0.36px per 924:11160) */}
                  <h2 className="text-[#4A4C4E] font-semibold text-[36px] leading-[1.12] tracking-[-0.36px]">
                    Industries we support
                  </h2>
                </div>
              </div>

              {/* Cards viewport (924:11161 · 1-col stack gap=12 pb=84) */}
              <div className="relative w-full flex flex-col gap-[12px] pb-[84px] items-start">
                {TABLET_INDUSTRY_CARDS.map((card) => (
                  <button
                    key={`mobile-industry-${card.id}`}
                    type="button"
                    onClick={() => setTabletOverlayIndustryId(card.id)}
                    className="relative w-full h-[242px] rounded-[20px] bg-white border border-[#E0E6EB] px-[20px] py-[18px] flex flex-col gap-[16px] items-start overflow-hidden text-left cursor-pointer hover:border-[#A8C027] transition-colors"
                  >
                    {/* Header row · Icon + Title side-by-side (924:11163 · gap=16) */}
                    <div className="w-full flex items-center gap-[16px]">
                      <div className="size-[52px] rounded-[26px] bg-[#F6F9E9] flex items-center justify-center shrink-0">
                        <img
                          src={card.icon}
                          alt=""
                          width={26}
                          height={26}
                          className="size-[26px] shrink-0"
                        />
                      </div>

                      <h3 className="text-[#4A4C4E] font-semibold text-[24px] leading-[1.25] flex-1 min-w-0">
                        {card.title}
                      </h3>
                    </div>

                    {/* Tag Cloud (924:14634–924:14638) */}
                    <div className="w-full flex flex-wrap gap-[6px] items-start content-start">
                      {card.tags.map((tag) => (
                        <span
                          key={`mobile-${card.id}-${tag}`}
                          className="bg-[#F7FAFC] px-[10px] py-[6px] rounded-[100px] text-[13px] leading-[1.2] font-normal text-[#44505A] whitespace-nowrap shrink-0"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Card fade (924:14761 · h=94px bottom white gradient) */}
                    {card.hasFade && (
                      <div
                        className="pointer-events-none absolute -bottom-[1px] -left-[1px] -right-[1px] h-[94px]"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 45%, #FFFFFF 100%)",
                        }}
                      />
                    )}

                    {/* View all X → (950:14696 · bottom-[35px] translate-y-full left-[19px]) */}
                    <span className="absolute bottom-[35px] translate-y-full left-[19px] text-[#657317] font-semibold text-[14px] leading-normal whitespace-nowrap">
                      View all {card.count} →
                    </span>
                  </button>
                ))}

                {/* Fade + CTA (924:11228 · h=84px pb=8) */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[84px] pb-[8px] flex flex-col items-center justify-end">
                  <a
                    href="#contact"
                    className="pointer-events-auto h-[54px] px-[30px] rounded-full bg-[#A8C027] hover:bg-[#96ad21] text-white font-semibold text-[16px] leading-[16px] inline-flex items-center justify-center transition-colors"
                  >
                    Explore all Industries →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Tablet Industry Overlay Modal (Figma nodes 950:13636–950:13765) */}
          {activeTabletIndustry && (
            <div className="fixed inset-0 z-50 hidden md:flex lg:hidden items-center justify-center px-[32px]">
              {/* Scrim (950:13637) */}
              <button
                type="button"
                aria-label="Close industry modal"
                onClick={() => setTabletOverlayIndustryId(null)}
                className="
                  absolute inset-0 bg-[#4A4C4E]/55 cursor-pointer
                "
              />

              {/* Panel (950:13638 · w=640 p=32 r=24 gap=24) */}
              <div className="relative z-10 w-full max-w-[640px] bg-white rounded-[24px] p-[32px] shadow-[0px_24px_60px_0px_rgba(74,76,78,0.18)] flex flex-col gap-[24px] items-start">
                {/* Header (950:13639) */}
                <div className="w-full flex items-center gap-[16px]">
                  <div className="size-[52px] rounded-[26px] bg-[#F6F9E9] flex items-center justify-center shrink-0">
                    <img
                      src={activeTabletIndustry.icon}
                      alt=""
                      width={26}
                      height={26}
                      className="size-[26px] shrink-0"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-[2px] items-start">
                    <h3 className="text-[#4A4C4E] font-semibold text-[24px] leading-[1.25]">
                      {activeTabletIndustry.title}
                    </h3>
                    <p className="text-[#8A8B88] font-normal text-[15px] leading-normal">
                      {activeTabletIndustry.count} industries
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="Close modal"
                    onClick={() => setTabletOverlayIndustryId(null)}
                    className="size-[40px] rounded-[20px] bg-[#F7FAFC] border border-[#E0E6EB] hover:border-[#A8C027] flex items-center justify-center text-[#4A4C4E] text-[24px] font-light leading-none cursor-pointer shrink-0"
                  >
                    ×
                  </button>
                </div>

                {/* Tags (950:13654) */}
                <div className="w-full flex flex-wrap gap-[6px] items-start content-start">
                  {activeTabletIndustry.tags.map((tag) => (
                    <span
                      key={`modal-${activeTabletIndustry.id}-${tag}`}
                      className="bg-[#F7FAFC] px-[10px] py-[6px] rounded-[100px] text-[13px] leading-[1.2] font-normal text-[#44505A] whitespace-nowrap shrink-0"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA · Explore all industries (950:13715) */}
                <a
                  href="#contact"
                  onClick={() => setTabletOverlayIndustryId(null)}
                  className="h-[54px] px-[30px] rounded-full bg-[#A8C027] hover:bg-[#96ad21] text-white font-semibold text-[16px] leading-[16px] inline-flex items-center justify-center transition-colors"
                >
                  Explore all Industries →
                </a>
              </div>
            </div>
          )}

          {/* Mobile Industry Bottom Sheet Overlay (Figma node 963:11540) */}
          {activeTabletIndustry && (
            <div className="fixed inset-0 z-50 flex md:hidden flex-col justify-end">
              {/* Scrim (963:11541) */}
              <button
                type="button"
                aria-label="Close industry sheet"
                onClick={() => setTabletOverlayIndustryId(null)}
                className="absolute inset-0 bg-[#4A4C4E]/55 cursor-pointer"
              />

              {/* Bottom Sheet (963:11542 · rounded-tl=24 rounded-tr=24 px=20 pt=12 pb=32 gap=20) */}
              <div className="relative z-10 w-full bg-white rounded-tl-[24px] rounded-tr-[24px] px-[20px] pt-[12px] pb-[32px] shadow-[0px_-8px_32px_0px_rgba(74,76,78,0.16)] flex flex-col gap-[20px] items-start max-h-[85vh] overflow-y-auto">
                {/* Grabber (963:11543 · 40x4 rounded-2 #E0E6EB) */}
                <div className="w-[40px] h-[4px] rounded-[2px] bg-[#E0E6EB] shrink-0" />

                {/* Header (963:11544) */}
                <div className="w-full flex items-center gap-[14px]">
                  <div className="size-[52px] rounded-[26px] bg-[#F6F9E9] flex items-center justify-center shrink-0">
                    <img
                      src={activeTabletIndustry.icon}
                      alt=""
                      width={26}
                      height={26}
                      className="size-[26px] shrink-0"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-[2px] items-start">
                    <h3 className="text-[#4A4C4E] font-semibold text-[22px] leading-[1.25]">
                      {activeTabletIndustry.title}
                    </h3>
                    <p className="text-[#8A8B88] font-normal text-[14px] leading-normal">
                      {activeTabletIndustry.count} industries
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="Close sheet"
                    onClick={() => setTabletOverlayIndustryId(null)}
                    className="size-[36px] rounded-[18px] bg-[#F7FAFC] border border-[#E0E6EB] hover:border-[#A8C027] flex items-center justify-center text-[#4A4C4E] text-[22px] font-light leading-none cursor-pointer shrink-0"
                  >
                    ×
                  </button>
                </div>

                {/* Tags (963:11559) */}
                <div className="w-full flex flex-wrap gap-[6px] items-start content-start">
                  {activeTabletIndustry.tags.map((tag) => (
                    <span
                      key={`mobile-sheet-${activeTabletIndustry.id}-${tag}`}
                      className="bg-[#F7FAFC] px-[10px] py-[6px] rounded-[100px] text-[13px] leading-[1.2] font-normal text-[#44505A] whitespace-nowrap shrink-0"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA · Explore all industries (963:11620) */}
                <a
                  href="#contact"
                  onClick={() => setTabletOverlayIndustryId(null)}
                  className="h-[54px] px-[30px] rounded-full bg-[#A8C027] hover:bg-[#96ad21] text-white font-semibold text-[16px] leading-[16px] inline-flex items-center justify-center transition-colors shrink-0"
                >
                  Explore all Industries →
                </a>
              </div>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION / PARTNERS
            Desktop: Figma node 748:8014 (1440x760 | Copy 395px + Cluster 760x600)
            Tablet:  Figma node 898:1300 (834x485  | Copy 300px + Cluster 452x356.842)
            Mobile:  Figma node 898:1709 (402x619  | Copy 368px + Cluster 368x290.526)
           ══════════════════════════════════════════════════════════════════════ */}
        <section
          className="w-full overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #F6F9E9 100%)",
          }}
        >
          <div className="max-w-[1440px] mx-auto py-[56px] md:py-[64px] lg:py-[80px] px-[17px] md:px-[25px] lg:pl-[128px] lg:pr-[109px] lg:min-h-[760px] flex flex-col md:flex-row items-center justify-between gap-[32px] md:gap-[32px] lg:gap-[48px]">
            {/* Left Copy (Mobile 368px per 898:1710 | Tablet 300px per 898:1301 | Desktop 395px) */}
            <div className="w-full max-w-[368px] md:max-w-none md:w-[300px] lg:w-[395px] flex flex-col gap-[16px] md:gap-[24px] shrink-0">
              {/* Eyebrow (gap=10) */}
              <div className="inline-flex items-center gap-[10px]">
                <span className="w-[24px] h-[3px] rounded-[3px] bg-[#657317] shrink-0" />
                <span className="text-[#657317] font-semibold text-[14px] md:text-[16px] leading-[1.2] md:leading-[19.2px] tracking-[1.12px] md:tracking-[1.28px] uppercase">
                  Partners
                </span>
              </div>

              {/* Title (Mobile 898:1712: 32px, lh=1.1, ls=-0.32px | Tablet 898:1303: 40px, lh=1.12, ls=-0.4px | Desktop: 48px) */}
              <h2 className="font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.1] md:leading-[1.12] lg:leading-[52.8px] tracking-[-0.32px] md:tracking-[-0.4px] lg:tracking-[-0.48px] text-[#4A4C4E]">
                Built on the platforms{" "}
                <span className="text-[#A8C027]">your teams already trust.</span>
              </h2>

              {/* Lead (Mobile 898:1713: 16px, lh=1.65 | Tablet & Desktop: 18px, lh=29.7px) */}
              <p className="text-[#4A4C4E] font-normal text-[16px] md:text-[18px] leading-[1.65] md:leading-[29.7px]">
                We work across leading AI, cloud, engineering and design platforms, so what we
                build fits the tools you already run.
              </p>
            </div>

            {/* Desktop Partner Cluster (760x600 on lg+ · Figma 619:1498 & Partner Orb 619:1489) */}
            <div className="hidden lg:block relative w-[760px] h-[600px] shrink-0">
              {PARTNER_ORBS.map((orb) => (
                <div
                  key={orb.name}
                  style={{
                    width: orb.size,
                    height: orb.size,
                    left: orb.left,
                    top: orb.top,
                  }}
                  className={`absolute rounded-full border border-solid border-[#E0E6EB] flex items-center justify-center transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:bg-white hover:shadow-[0px_16px_36px_0px_rgba(101,115,23,0.08)] ${
                    orb.hasShadow
                      ? "bg-[rgba(255,255,255,0.81)] shadow-[0px_12px_32px_0px_rgba(101,115,23,0.07)] hover:border-[#CBD97D]"
                      : "bg-[rgba(255,255,255,0.80)] hover:border-[#DCE6A9]"
                  }`}
                >
                  <img
                    src={orb.src}
                    alt={orb.name}
                    style={{ width: orb.logoW, height: orb.logoH }}
                    className="object-contain pointer-events-none"
                  />
                </div>
              ))}
            </div>

            {/* Tablet Partner Cluster (452x356.842 on md to lg per Figma node 898:1305 & 619:1489) */}
            <div className="hidden md:block lg:hidden relative w-[452px] h-[356.842px] shrink-0">
              {TABLET_PARTNER_ORBS.map((orb) => (
                <div
                  key={`tablet-orb-${orb.name}`}
                  style={{
                    width: orb.size,
                    height: orb.size,
                    left: orb.left,
                    top: orb.top,
                  }}
                  className={`absolute rounded-full border-[0.354px] border-solid border-[#E0E6EB] flex items-center justify-center transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:bg-white hover:shadow-[0px_9.5px_21.4px_0px_rgba(101,115,23,0.08)] ${
                    orb.hasShadow
                      ? "bg-[rgba(255,255,255,0.81)] shadow-[0px_4.245px_5.659px_0px_rgba(101,115,23,0.07)] hover:border-[#CBD97D]"
                      : "bg-[rgba(255,255,255,0.80)] hover:border-[#DCE6A9]"
                  }`}
                >
                  <img
                    src={orb.src}
                    alt={orb.name}
                    style={{ width: orb.logoW, height: orb.logoH }}
                    className="object-contain pointer-events-none"
                  />
                </div>
              ))}
            </div>

            {/* Mobile Partner Cluster (368x290.526 on < md per Figma node 898:1714 & 619:1489) */}
            <div className="block md:hidden relative w-[368px] h-[290.526px] shrink-0 mx-auto">
              {MOBILE_PARTNER_ORBS.map((orb) => (
                <div
                  key={`mobile-orb-${orb.name}`}
                  style={{
                    width: orb.size,
                    height: orb.size,
                    left: orb.left,
                    top: orb.top,
                  }}
                  className={`absolute rounded-full border-[0.288px] border-solid border-[#E0E6EB] flex items-center justify-center transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:bg-white hover:shadow-[0px_7.7px_17.4px_0px_rgba(101,115,23,0.08)] ${
                    orb.hasShadow
                      ? "bg-[rgba(255,255,255,0.81)] shadow-[0px_3.456px_4.608px_0px_rgba(101,115,23,0.07)] hover:border-[#CBD97D]"
                      : "bg-[rgba(255,255,255,0.80)] hover:border-[#DCE6A9]"
                  }`}
                >
                  <img
                    src={orb.src}
                    alt={orb.name}
                    style={{ width: orb.logoW, height: orb.logoH }}
                    className="object-contain pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            07 CTA + FAQ
            Desktop: Figma node 472:1779 (1440x578 | gap=72 pad=[80,128,80,128])
            Tablet:  Figma node 898:1369 (834x576  | gap=36 pad=[64,25,64,25])
            Mobile:  Figma node 898:1778 (402x849  | gap=32 pad=[56,17,56,17])
           ══════════════════════════════════════════════════════════════════════ */}
        <section id="faq" className="w-full bg-white">
          <div className="max-w-[1440px] mx-auto py-[56px] md:py-[64px] lg:py-[80px] px-[17px] md:px-[25px] lg:px-[128px] lg:min-h-[578px] flex flex-col md:flex-row items-center md:items-start justify-between gap-[32px] md:gap-[36px] lg:gap-[72px]">
            {/* Left Lead (Mobile 368px per 898:1779 | Tablet flex-1 min-w-0 per 898:1370 | Desktop 556px) */}
            <div className="w-full max-w-[368px] md:max-w-none md:flex-1 lg:flex-none lg:w-[556px] min-w-0 flex flex-col gap-[20px] md:gap-[24px] shrink-0">
              {/* Eyebrow (gap=10) */}
              <div className="inline-flex items-center gap-[10px]">
                <span className="w-[24px] h-[3px] rounded-[3px] bg-[#657317] shrink-0" />
                <span className="text-[#657317] font-semibold text-[14px] md:text-[16px] leading-[1.2] md:leading-[19.2px] tracking-[1.12px] md:tracking-[1.28px] uppercase">
                  FAQ
                </span>
              </div>

              {/* Title (Mobile 898:1781: 32px, lh=1.1, ls=-0.32px | Tablet 898:1372: 40px | Desktop: 48px) */}
              <h2 className="font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.1] md:leading-[1.12] lg:leading-[52.8px] tracking-[-0.32px] md:tracking-[-0.4px] lg:tracking-[-0.48px] text-[#4A4C4E] md:max-w-[374px] lg:max-w-none">
                Every project starts with a{" "}
                <span className="text-[#A8C027]">question.</span>
              </h2>

              {/* Lead (Mobile 898:1782: 16px, lh=1.65 | Tablet 898:1373: 18px, w=374px | Desktop: 460px) */}
              <p className="text-[#4A4C4E] font-normal text-[16px] md:text-[18px] leading-[1.65] md:leading-[29.7px] max-w-[368px] md:max-w-[374px] lg:max-w-[460px]">
                Yours might be about a system, an AI opportunity, or the people you need. Let’s
                start there.
              </p>

              {/* Button (218x54 | r=100 | #A8C027) */}
              <div>
                <a
                  href="#contact"
                  className="h-[54px] px-[30px] min-w-[218px] rounded-full bg-[#A8C027] hover:bg-[#96ad21] text-white font-semibold text-[16px] leading-[16px] inline-flex items-center justify-center transition-colors"
                >
                  Let’s Talk Growth →
                </a>
              </div>
            </div>

            {/* Right FAQ Accordion (Mobile 368px per 898:1784 | Tablet flex-1 min-w-0 per 898:1375 | Desktop 556px) */}
            <div className="w-full max-w-[368px] md:max-w-none md:flex-1 lg:flex-none lg:w-[556px] min-w-0 border-t border-b border-[#E0E6EB] divide-y divide-[#E0E6EB]">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={item.question} className="w-full flex flex-col">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full py-[24px] flex items-start lg:items-center justify-between gap-[24px] text-left cursor-pointer group"
                    >
                      <span className="text-[#4A4C4E] font-semibold text-[16px] md:text-[18px] leading-[1.4] md:leading-[25.2px] max-w-[312px] md:max-w-[318px] lg:max-w-[500px]">
                        {item.question}
                      </span>
                      <span
                        className={`w-[32px] h-[32px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 text-[18px] leading-[22.5px] text-[#657317] transition-colors ${
                          isOpen
                            ? "bg-[#F6F9E9] border-[#A8C027]"
                            : "bg-transparent border-[#C5C5C3] group-hover:border-[#A8C027]"
                        }`}
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="pr-[24px] lg:pr-[56px] pb-[26px]">
                        <p className="text-[#6D6E6A] font-normal text-[16px] leading-[25.6px] max-w-[344px] md:max-w-[350px] lg:max-w-none">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION / CONTACT
            Desktop: Figma node 748:8015 (1440x617 | gap=72 pad=[80,128,80,128])
            Tablet:  Figma node 898:1397 (834x569  | gap=32 pad=[64,25,64,25])
            Mobile:  Figma node 898:1806 (402x851  | gap=32 pad=[56,17,56,17])
           ══════════════════════════════════════════════════════════════════════ */}
        <section id="contact" className="relative w-full overflow-hidden bg-[#F6F9E9]">
          {/* Background image (swirl-light) stretched 100% full width */}
          <img
            src={getMediaUrl("/new-homepage/swirl-light.png")}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          <div className="relative z-10 max-w-[1440px] mx-auto py-[56px] md:py-[64px] lg:py-[80px] px-[17px] md:px-[25px] lg:px-[128px] lg:min-h-[617px] flex flex-col md:flex-row items-center md:items-start justify-between gap-[32px] md:gap-[32px] lg:gap-[72px]">
            {/* Left Lead (Mobile 368px per 898:1808 | Tablet 300px per 898:1399 | Desktop 520px) */}
            <div className="w-full max-w-[368px] md:max-w-none md:w-[300px] lg:w-[520px] flex flex-col gap-[16px] md:gap-[24px] shrink-0">
              {/* Eyebrow (gap=10) */}
              <div className="inline-flex items-center gap-[10px]">
                <span className="w-[24px] h-[3px] rounded-[3px] bg-[#657317] shrink-0" />
                <span className="text-[#657317] font-semibold text-[14px] md:text-[16px] leading-[1.2] md:leading-[19.2px] tracking-[1.12px] md:tracking-[1.28px] uppercase">
                  Contact
                </span>
              </div>

              {/* Title (Mobile 898:1810: 32px, lh=1.1, ls=-0.32px | Tablet 898:1401: 40px | Desktop: 48px) */}
              <h2 className="text-[#4A4C4E] font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.1] md:leading-[1.12] lg:leading-[52.8px] tracking-[-0.32px] md:tracking-[-0.4px] lg:tracking-[-0.48px]">
                What’s next for your business?
              </h2>

              {/* Lead (Mobile 898:1811: 16px, lh=1.65 | Tablet & Desktop: 18px, lh=29.7px) */}
              <p className="text-[#4A4C4E] font-normal text-[16px] md:text-[18px] leading-[1.65] md:leading-[29.7px] max-w-[368px] md:max-w-[300px] lg:max-w-[480px]">
                Tell us what you’re planning or working through. Share your name, company, and
                work email with a brief note, and our team will get in touch to discuss how we
                can help.
              </p>
            </div>

            {/* Right Demo Form (Mobile 368px px=20 py=24 per 898:1812 | Tablet 452px px=24 py=28 per 898:1403 | Desktop 592px p=36) */}
            <div className="w-full max-w-[368px] md:max-w-none md:w-[452px] lg:w-[592px] shrink-0 bg-white rounded-[24px] px-[20px] py-[24px] md:px-[24px] md:py-[28px] lg:p-[36px] shadow-[0_1px_2px_0_rgba(74,76,78,0.08),0_8px_24px_0_rgba(74,76,78,0.08)]">
              {formSubmitted ? (
                /* Demo form · Success (743:5313) */
                <div className="min-h-[385px] flex flex-col justify-center gap-[16px]">
                  <div className="w-[64px] h-[64px] rounded-full bg-[#EEF2D4] flex items-center justify-center text-[#657317] text-[24px] font-semibold">
                    ✓
                  </div>
                  <h3 className="font-semibold text-[24px] leading-[30px] text-[#4A4C4E]">
                    You’ve Made the First Move.
                    <br />
                    <span className="text-[#869A1F]">We’ll Take it From Here.</span>
                  </h3>
                  <p className="text-[#4A4C4E] font-normal text-[16px] leading-[25.6px] max-w-[508px]">
                    Thanks for getting in touch. We&apos;ve received your inquiry, and the right
                    people on our team will be reviewing it. Expect to hear from us soon.
                  </p>
                </div>
              ) : (
                <form noValidate onSubmit={handleContactSubmit} className="flex flex-col gap-[18px]">
                  {/* Row 1: Full Name + Company Name (1-col on mobile per 898:1812, 2-col on md+) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
                    <div className="flex flex-col gap-[6px]">
                      <label
                        htmlFor="new-home-fullname"
                        className="text-[#4A4C4E] font-semibold text-[14px] leading-[16.8px]"
                      >
                        Full Name <span className="text-red-500 hidden lg:inline">*</span>
                      </label>
                      <input
                        id="new-home-fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^\p{L}\s'’\-.,]/gu, "");
                          setFullName(sanitized);
                          if (formErrors.fullName) {
                            setFormErrors((prev) => ({ ...prev, fullName: undefined }));
                          }
                        }}
                        className={`w-full h-[48px] px-[16px] rounded-[10px] bg-white border-[1.5px] text-[#4A4C4E] text-[15px] outline-none transition-colors ${
                          formErrors.fullName
                            ? "border-red-500"
                            : "border-[#929495] focus:border-[#A8C027]"
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="text-red-500 text-[12px] leading-[16px]">
                          {formErrors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-[6px]">
                      <label
                        htmlFor="new-home-company"
                        className="text-[#4A4C4E] font-semibold text-[14px] leading-[16.8px]"
                      >
                        Company Name
                      </label>
                      <input
                        id="new-home-company"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full h-[48px] px-[16px] rounded-[10px] bg-white border-[1.5px] border-[#929495] focus:border-[#A8C027] text-[#4A4C4E] text-[15px] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Work Email */}
                  <div className="flex flex-col gap-[6px]">
                    <label
                      htmlFor="new-home-email"
                      className="text-[#4A4C4E] font-semibold text-[14px] leading-[16.8px]"
                    >
                      Work Email <span className="text-red-500 hidden lg:inline">*</span>
                    </label>
                    <input
                      id="new-home-email"
                      type="email"
                      value={workEmail}
                      onChange={(e) => {
                        setWorkEmail(e.target.value);
                        if (formErrors.workEmail) {
                          setFormErrors((prev) => ({ ...prev, workEmail: undefined }));
                        }
                      }}
                      className={`w-full h-[48px] px-[16px] rounded-[10px] bg-white border-[1.5px] text-[#4A4C4E] text-[15px] outline-none transition-colors ${
                        formErrors.workEmail
                          ? "border-red-500"
                          : "border-[#929495] focus:border-[#A8C027]"
                      }`}
                    />
                    {formErrors.workEmail && (
                      <p className="text-red-500 text-[12px] leading-[16px]">
                        {formErrors.workEmail}
                      </p>
                    )}
                  </div>

                  {/* Row 3: What would you like to discuss? (Optional) */}
                  <div className="flex flex-col gap-[6px]">
                    <label
                      htmlFor="new-home-note"
                      className="text-[#4A4C4E] font-semibold text-[14px] leading-[16.8px]"
                    >
                      What would you like to discuss? (Optional)
                    </label>
                    <textarea
                      id="new-home-note"
                      rows={4}
                      value={discussionNote}
                      onChange={(e) => {
                        setDiscussionNote(e.target.value);
                        if (formErrors.discussionNote) {
                          setFormErrors((prev) => ({ ...prev, discussionNote: undefined }));
                        }
                      }}
                      className={`w-full h-[112px] py-[13px] px-[16px] rounded-[10px] bg-white border-[1.5px] text-[#4A4C4E] text-[15px] outline-none resize-none transition-colors ${
                        formErrors.discussionNote
                          ? "border-red-500"
                          : "border-[#929495] focus:border-[#A8C027]"
                      }`}
                    />
                    {formErrors.discussionNote && (
                      <p className="text-red-500 text-[12px] leading-[16px]">
                        {formErrors.discussionNote}
                      </p>
                    )}
                  </div>

                  {formErrors.submit && (
                    <p className="text-red-500 text-[13px] leading-[18px]">
                      {formErrors.submit}
                    </p>
                  )}

                  {/* Submit Button (520x54 | r=100 | #A8C027) */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[54px] px-[30px] rounded-full bg-[#A8C027] hover:bg-[#96ad21] disabled:opacity-60 text-white font-semibold text-[16px] leading-[16px] inline-flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {isSubmitting ? "Submitting..." : "Request a Conversation"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION / FOOTER
          Desktop: Figma node 748:8016 (3 top columns, pad=[64,128,0,128])
          Tablet:  Figma node 898:1415 (Brand row + 2 link columns, pad=[64,25,0,25])
          Mobile:  Figma node 898:1824 (Brand row + 2 link columns, pad=[56,17,0,17])
         ══════════════════════════════════════════════════════════════════════ */}
      <footer className="w-full bg-white border-t border-[#E0E6EB]">
        <div className="max-w-[1440px] mx-auto pt-[56px] md:pt-[64px] px-[17px] md:px-[25px] lg:px-[128px] flex flex-col">
          {/* Desktop Top Columns (3-col on lg+) */}
          <div className="w-full pb-[40px] hidden lg:grid grid-cols-3 gap-[40px]">
            {/* Column 1 · Brand (368x113 | gap=16) */}
            <div className="flex flex-col gap-[16px]">
              <Link href="/" className="w-fit" aria-label="JWay Group Home">
                <JWayLogoHorizontal />
              </Link>
              <p className="text-[#6D6E6A] font-normal text-[14px] leading-[21px] max-w-[280px]">
                We build digital products, automate business operations and help companies
                scale with the right talent.
              </p>
            </div>

            {/* Column 2 · Quick Links (368x250 | gap=10) */}
            <div className="flex flex-col gap-[10px]">
              <h3 className="text-[#657317] font-semibold text-[16px] leading-[19.2px] tracking-[1.28px] uppercase">
                Quick Links
              </h3>
              <ul className="flex flex-col gap-[10px]">
                <li>
                  <a
                    href="#what-we-do"
                    className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                  >
                    Our Services
                  </a>
                </li>
                <li>
                  <a
                    href="#industries"
                    className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                  >
                    Industries We Support
                  </a>
                </li>
                <li>
                  <a
                    href="#why-jway"
                    className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                  >
                    Who We Are
                  </a>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                  >
                    JWay Insights
                  </Link>
                </li>
                <li>
                  <Link
                    href="/talents"
                    className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                  >
                    Book a Call
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 · Follow Us (368x135 | gap=10) */}
            <div className="flex flex-col gap-[10px]">
              <h3 className="text-[#657317] font-semibold text-[16px] leading-[19.2px] tracking-[1.28px] uppercase">
                Follow Us
              </h3>
              <ul className="flex flex-col gap-[10px]">
                <li>
                  <a
                    href="https://www.linkedin.com/company/jway-group-inc-/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/JWayGroupInc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/jwaygroup/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile & Tablet Top Columns (Mobile 898:1825 / Tablet 898:1416 · Brand full width + 2 link columns gap=24) */}
          <div className="flex lg:hidden w-full max-w-[368px] md:max-w-none mx-auto pb-[40px] flex-col gap-[32px] items-start">
            {/* Brand (898:1826 / 898:1417) */}
            <div className="w-full flex flex-col gap-[16px] items-start">
              <Link href="/" className="w-fit" aria-label="JWay Group Home">
                <JWayLogoHorizontal />
              </Link>
              <p className="text-[#6D6E6A] font-normal text-[14px] leading-[1.5] w-full">
                We build digital products, automate business operations and help companies
                scale with the right talent.
              </p>
            </div>

            {/* Footer link columns (898:1829 / 898:1420 · 2 columns gap=24) */}
            <div className="w-full flex items-start gap-[24px]">
              {/* Quick Links (Mobile w=210px per 898:1830 | Tablet flex-1 per 898:1421) */}
              <div className="w-[210px] md:w-auto md:flex-1 shrink-0 md:min-w-0 flex flex-col gap-[10px] items-start">
                <h3 className="text-[#657317] font-semibold text-[14px] md:text-[16px] leading-[1.2] md:leading-[19.2px] tracking-[1.12px] md:tracking-[1.28px] uppercase">
                  Quick Links
                </h3>
                <ul className="flex flex-col gap-[10px]">
                  <li>
                    <a
                      href="#what-we-do"
                      className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                    >
                      Our Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#why-jway"
                      className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                    >
                      Who We Are
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                    >
                      JWay Insights
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/talents"
                      className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                    >
                      Book a Call
                    </a>
                  </li>
                </ul>
              </div>

              {/* Follow Us (898:1842 / 898:1433) */}
              <div className="flex-1 min-w-0 flex flex-col gap-[10px] items-start">
                <h3 className="text-[#657317] font-semibold text-[14px] md:text-[16px] leading-[1.2] md:leading-[19.2px] tracking-[1.12px] md:tracking-[1.28px] uppercase">
                  Follow Us
                </h3>
                <ul className="flex flex-col gap-[10px]">
                  <li>
                    <a
                      href="https://www.linkedin.com/company/jway-group-inc-/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.facebook.com/JWayGroupInc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/jwaygroup/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] transition-colors"
                    >
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Offices (Mobile 898:1847 py=32 gap=28 | Tablet 898:1438 py=32 gap=24 | Desktop pad=[40,0,48,0] gap=40) */}
          <div className="w-full max-w-[368px] md:max-w-none mx-auto border-t border-[#E0E6EB] py-[32px] lg:pt-[40px] lg:pb-[48px] flex flex-col gap-[24px]">
            <h3 className="text-[#657317] font-semibold text-[14px] md:text-[16px] leading-[1.2] md:leading-[19.2px] tracking-[1.12px] md:tracking-[1.28px] uppercase">
              Our Locations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[28px] md:gap-[24px] lg:gap-[40px]">
              {FOOTER_OFFICES.map((office) => (
                <div key={office.city} className="flex flex-col gap-[12px]">
                  <h4 className="text-[#4A4C4E] font-semibold text-[16px] leading-[25.6px]">
                    {office.city}
                  </h4>
                  <p className="text-[#6D6E6A] font-normal text-[14px] leading-[21px]">
                    {office.addressLines.map((line, idx) => (
                      <React.Fragment key={line}>
                        {line}
                        {idx < office.addressLines.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                  <a
                    href={office.telHref}
                    className="text-[#4A4C4E] hover:text-[#657317] font-normal text-[16px] leading-[25.6px] w-fit transition-colors"
                  >
                    {office.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Base (1184x70 | stroke=1px #E0E6EB | pad=[20,0,28,0]) */}
          <div className="w-full max-w-[368px] md:max-w-none mx-auto border-t border-[#E0E6EB] pt-[20px] pb-[28px] flex items-center">
            <span className="text-[#6D6E6A] font-normal text-[14px] leading-[21px]">
              © JWay Group, Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
