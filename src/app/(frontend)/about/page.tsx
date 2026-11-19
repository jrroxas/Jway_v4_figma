"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMediaUrl } from "@/utils/media";

// Timeline Slider Data
interface TimelineSlide {
  year: string;
  title: string;
  description: string;
  image: string;
}

const TIMELINE_DATA: TimelineSlide[] = [
  {
    year: "1994",
    title: "Silicon Valley",
    description: "An integral part of the internet revolution for the last 24+ years, JWay conducted R&D with the National Centre for Supercomputing Applications at the University of Illinois, a pioneer of supercomputing, the modern Internet, World Wide Web, and Apache HTTP Server.",
    image: getMediaUrl("/about/silicon_valley.png"),
  },
  {
    year: "2011",
    title: "Expansion",
    description: "In 2011, we expanded our operations to include a Silicon-Valley-style Development Center in the Philippines and are in a unique position to offer our customers excellent quality and digital solutions at competitive pricing.",
    image: getMediaUrl("/about/expansion.png"),
  },
  {
    year: "2018",
    title: "Global Brands",
    description: "We’ve worked with enterprise companies such as D.W. Morgan, Go2Group, Omnicell, Build It Green, IDT, Cisco and FMC, to name a few, on cutting-edge Internet, Web, Mobile, SFDC, Digital Marketing and Cloud and Big Data Projects.",
    image: getMediaUrl("/about/global_brands.png"),
  },
];

// Leadership Data
interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  linkedin?: string;
}

const LEADERSHIP_TEAM: TeamMember[] = [
  {
    name: "Joseph Choi",
    role: "President and CEO",
    avatar: getMediaUrl("/about/Joe-Choi.png"),
    linkedin: "https://www.linkedin.com/in/joseph-choi-32a7605/",
  },
  {
    name: "Benjamin Gomez",
    role: "Chief Financial Officer",
    avatar: getMediaUrl("/about/BenGomez.png"),
    linkedin: "https://www.linkedin.com/in/ben-gomez-aaa9a5140/",
  },
  {
    name: "Rex Mupas",
    role: "Chief Technology Officer",
    avatar: getMediaUrl("/about/Rex-Mupas.jpg"),
    linkedin: "https://www.linkedin.com/in/rexmupas/",
  },
  {
    name: "Ian Ray Lopez",
    role: "COO / Enterprise Manager",
    avatar: getMediaUrl("/about/Ian-Ray-Lopez.png"),
    linkedin: "https://www.linkedin.com/in/ian-ray-lopez-09a155/",
  },
  {
    name: "Joahnna Climacosa",
    role: "HR / Admin Manager",
    avatar: getMediaUrl("/about/Jo-Ann-Climacosa.png"),
    linkedin: "https://www.linkedin.com/in/j-climacosa-81b66474/",
  },
  {
    name: "KC Santonil",
    role: "Manager, AI & Digital Services",
    avatar: getMediaUrl("/about/kc.jpg"),
    linkedin: "https://www.linkedin.com/in/kyle-christofer-santonil/",
  },
  {
    name: "Mara Clara Quivedo",
    role: "Head of Staffing",
    avatar: getMediaUrl("/about/Mara-Quivedo.jpg"),
  },
  {
    name: "Ella Calotes",
    role: "CFO - Philippines",
    avatar: getMediaUrl("/about/Ella-Calotes.png"),
    linkedin: "https://www.linkedin.com/in/isra-ella-calotes-517833b4/",
  },
];

