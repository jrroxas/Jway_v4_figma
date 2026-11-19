"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getMediaUrl } from "@/utils/media";

const SLIDES = [
  {
    id: 1,
    tabLabel: "28 years of digital solutions",
    titleHighlight: "28+ Years",
    titleRest: "of Technology and Digital Solutions",
    description: [
      "10M+ talent reach across multiple industries and professions",
      "25k+ prequalified talent database, 100+ projects"
    ],
    image: getMediaUrl("/hero-slide1-joe.jpg"),
    bg: getMediaUrl("/hero-slide1-bg.webp")
  },
  {
    id: 2,
    tabLabel: "Fast-Track Hiring, 2-Week Turnover",
    titleHighlight: "Fast-Track Hiring,",
    titleRest: "2-Week Turnover",
    description: "91% of our candidates get invited by our clients with access to over 10 million professionals in various industries.",
    image: getMediaUrl("/hero-slide2-team.jpg"),
    bg: getMediaUrl("/hero-slide2-bg.webp")
  },
  {
    id: 3,
    tabLabel: "Reduce cost, build apps faster",
    titleHighlight: "Reduce Cost,",
    titleRest: "Build Apps Faster",
    description: "Supercharge your mobile development with Flutter technology for iOS, Android, and web.",
    image: getMediaUrl("/hero-slide3-phone.jpg"), 
    bg: getMediaUrl("/hero-slide3-bg.webp")
  }
];

const PROMO_VIDEO_URL = process.env.NEXT_PUBLIC_PROMO_VIDEO_URL || "/jway-promo.mp4";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoOpen) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [videoOpen]);

  const openVideo = () => {
    setVideoOpen(true);
    // Add scroll lock
    document.body.classList.add("overflow-hidden");
  };

  const closeVideo = () => {
    setVideoOpen(false);
    document.body.classList.remove("overflow-hidden");
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="relative w-full h-[740px] sm:h-[650px] md:h-[680px] overflow-hidden bg-gray-50 flex flex-col justify-between">
      
      {/* Slides Container */}
      <div className="relative flex-grow w-full">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
              style={{
                backgroundImage: `url(${slide.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
                  
                  {/* Text Content */}
                  <div 
                    className={`flex flex-col items-start space-y-4 md:space-y-6 transform transition-all duration-700 delay-200 ${
                      isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                  >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl font-heading font-bold text-[#2e2f31] leading-tight">
                      <span className="text-jway-green block">{slide.titleHighlight}</span>
                      <span className="block">{slide.titleRest}</span>
                    </h1>
                    {Array.isArray(slide.description) ? (
                      <ul className="text-base md:text-lg text-gray-700 max-w-lg font-sans leading-relaxed list-disc pl-5 space-y-1.5 text-left">
                        {slide.description.map((bullet, idx) => (
                          <li key={idx} className="marker:text-jway-green">{bullet}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-base md:text-lg text-gray-700 max-w-lg font-sans leading-relaxed text-left">
                        {slide.description}
                      </p>
                    )}
                    <button 
                      onClick={openVideo}
                      className="px-8 py-3.5 rounded-full bg-jway-green text-white font-semibold text-base hover:bg-jway-green/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 group"
                    >
                      <span>Discover JWay</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:translate-x-0.5 transition-transform">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Image Box */}
                  <div 
                    className={`hidden md:flex justify-end transform transition-all duration-1000 delay-300 ${
                      isActive ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                    }`}
                  >
                    <div className="relative w-full max-w-md lg:max-w-[460px] aspect-[4/3] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl border-4 border-white/50">
                      <Image 
                        src={slide.image} 
                        alt={slide.tabLabel}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        unoptimized
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Premium Custom Text Navigation Bar (Parity with live site) */}
      <div className="w-full bg-[#2e2f31]/95 backdrop-blur-md border-t border-white/10 z-20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            {SLIDES.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`text-left px-5 py-4 rounded-lg border transition-all duration-300 ${
                    isActive 
                      ? "bg-white/10 border-jway-green text-white shadow-inner font-semibold" 
                      : "bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-[14px] md:text-[15px] line-clamp-1">{slide.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Overlay Modal (Using Local Video Asset) */}
      {videoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video border border-white/10">
            
            {/* Close Button */}
            <button 
              onClick={closeVideo}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 text-white hover:bg-white/10 transition-colors shadow-md"
              aria-label="Close video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <video 
              ref={videoRef}
              src={PROMO_VIDEO_URL}
              controls 
              autoPlay 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
