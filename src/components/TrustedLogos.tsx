"use client";

import Image from "next/image";

const CLIENT_LOGOS = [
  { name: "Omnicell", src: "/omnicell-logo.png" },
  { name: "Aehr", src: "/aehr-logo.png" },
  { name: "Pointwest", src: "/pointwest-logo.png" },
  { name: "Cisco", src: "/cisco-logo.png" },
  { name: "Onramp Lab", src: "/onramplab-logo.svg" },
  { name: "Capgemini", src: "/capgemini-logo.png" }
];

export default function TrustedLogos() {
  return (
    <section className="py-12 bg-white border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h6 className="text-[12px] uppercase font-bold tracking-widest text-gray-400 font-sans">
            Trusted by
          </h6>
        </div>

        {/* Logos container */}
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-14">
          {CLIENT_LOGOS.map((logo) => (
            <div 
              key={logo.name} 
              className="relative w-[150px] sm:w-[175px] md:w-[200px] h-[64px] sm:h-[75px] md:h-[86px] grayscale hover:grayscale-0 opacity-65 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
            >
              <Image 
                src={logo.src} 
                alt={logo.name} 
                fill 
                className="object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
