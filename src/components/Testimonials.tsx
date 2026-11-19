"use client";

import Image from "next/image";
import { getMediaUrl } from "@/utils/media";

const TESTIMONIALS = [
  {
    id: 1,
    quote: "JWay has been a great partner to help deliver Omnicell’s digital experience. They understand our business and move quickly to deliver what is needed for it to succeed. Above all, they are extremely easy to work with and go out of their way to deliver a great customer experience. I would recommend them to any team looking to outsource or supplement their digital marketing or development efforts.",
    name: "Mitchell Ingstad",
    role: "Web Marketing Manager",
    company: "Omnicell",
    avatar: getMediaUrl("/testimonials/Mitchell-Ingstad.png"),
    logo: getMediaUrl("/testimonials/omnicell.png")
  },
  {
    id: 2,
    quote: "JWay’s unwavering support and dedication in handling website maintenance and developments have been instrumental in achieving our digital marketing goals efficiently.",
    name: "Delphine Vincent",
    role: "Sr Manager, Digital Marketing",
    company: "Omnicell International",
    avatar: getMediaUrl("/testimonials/Delphine-Vincent.png"),
    logo: getMediaUrl("/testimonials/omnicell.png")
  }
];

export default function Testimonials() {
  return (
    <section 
      className="py-24 bg-cover bg-center relative"
      style={{ backgroundImage: `url('${getMediaUrl('/TestimonialSlider_bkg.png')}')` }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <span className="text-jway-green font-bold uppercase tracking-wider text-xs">Customer Success</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-[#2e2f31]">
            <span className="text-jway-green">Your Trust</span> is Our Success
          </h2>
          <p className="mt-4 text-[16px] text-gray-700 font-sans max-w-2xl mx-auto">
            Building trust with our clients is in our DNA, which is why some of our client relationships span over a decade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t) => (
            <div 
              key={t.id} 
              className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
            >
              
              {/* Quote text */}
              <div className="relative mb-8">
                <svg className="absolute -top-4 -left-4 w-8 h-8 text-jway-green/10" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-gray-700 font-sans italic text-base md:text-[17px] leading-relaxed pl-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Card Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-gray-100 mt-auto">
                
                {/* Author Info */}
                <div className="flex items-center">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-jway-green/45">
                    <Image 
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-gray-800 text-[15px]">{t.name}</h4>
                    <p className="text-[12.5px] text-gray-500 leading-tight">
                      {t.role}, <span className="font-semibold text-gray-600 block sm:inline">{t.company}</span>
                    </p>
                  </div>
                </div>

                {/* Company Logo */}
                <div className="relative w-56 h-20 self-end sm:self-center">
                  <Image 
                    src={t.logo}
                    alt={t.company}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
