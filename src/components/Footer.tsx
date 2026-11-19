"use client";

import Link from "next/link";
import Image from "next/image";

const LOCATIONS = [
  {
    city: "Milpitas, CA",
    country: "USA",
    address: ["691 South Milpitas Blvd.", "Suite #213", "Milpitas, CA 95035", "USA"],
    phone: "+1 408 247 5929",
    phoneHref: "tel:+14082475929"
  },
  {
    city: "Ortigas Center",
    country: "Philippines",
    address: ["30F One Corporate Center", "Ortigas Center", "Pasig City 1605", "Philippines"],
    phone: "+632 8284 8789",
    phoneHref: "tel:+63282848789"
  },
  {
    city: "Baguio City",
    country: "Philippines",
    address: ["Good Grind Cafe+Workspace", "204 Newtown Plaza Building", "Navybase Road, St.Joseph Village", "Baguio City, Philippines"],
    phone: "+63 74 620 9871",
    phoneHref: "tel:+63746209871"
  }
];

export default function Footer() {
  return (
    <footer className="bg-[#2e2f31] text-[#c0c0c0] pt-16 border-t-4 border-jway-green font-sans">
      
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Logo & Locations (8 columns) */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <Link href="/">
                <Image 
                  src="/Logo-JWay.svg" 
                  alt="JWay Group" 
                  width={140} 
                  height={45} 
                  className="h-10 w-auto brightness-0 invert opacity-80"
                />
              </Link>
            </div>

            {/* Office Locations grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {LOCATIONS.map((loc) => (
                <div key={loc.city} className="flex flex-col gap-3 text-[13px] leading-relaxed">
                  <div className="flex gap-2 items-start">
                    {/* Location Pin Icon */}
                    <svg className="w-5 h-5 text-jway-green shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <div>
                      <h4 className="font-bold text-white mb-1.5">{loc.city}, {loc.country}</h4>
                      {loc.address.map((line, i) => (
                        <p key={i} className="text-gray-400">{line}</p>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 items-center mt-1 pl-7">
                    {/* Phone Icon */}
                    <svg className="w-4 h-4 text-jway-green shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.145-.44.02-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                    <a href={loc.phoneHref} className="text-gray-300 hover:text-jway-green transition-colors">
                      {loc.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links & Socials (4 columns) */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* Services menu */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">Services</h4>
              <ul className="flex flex-col gap-2.5 text-[13.5px]">
                <li><Link href="/digital" className="hover:text-jway-green transition-colors">Digital</Link></li>
                <li><Link href="/enterprise" className="hover:text-jway-green transition-colors">Enterprise</Link></li>
                <li><Link href="/mobile" className="hover:text-jway-green transition-colors">Mobile</Link></li>
                <li><Link href="/staffing" className="hover:text-jway-green transition-colors">Staffing</Link></li>
              </ul>
            </div>

            {/* General menu */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">Menu</h4>
              <ul className="flex flex-col gap-2.5 text-[13.5px]">
                <li><Link href="/about" className="hover:text-jway-green transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-jway-green transition-colors">Resources</Link></li>
                <li><Link href="/testimonials" className="hover:text-jway-green transition-colors">Testimonials</Link></li>
                <li><Link href="https://jway-group.breezy.hr/" target="_blank" className="hover:text-jway-green transition-colors">Jobs</Link></li>
              </ul>
            </div>

            {/* Social icons */}
            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">Socials</h4>
              <div className="flex gap-3">
                {/* Facebook */}
                <a href="https://web.facebook.com/JWayGroupInc/?ref=br_rs" target="_blank" rel="noopener" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-jway-green transition-colors group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/jwaygroup/?hl=en" target="_blank" rel="noopener" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-jway-green transition-colors group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/company/jway-group/" target="_blank" rel="noopener" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-jway-green transition-colors group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom copyright & Legal bar */}
      <div className="bg-[#242526] py-6 text-[12.5px] text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Legal Links */}
          <div className="flex gap-6 order-2 md:order-1">
            <Link href="/contact-us" className="hover:text-jway-green transition-colors">Support</Link>
            <Link href="/faqs" className="hover:text-jway-green transition-colors">FAQs</Link>
            <Link href="/privacy-policy" className="hover:text-jway-green transition-colors">Privacy</Link>
            <Link href="/terms-of-use" className="hover:text-jway-green transition-colors">Terms of Use</Link>
          </div>

          {/* Copyright text */}
          <div className="order-1 md:order-2">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> JWay Group, Inc. All rights reserved.
          </div>

        </div>
      </div>

    </footer>
  );
}
