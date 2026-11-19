import fs from 'fs';

const filePath = 'c:\\Localhost\\jway-site\\src\\app\\(frontend)\\blog\\[slug]\\page.tsx';
let fileContent = fs.readFileSync(filePath, 'utf8');

// Replace RELATED_POSTS array with valid working image URLs
const oldRelatedPosts = `const RELATED_POSTS = [
  {
    title: "The Subtle Color Decisions That Make or Break a Website",
    slug: "the-subtle-color-decisions-that-make-or-break-a-website",
    date: "April 23, 2026",
    image: "/blog/header.png",
    category: "Design",
  },
  {
    title: "The Talent Retention Playbook Nobody Talks About",
    slug: "the-talent-retention-playbook-nobody-talks-about",
    date: "April 13, 2026",
    image: "/blog/Gemini_Generated_Image_qw6peeqw6peeqw6p.png",
    category: "Staffing",
  },
  {
    title: "The Hidden Cost of Shared Responsibility: Why Your Org Chart is Killing Your Margins",
    slug: "the-hidden-cost-of-shared-responsibility-why-your-org-chart-is-killing-your-margins-stop-hiring-for-titles-start-hiring-for-bottlenecks",
    date: "March 25, 2026",
    image: "/blog/c661f4e6bd86f8af5309890e20c631c5.jpg",
    category: "Strategy",
  },
];`;

const newRelatedPosts = `const RELATED_POSTS = [
  {
    title: "5 Things That Will Change The Way You Approach Customers Using a CRM Tool",
    slug: "5-things-that-will-change-the-way-you-approach-customers-using-a-crm-tool",
    date: "June 24, 2020",
    image: "https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/customer-relationship.jpg",
    category: "Tutorials",
  },
  {
    title: "The Ultimate Guide To Create An Online Store",
    slug: "the-ultimate-guide-to-create-an-online-store",
    date: "May 27, 2020",
    image: "https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/online-store.jpg",
    category: "Technology",
  },
  {
    title: "Traditional versus Webflow: The Rise of No-Code Web Development Platform",
    slug: "traditional-versus-webflow-the-rise-of-no-code-web-development-platform",
    date: "February 4, 2022",
    image: "https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/jud-mackrill-Of_m3hMsoAA-unsplash.jpg",
    category: "Technology",
  },
];`;

if (fileContent.includes(oldRelatedPosts)) {
  fileContent = fileContent.replace(oldRelatedPosts, newRelatedPosts);
}

// Update img src={rp.image} -> img src={getMediaUrl(rp.image)}
if (fileContent.includes('src={rp.image}')) {
  fileContent = fileContent.replace('src={rp.image}', 'src={getMediaUrl(rp.image)}');
}

fs.writeFileSync(filePath, fileContent);
console.log('✅ Successfully updated Related Posts section with valid image URLs and getMediaUrl!');
