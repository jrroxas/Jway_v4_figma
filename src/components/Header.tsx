"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface SubLink {
  label: string;
  href: string;
}

interface ServiceCategory {
  title: string;
  href: string;
  items: SubLink[];
}

const SERVICES_DATA: ServiceCategory[] = [
  {
    title: "Digital",
    href: "/digital",
    items: [
      { label: "AI Engineering", href: "/ai-solutions" },
      { label: "Web Design and Development", href: "/digital" },
      { label: "Digital Consulting", href: "/digital" },
      { label: "UI/UX Design", href: "/digital" },
      { label: "Support and Maintenance", href: "/digital" },
      { label: "Digital Marketing", href: "/digital" },
    ],
  },
  {
    title: "Enterprise",
    href: "/enterprise",
    items: [
      { label: "Enterprise Applications Development", href: "/enterprise" },
      { label: "Application and Product Integrations", href: "/enterprise" },
      { label: "Proof of Concept", href: "/enterprise" },
      { label: "Support and Maintenance", href: "/enterprise" },
    ],
  },
  {
    title: "Mobile",
    href: "/mobile",
    items: [
      { label: "Flutter Development", href: "/mobile" },
      { label: "Native iOS/Android Development", href: "/mobile" },
      { label: "Cloud System Architecture", href: "/mobile" },
      { label: "Backend Development", href: "/mobile" },
      { label: "VAPT", href: "/mobile" },
    ],
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo - Copied locally */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/Logo-JWay.svg" 
                alt="JWay Group" 
                width={140} 
                height={45} 
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8 items-center font-sans font-semibold text-[15px] text-gray-700">
            <Link href="/" className="hover:text-jway-green transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-jway-green transition-colors">
              About
            </Link>
            
            {/* Services Dropdown (Detailed Mega Menu) */}
            <div className="relative group cursor-pointer py-6">
              <span className="group-hover:text-jway-green transition-colors flex items-center gap-1.5">
                Services
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="10" 
                  height="7" 
                  viewBox="0 0 10 7" 
                  fill="none" 
                  className="group-hover:stroke-jway-green stroke-gray-600 transition-transform group-hover:rotate-180 duration-200"
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-[45%] pt-2 hidden group-hover:block w-[960px] max-w-[95vw]">
                <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 p-8 grid grid-cols-4 gap-6 z-50">
                  {SERVICES_DATA.map((cat) => (
                    <div key={cat.title} className="flex flex-col gap-3">
                      <Link 
                        href={cat.href} 
                        className="text-jway-green font-bold text-base border-b border-gray-100 pb-2 hover:opacity-85 flex items-center justify-between"
                      >
                        {cat.title}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                      <ul className="flex flex-col gap-2.5">
                        {cat.items.map((item) => {
                          const isLink = item.href === "/ai-solutions";
                          return (
                            <li key={item.label}>
                              {isLink ? (
                                <Link 
                                  href={item.href} 
                                  className="text-gray-600 hover:text-jway-green text-[13.5px] font-normal transition-colors block"
                                >
                                  {item.label}
                                </Link>
                              ) : (
                                <span className="text-gray-600 text-[13.5px] font-normal block">
                                  {item.label}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}

                  {/* Staffing Column with Talent Pool CTA Card */}
                  <div className="flex flex-col gap-3">
                    <Link 
                      href="/staffing" 
                      className="text-jway-green font-bold text-base border-b border-gray-100 pb-2 hover:opacity-85 flex items-center justify-between"
                    >
                      Staffing
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                    <ul className="flex flex-col gap-2.5 mb-2">
                      <li>
                        <span className="text-gray-600 text-[13.5px] font-normal block">
                          On-Demand Recruitment
                        </span>
                      </li>
                      <li>
                        <span className="text-gray-600 text-[13.5px] font-normal block">
                          Staff Augmentation
                        </span>
                      </li>
                      <li>
                        <span className="text-gray-600 text-[13.5px] font-normal block">
                          HR &amp; Payroll Services
                        </span>
                      </li>
                    </ul>

                    {/* Talent Pool CTA Box */}
                    <div className="bg-[#f6f7ef] rounded-xl p-4 border border-[#e2e6d5] flex flex-col gap-2 mt-auto">
                      <span className="font-bold text-[14px] text-gray-800">Talent Pool</span>
                      <p className="text-gray-600 text-[12px] leading-relaxed">
                        Access top-tier remote professionals without the hiring headaches.
                      </p>
                      <Link 
                        href="/talents" 
                        className="text-jway-green text-[13px] font-bold hover:underline flex items-center gap-1 mt-1 group/link"
                      >
                        Let&apos;s Talk
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <Link href="/blog" className="hover:text-jway-green transition-colors">
              Resources
            </Link>
            <Link href="/testimonials" className="hover:text-jway-green transition-colors">
              Testimonials
            </Link>
            <Link href="https://jway-group.breezy.hr/" target="_blank" className="hover:text-jway-green transition-colors">
              Jobs
            </Link>

            {/* CTA */}
            <Link href="/contact-us" className="ml-4 px-6 py-2.5 rounded-full bg-jway-green text-white font-semibold hover:bg-jway-green/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Book a Call
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 z-50 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-1 font-sans">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-base font-semibold text-gray-700 hover:text-jway-green hover:bg-gray-50 rounded-md">Home</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-base font-semibold text-gray-700 hover:text-jway-green hover:bg-gray-50 rounded-md">About</Link>
            
            {/* Mobile Services Accordion */}
            <div>
              <button 
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full flex justify-between items-center px-3 py-2.5 text-base font-semibold text-gray-700 hover:text-jway-green hover:bg-gray-50 rounded-md"
              >
                <span>Services</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="10" 
                  height="7" 
                  viewBox="0 0 10 7" 
                  fill="none" 
                  className={`stroke-gray-600 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              
              {mobileServicesOpen && (
                <div className="pl-6 pr-4 py-2 bg-gray-50/50 rounded-lg flex flex-col gap-4">
                  {SERVICES_DATA.map((cat) => (
                    <div key={cat.title} className="flex flex-col gap-2">
                      <span className="text-jway-green font-bold text-sm uppercase tracking-wider">{cat.title}</span>
                      <ul className="flex flex-col gap-2 pl-2 border-l border-gray-200">
                        {cat.items.map((item) => {
                          const isLink = item.href === "/ai-solutions";
                          return (
                            <li key={item.label}>
                              {isLink ? (
                                <Link 
                                  href={item.href} 
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="text-gray-600 hover:text-jway-green text-[13px] block py-1"
                                >
                                  {item.label}
                                </Link>
                              ) : (
                                <span className="text-gray-600 text-[13px] block py-1">
                                  {item.label}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                  
                  {/* Staffing Mobile */}
                  <div className="flex flex-col gap-2">
                    <span className="text-jway-green font-bold text-sm uppercase tracking-wider">Staffing</span>
                    <ul className="flex flex-col gap-2 pl-2 border-l border-gray-200 mb-2">
                      <li>
                        <span className="text-gray-600 text-[13px] block py-1">
                          On-Demand Recruitment
                        </span>
                      </li>
                      <li>
                        <span className="text-gray-600 text-[13px] block py-1">
                          Staff Augmentation
                        </span>
                      </li>
                      <li>
                        <span className="text-gray-600 text-[13px] block py-1">
                          HR &amp; Payroll Services
                        </span>
                      </li>
                    </ul>

                    {/* Talent Pool CTA mobile */}
                    <div className="bg-[#f6f7ef] rounded-lg p-3.5 border border-[#e2e6d5] flex flex-col gap-1.5">
                      <span className="font-bold text-[13px] text-gray-800">Talent Pool</span>
                      <p className="text-gray-600 text-[11px] leading-relaxed">
                        Access top-tier remote professionals without the hiring headaches.
                      </p>
                      <Link 
                        href="/talents" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-jway-green text-[12px] font-bold flex items-center gap-1 group/link"
                      >
                        Let&apos;s Talk
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-base font-semibold text-gray-700 hover:text-jway-green hover:bg-gray-50 rounded-md">Resources</Link>
            <Link href="/testimonials" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-base font-semibold text-gray-700 hover:text-jway-green hover:bg-gray-50 rounded-md">Testimonials</Link>
            <Link href="https://jway-group.breezy.hr/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-base font-semibold text-gray-700 hover:text-jway-green hover:bg-gray-50 rounded-md">Jobs</Link>
            <Link href="/contact-us" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 mt-4 text-base font-bold text-white bg-jway-green text-center rounded-full shadow-lg">Book a Call</Link>
          </div>
        </div>
      )}
    </header>
  );
}