export default function AboutPage() {
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('${getMediaUrl('/about/About-banner.png')}')` }}>
          <div className="absolute inset-0 bg-[#2e2f31]/75 backdrop-blur-[2px]"></div>
          <div className="relative max-w-5xl mx-auto text-center z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
              <span className="text-jway-green">Pioneering the Digital Era:</span>
              <br className="hidden sm:inline" /> 28 Years and Beyond
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-200 font-sans max-w-3xl mx-auto leading-relaxed">
              Pushing the boundaries of what&apos;s possible, fueled by our unwavering resolve to anticipate and meet the future needs of our clients and the digital world at large.
            </p>
          </div>
        </section>

        {/* Brand Mantra / Statement Section */}
        <section className="py-24 bg-[#F6F7EF] border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="text-jway-green font-heading font-bold text-lg tracking-wider uppercase">Our Purpose</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#2e2f31] lg:whitespace-nowrap">
                  We are what we repeatedly do
                </h2>
                <div className="h-1.5 w-24 bg-jway-green rounded-full"></div>
                <p className="text-lg sm:text-xl text-gray-700 font-sans leading-relaxed">
                  We are the ideal partner to deliver exceptional results in the evolving digital world for our customers, employees, investors, and communities.
                </p>
              </div>
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
                  <Image
                    src={getMediaUrl("/about/About-Globe.png")}
                    alt="JWay Globe"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Turning Points of JWay Section */}
        <section className="py-24 bg-gradient-to-b from-[#F6F7EF] to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">Our Journey</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-bold text-[#2e2f31]">
                <span className="text-jway-green">Turning Points</span> of JWay
              </h2>
              <p className="mt-4 text-[16px] text-gray-600 leading-relaxed font-sans">
                Starting with pioneering R&amp;D in supercomputing, JWay expanded into a Development Center in the Philippines, offering quality digital solutions worldwide. Through the years, JWay partnered with enterprises like Cisco on innovative projects. By 2023, it further diversified into web and mobile development, enterprise solutions, and staffing, providing comprehensive client services.
              </p>
            </div>

            {/* Interactive Timeline Slider Component */}
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100/80 p-6 sm:p-10 md:p-12 transition-all duration-300">
              
              {/* Interactive Tabs / Slider Control bar */}
              <div className="relative flex justify-between items-center mb-12 max-w-md mx-auto">
                {/* Background Connecting Line */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
                {/* Active Progress Filler Line */}
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-jway-green z-0 transition-all duration-500 ease-out"
                  style={{
                    width: `${(activeTimelineIndex / (TIMELINE_DATA.length - 1)) * 100}%`
                  }}
                ></div>

                {TIMELINE_DATA.map((item, index) => {
                  const isActive = index === activeTimelineIndex;
                  return (
                    <button
                      key={item.year}
                      onClick={() => setActiveTimelineIndex(index)}
                      className="relative z-10 flex flex-col items-center focus:outline-none group"
                    >
                      <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-sm font-bold font-sans transition-all duration-300 ${
                        isActive 
                          ? "bg-jway-green text-white border-jway-green scale-110 shadow-lg"
                          : "bg-white text-gray-500 border-gray-200 group-hover:border-jway-green/55 group-hover:text-jway-green"
                      }`}>
                        {item.year}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Slider Active Content view with transitions */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[350px]">
                <div className="md:col-span-7 space-y-6 transition-all duration-500 ease-in-out opacity-100">
                  <span className="text-jway-green font-sans font-bold text-sm tracking-wider uppercase bg-[#A8C028]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
                    {TIMELINE_DATA[activeTimelineIndex].year} turning point
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#2e2f31]">
                    {TIMELINE_DATA[activeTimelineIndex].title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-sans text-[15.5px] sm:text-base">
                    {TIMELINE_DATA[activeTimelineIndex].description}
                  </p>
                </div>
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative w-full h-[240px] sm:h-[300px] rounded-2xl overflow-hidden shadow-md">
                    <Image
                      src={TIMELINE_DATA[activeTimelineIndex].image}
                      alt={TIMELINE_DATA[activeTimelineIndex].title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Leadership Team Card Section */}
        <section className="py-24 bg-[#F9F9F9] relative overflow-hidden">
          {/* Subtle Decorative Circle Background */}
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-jway-green/5 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-jway-green/5 blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-jway-green font-sans font-bold text-xs uppercase tracking-wider bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block mb-3">The Team</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-bold text-[#2e2f31]">
                Building a team <span className="text-jway-green">that lasts</span>
              </h2>
              <div className="h-1.5 w-20 bg-jway-green rounded-full mx-auto mt-4"></div>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
              {LEADERSHIP_TEAM.map((member) => (
                <div
                  key={member.name}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md flex flex-col items-center p-6 text-center"
                >
                  {/* Avatar Container */}
                  <div className="relative w-36 h-36 rounded-full overflow-hidden mb-6 border-4 border-gray-50">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Name and Role */}
                  <h3 className="font-heading font-bold text-[17px] text-gray-800 tracking-tight leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-[13px] text-gray-500 font-sans font-medium mt-1 mb-4 leading-normal flex-grow px-2">
                    {member.role}
                  </p>

                  {/* LinkedIn Link (rendered if present) */}
                  {member.linkedin ? (
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-jway-green hover:text-white text-gray-400 transition-all duration-300"
                      aria-label={`${member.name}'s LinkedIn Profile`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </Link>
                  ) : (
                    <div className="h-10" />
                  )}
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
