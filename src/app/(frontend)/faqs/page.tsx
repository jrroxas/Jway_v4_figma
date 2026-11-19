"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface FAQItem {
  question: string;
  answer: string;
  category: "onboarding" | "payments" | "contracts" | "privacy" | "updates";
}

const FAQ_DATA: FAQItem[] = [
  {
    category: "onboarding",
    question: "How long does the client onboarding process take, and what does it involve?",
    answer: "Client onboarding at JWay Group typically takes 1 to 2 weeks. The process starts with a comprehensive technical discovery phase to understand your objectives and map out specific role profiles. This is followed by team matching and selection, environment and security onboarding (granting repo access, setting up communication channels), and finally, a formal kickoff meeting where standard operating procedures and sprint cadences are established."
  },
  {
    category: "onboarding",
    question: "What preparation is needed on our end before kicking off the engagement?",
    answer: "To ensure a smooth kickoff, we recommend preparing project briefs, architectural diagrams, repository structures, and access credentials for development tools (such as Jira, Slack, or GitHub). Having a designated primary point of contact on your side helps align communication and speed up integration."
  },
  {
    category: "payments",
    question: "What are JWay's standard billing cycles and payment terms?",
    answer: "Our standard payment terms are Net-30, with monthly billing cycles for staff augmentation and dedicated engineering teams. For custom milestone-based projects (Enterprise Solutions), billing is tied directly to key deliverables, with an initial down payment due at signing. We accept bank wire transfers, ACH deposits, and major electronic payment systems."
  },
  {
    category: "payments",
    question: "Are there any hidden fees or recruitment setup costs?",
    answer: "No. JWay operates under complete pricing transparency. For staff augmentation and direct placement services, all onboarding costs, hardware procurement, pre-employment checks, and recruiter overhead are fully bundled into our agreed-upon contract rate. You only pay for active service hours or pre-negotiated project milestones."
  },
  {
    category: "contracts",
    question: "Are there minimum contract lengths for engaging JWay's services?",
    answer: "For Staff Augmentation or dedicated team engagements, we typically suggest a minimum contract length of 3 to 6 months to allow team alignment and optimal delivery momentum. However, for specialized consulting, Proof of Concept (POC) projects, or high-level architecture designs, we offer shorter, highly agile milestone-based agreements customized to your delivery schedule."
  },
  {
    category: "contracts",
    question: "Can we scale our dedicated team size up or down during the contract period?",
    answer: "Yes, scalability is one of our core strengths. With a standard 30-day notice period, you can add new specialized developers or transition resources as your product lifecycle requirements evolve. This provides your business with maximum operational agility without long-term overhead liabilities."
  },
  {
    category: "privacy",
    question: "How does JWay protect our intellectual property and ensure data privacy?",
    answer: "We treat your intellectual property (IP) with absolute rigor. All engagements are protected by comprehensive bilateral Non-Disclosure Agreements (NDAs) and clear contractual clauses transferring 100% of IP rights to the client upon milestone payment. Our global developers work within highly secure virtual environments, utilize encrypted hardware, enforce Multi-Factor Authentication (MFA), and strictly comply with GDPR, CCPA, and international data safety protocols."
  },
  {
    category: "privacy",
    question: "Do you perform background checks on the engineering candidates?",
    answer: "Yes. Every candidate undergoing JWay endorsement goes through complete background verification, including education validation, previous employment history, character references, and criminal record screening where applicable."
  },
  {
    category: "updates",
    question: "How often do we receive project updates, and how is communication managed?",
    answer: "Transparency is our standard. We establish a regular communication loop, which includes daily standups or Slack/Teams status updates, weekly progress metrics reports, and bi-weekly product sprint demos. You have direct access to your designated engineers as well as a dedicated delivery manager or project coordinator who coordinates milestones and resolves blockers immediately."
  },
  {
    category: "updates",
    question: "Which project management tools do you support?",
    answer: "We adapt completely to your internal toolchain. Our teams are highly proficient in industry-standard platforms including Jira, ClickUp, Linear, Trello, and Azure DevOps for project tracking, alongside Slack, Microsoft Teams, Zoom, and Google Workspace for communications."
  }
];

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "onboarding", label: "Onboarding" },
  { id: "payments", label: "Payments & Terms" },
  { id: "contracts", label: "Contracts & Scaling" },
  { id: "privacy", label: "IP & Client Privacy" },
  { id: "updates", label: "Communication & Updates" }
];

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = activeCategory === "all" 
    ? FAQ_DATA 
    : FAQ_DATA.filter(faq => faq.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        {/* Banner Section */}
        <section className="relative py-20 bg-[#2e2f31] overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A8C028_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-jway-green/20 text-jway-green text-xs font-semibold tracking-wider uppercase border border-jway-green/30">
              Got Questions? We Have Answers.
            </span>
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white">
              Frequently Asked <span className="text-jway-green">Questions</span>
            </h1>
            <p className="text-gray-300 font-sans text-base sm:text-lg max-w-2xl mx-auto">
              Everything you need to know about partnering with JWay Group. From our onboarding timelines and billing models to security protocols and project delivery.
            </p>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-20 bg-gray-50/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2.5 mb-12">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenIndex(null); // Reset open states on category switch
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-jway-green text-white shadow-md shadow-jway-green/20 scale-102"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-jway-green/30 hover:text-jway-green"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Accordions Container */}
            <div className="space-y-4">
              {filteredFAQs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? "border-jway-green shadow-lg ring-1 ring-jway-green/10"
                        : "border-gray-150 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Accordion Header Trigger */}
                    <button
                      onClick={() => toggleAccordion(idx)}
                      aria-expanded={isOpen}
                      className="w-full text-left p-6 flex justify-between items-center gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-jway-green rounded-2xl"
                    >
                      <span className="font-heading font-bold text-gray-800 text-[16px] sm:text-[17px] leading-snug">
                        {faq.question}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? "bg-jway-green text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </button>

                    {/* Accordion Panel Body */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-[500px] border-t border-gray-100" : "max-h-0"
                      }`}
                    >
                      <div className="p-6 bg-gray-50/30">
                        <p className="text-gray-600 font-sans text-sm sm:text-base leading-relaxed pl-4 border-l-3 border-jway-green">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Helper CTA */}
            <div className="mt-16 bg-[#f6f7ef] border border-[#e2e6d5] rounded-3xl p-8 sm:p-10 text-center space-y-4">
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-800">
                Still have unanswered questions?
              </h3>
              <p className="text-gray-600 text-sm sm:text-base font-sans max-w-xl mx-auto leading-relaxed">
                Our global consultation specialists are ready to address any technical, operational, or procurement questions you have.
              </p>
              <div className="pt-2">
                <a
                  href="/contact-us"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-jway-green text-white font-bold hover:bg-jway-green/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Contact Support
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
