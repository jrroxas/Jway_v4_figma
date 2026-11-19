import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { getPayloadClient } from "@/lib/getPayload";
import { getPageMetadata } from "@/lib/getPageMetadata";
import { getMediaUrl } from "@/utils/media";

export const revalidate = 0; // Always fetch fresh database content on request

export async function generateMetadata() {
  return getPageMetadata("testimonials", {
    title: "Your Trust Is Our Success",
    description: "We are proud to share words from our clients as their feedback drives our commitment to exceptional service.",
  });
}

const STATIC_TESTIMONIALS = [
  {
    id: 1,
    name: "John Hoyt",
    role: "Managing Director",
    company: "D.W. Morgan",
    avatar: getMediaUrl("/testimonials/john.png"),
    quote: "JWay has become much more than a supplier; they’re an extension of our own capabilities and a close strategic partner. As we have rapidly scaled operations in Asia, JWay has brought an entrepreneurial spirit and flexibility that mirrors our own culture."
  },
  {
    id: 2,
    name: "Scott Filler",
    role: "Principal",
    company: "Scott Filler Consulting",
    avatar: getMediaUrl("/testimonials/scott.png"),
    quote: "I’ve worked with JWay for more than 10 years on multiple projects, clients and positions. This long relationship is based on the quality of their work, the expertise of their team, their responsiveness and commitment to meet project schedules. Their use of offshore resources has given me the flexibility to provide cost-effective projects as well as turnkey maintenance and support once a project goes into production. JWay was my go-to partner for multiple website redesign projects including NASDAQ listed companies in the high-tech and semiconductor space. JWay is a reliable business partner that has allowed me to deliver exceptional solutions to my consulting and internal customers. I highly recommend them."
  },
  {
    id: 3,
    name: "Kendyl Kellogg",
    role: "Proprietor",
    company: "La Nebbia Winery",
    avatar: getMediaUrl("/testimonials/kendyl.png"),
    quote: "JWay Group brought innovation, professionalism and consistency to the La Nebbia Winery marketing efforts. As a small business, it’s a challenge to keep up with the demands of running marketing programs while managing corporate and private events, along with the tasting room and winery promotions. We’re glad to have a partner who understands our business and helps us build on our success."
  },
  {
    id: 4,
    name: "Danny Teng",
    role: "Director of Information Systems",
    company: "Build It Green",
    avatar: getMediaUrl("/testimonials/danny.png"),
    quote: "It’s been great working with JWay’s staff in developing a portal with Force.com platform. The staff is very knowledgeable with the platform and very resourceful. After the first engagement, we decided to extend the engagement longer because we are happy with the service JWay provided."
  },
  {
    id: 5,
    name: "Vincent Agbayani",
    role: "President",
    company: "Agbayani Construction Corporation",
    avatar: getMediaUrl("/testimonials/vincent.png"),
    quote: "JWay has just completed ACC-Air’s website. ACC-Air is a subsidiary of Agbayani Construction Corporation (ACC). The website is designed to provide essential information about ACC-Air’s products and services, in a condensed format that can be easily read, on iPhone, iPad and other mobile devices. JWay, did an excellent job in formatting and presenting ACC-Air’s website, to reflect the smaller screens, without missing critical pictures and narratives. JWay is now supplementing ACC-Air’s online presence by demonstrating ways and means of marketing ACC-Air via Twitter, Facebook, and other social media methods. JWay has certainly showed us the way into the future of marketing. Other than their creative website designs, I highly recommend JWay to provide you an analysis of your existing marketing strategies. ACC has been in business for over 30 plus years and continue to rely on great companies, such as JWay, to move us into the future for another 30 years."
  },
  {
    id: 6,
    name: "Optimized Marketing Group",
    role: "Marketing Agency",
    company: "Client Partner",
    avatar: getMediaUrl("/testimonials/omg.png"),
    quote: "The team at JWay is amazing! They respond to messages faster than you can send them, and their work is spectacular. The websites they build need very little change, and in the world of developers, that is astounding. The best part is how knowledgeable they are. When we need something, we have faith that they will give us what we are looking for, and in the slight chance they don’t have the answer, they will find it. As a marketing agency, being able to trust our developers is a priority, and keeping our customers happy and their websites functioning at peak performance is critical. Our clients deserve nothing but the best, and we’ve found it for them with JWay."
  },
  {
    id: 7,
    name: "Joseph Lee",
    role: "Senior Web Marketing Manager",
    company: "Integrated Device Technology",
    avatar: getMediaUrl("/testimonials/joseph.png"),
    quote: "While I managed the corporate websites and channel partner extranets at Integrated Device Technology and Symmetricom, JWay has directly contributed to the ongoing success of improving the user experience and performance of these web properties. I would highly recommend JWay for any future website projects (design and/or programming)."
  },
  {
    id: 8,
    name: "Pavel Kalinin",
    role: "Engineering Manager",
    company: "Sun Microsystems",
    avatar: getMediaUrl("/testimonials/pavel.png"),
    quote: "I worked with JWay when they were providing services to Sun Microsystem’s partner marketing organization. JWay built a Sun iForce Solution center portal for us, allowing Sun partners to showcase their solutions and connect to potential customers and other partners. I was impressed with the speed and quality of work that JWay’s team has shown on this project. They have smart and proactive engineering team and I really enjoyed working with them."
  },
  {
    id: 9,
    name: "Milena Volkova",
    role: "Senior Operations Manager",
    company: "Sun Microsystems",
    avatar: getMediaUrl("/testimonials/pavel.png"),
    quote: "I was very pleased with JWay’s services when they worked on maintenance of a custom SFDC-based application at Sun Microsystems. Liesel has an exceptional customer focus, ability to brainstorm solutions and delivers results on time and on budget. She and the team of JWay consultants were very methodical, process- and detail-oriented, and results-focused. They ensured a smooth operation of our system that served a global team of about 200 Market Development managers and 10,000+ field sales."
  }
];

interface TestimonialItem {
  id: string | number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
}

export default async function TestimonialsPage() {
  let testimonials: TestimonialItem[] = [];

  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "testimonials",
      sort: "order",
      limit: 100,
    });

    if (res.docs && res.docs.length > 0) {
      testimonials = res.docs.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        role: doc.role,
        company: doc.company,
        avatar: getMediaUrl(doc.avatarUrl || "/header.png"),
        quote: doc.quote,
      }));
    } else {
      console.log("No testimonials found in database. Seeding initial testimonials...");
      for (const t of STATIC_TESTIMONIALS) {
        await payload.create({
          collection: "testimonials",
          data: {
            name: t.name,
            role: t.role,
            company: t.company,
            avatarUrl: t.avatar,
            quote: t.quote,
            order: t.id as number,
          },
        });
      }
      // Re-fetch seeded documents
      const seededRes = await payload.find({
        collection: "testimonials",
        sort: "order",
        limit: 100,
      });
      if (seededRes.docs && seededRes.docs.length > 0) {
        testimonials = seededRes.docs.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          role: doc.role,
          company: doc.company,
          avatar: getMediaUrl(doc.avatarUrl || "/header.png"),
          quote: doc.quote,
        }));
      }
    }
  } catch (e) {
    console.warn("Failed to fetch or seed testimonials in database:", e);
  }

  // Use fallback if database is empty or connection fails
  if (testimonials.length === 0) {
    testimonials = STATIC_TESTIMONIALS;
  }

  // Smart Masonry Balancer:
  // Dynamically packs cards into 3 columns based on estimated height.
  // Left (col1) and Center (col2) are filled first to guarantee NO blank gaps in the left/center,
  // pushing any trailing whitespace strictly to the far RIGHT column (col3).
  const col1: TestimonialItem[] = [];
  const col2: TestimonialItem[] = [];
  const col3: TestimonialItem[] = [];

  let h1 = 0;
  let h2 = 0;
  let h3 = 0;

  for (const item of testimonials) {
    // Estimate card height: character count factor + base structure height
    const estimatedHeight = Math.ceil(item.quote.length / 38) * 26 + 180;

    // Fill the shortest column, prioritizing Left -> Center -> Right
    if (h1 <= h2 && h1 <= h3) {
      col1.push(item);
      h1 += estimatedHeight;
    } else if (h2 <= h3) {
      col2.push(item);
      h2 += estimatedHeight;
    } else {
      col3.push(item);
      h3 += estimatedHeight;
    }
  }

  const renderCard = (t: TestimonialItem) => (
    <div 
      key={t.id} 
      className="bg-white rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/80 flex flex-col justify-between"
    >
      {/* Quote Icon & Content */}
      <div className="relative mb-6">
        <svg 
          className="absolute -top-4 -left-4 w-10 h-10 text-jway-green/10" 
          fill="currentColor" 
          viewBox="0 0 32 32" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
        <p className="text-gray-700 font-sans italic text-base leading-relaxed pl-4 whitespace-pre-line">
          &ldquo;{t.quote}&rdquo;
        </p>
      </div>

      {/* Profile info block */}
      <div className="flex items-center pt-6 border-t border-gray-100 mt-6">
        <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-jway-green/40 bg-gray-50 flex-shrink-0">
          <Image 
            src={getMediaUrl(t.avatar)}
            alt={t.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div>
          <h4 className="font-heading font-bold text-gray-900 text-sm md:text-base leading-tight">
            {t.name}
          </h4>
          <p className="text-[13px] text-gray-500 font-sans mt-0.5 leading-snug">
            {t.role} &middot; <span className="font-semibold text-gray-700">{t.company}</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          className="relative py-24 md:py-32 bg-cover bg-center text-white"
          style={{ 
            backgroundImage: `url('${getMediaUrl('/testimonials/Banner-Testimonials.png')}')` 
          }}
        >
          {/* Overlay to ensure premium look and high contrast text readability */}
          <div className="absolute inset-0 bg-[#2E2F31]/60" />
          
          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
            <div className="max-w-3xl">
              <span className="inline-block text-jway-green font-heading font-bold text-sm tracking-widest uppercase mb-4">
                Client Success Stories
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight leading-tight">
                <span className="text-jway-green">Your trust</span> is our success
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-200 font-sans leading-relaxed">
                We are proud to share some words from our clients as their feedback is the driving force behind our unwavering commitment to exceptional service.
              </p>
            </div>
          </div>
        </section>

        {/* Height-Balanced Masonry Grid Section */}
        <section 
          className="py-24 bg-repeat bg-center relative"
          style={{ 
            backgroundImage: `url('${getMediaUrl('/TestimonialSlider_bkg.png')}')` 
          }}
        >
          {/* Soft background overlay for clean card contrast */}
          <div className="absolute inset-0 bg-[#F9F9F9]/85 backdrop-blur-[2px]" />

          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
            
            {/* Subsection header */}
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                What Our Clients Say
              </h2>
              <p className="mt-4 text-base text-gray-600 font-sans">
                Building trust with our clients is in our DNA, which is why some of our client relationships span over a decade.
              </p>
            </div>

            {/* Height-Balanced Masonry Columns (Left & Center Dense, Right-Pushed Whitespace) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {/* Column 1 (Left) */}
              <div className="flex flex-col gap-8">
                {col1.map((t) => renderCard(t))}
              </div>

              {/* Column 2 (Center) */}
              <div className="flex flex-col gap-8">
                {col2.map((t) => renderCard(t))}
              </div>

              {/* Column 3 (Right) */}
              <div className="flex flex-col gap-8">
                {col3.map((t) => renderCard(t))}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
