process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { getPayloadClient } from './lib/getPayload';

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

const s3BaseUrl = 'https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content';

const post1 = {
  title: 'The Tale of Two Cloud Giants: Pantheon and AWS',
  slug: 'the-tale-of-two-cloud-giants-pantheon-and-aws',
  date: 'July 16, 2024',
  category: 'Technology',
  tags: ['Technology', 'Digital'],
  readTime: '5 min read',
  author: 'Sherwin Pineda',
  coverImageUrl: `${s3BaseUrl}/blog/sherwin1.png`,
  summary:
    'In the bustling landscape of cloud computing, two platforms stand out for their unique offerings and capabilities: Pantheon and Amazon Web Services (AWS). As businesses navigate their digital transformation journeys, the choice between these two can significantly impact their efficiency, scalability, and overall success.',
  contentHtml: `<p>In the bustling landscape of cloud computing, two platforms stand out for their unique offerings and capabilities: Pantheon and Amazon Web Services (AWS). As businesses navigate their digital transformation journeys, the choice between these two can significantly impact their efficiency, scalability, and overall success. Let's dive into a story that highlights the key differences, use cases, and industry forecasts for Pantheon and AWS, offering a glimpse into the future of cloud computing.</p>

<h2><strong>The Giant: Amazon Web Services (AWS)</strong></h2>

<p><img style="max-width: 100%; height: auto; display: block; margin: 1.5rem auto; border-radius: 0.75rem;" decoding="async" class="article-content-img" src="${s3BaseUrl}/blog/sherwin2.webp" alt="Amazon Web Services AWS" width="920" height="518" /></p>

<p>AWS, often regarded as the "Colossus of Cloud Computing," offers an extensive suite of cloud services that cater to virtually every conceivable need of modern businesses. AWS's robust ecosystem provides unparalleled scalability and flexibility, from computing power and storage options to machine learning and analytics.</p>

<h3><strong>Key Strengths:</strong></h3>
<ol>
  <li><strong>Scalability and Flexibility</strong>: AWS's elastic nature allows businesses to scale resources up or down based on demand, ensuring cost-efficiency and performance optimization.</li>
  <li><strong>Comprehensive Service Range</strong>: With over 200 fully-featured services, AWS supports various applications, from web hosting to complex data analytics and artificial intelligence.</li>
  <li><strong>Global Reach</strong>: AWS operates in multiple geographic regions, ensuring low latency and high availability for global enterprises.</li>
</ol>

<h3><strong>Use Cases:</strong></h3>
<ul>
  <li><strong>Enterprise Applications</strong>: Companies like Netflix and Airbnb leverage AWS for their vast computing power and global infrastructure.</li>
  <li><strong>Big Data and Analytics</strong>: AWS's data lakes and analytics services enable organizations to efficiently process and analyze large datasets.</li>
  <li><strong>AI and Machine Learning</strong>: With services like AWS SageMaker, businesses can build, train, and deploy machine learning models at scale.</li>
</ul>

<h2><strong>The Specialist: Pantheon</strong></h2>

<p><img style="max-width: 100%; height: auto; display: block; margin: 1.5rem auto; border-radius: 0.75rem;" decoding="async" class="article-content-img" src="${s3BaseUrl}/blog/sherwin3.webp" alt="Pantheon Specialist" width="920" height="483" /></p>

<p>Pantheon, on the other hand, carves its niche in the web hosting and content management space, specifically for WordPress and Drupal sites. It offers a streamlined platform for developers, marketers, and IT teams to collaborate and manage websites efficiently.</p>

<h3><strong>Key Strengths:</strong></h3>
<ol>
  <li><strong>Optimized for CMS</strong>: Pantheon is tailored for content management systems (CMS) like WordPress and Drupal, providing tools that simplify development workflows and enhance performance.</li>
  <li><strong>Developer-Friendly</strong>: The platform supports agile development practices with features like version control, multidev environments, and automated updates.</li>
  <li><strong>Performance and Security</strong>: Pantheon ensures high performance with its advanced caching and CDN integration while maintaining robust security protocols.</li>
</ol>

<h3><strong>Use Cases:</strong></h3>
<ol>
  <li><strong>Marketing Websites</strong>: Businesses looking to manage high-traffic marketing websites with ease and reliability find Pantheon an ideal choice.</li>
  <li><strong>Content-Driven Sites</strong>: Nonprofits, educational institutions, and media companies use Pantheon for its specialized support for content-heavy websites.</li>
</ol>

<h2><strong>Industry Forecast: 2024-2025</strong></h2>

<p><img style="max-width: 100%; height: auto; display: block; margin: 1.5rem auto; border-radius: 0.75rem;" decoding="async" class="article-content-img" src="${s3BaseUrl}/blog/sherwin4.jpg" alt="Industry Forecast" width="920" height="613" /></p>

<p>According to Gartner, worldwide end-user spending on public cloud services is expected to grow significantly, reaching $678.8 billion in 2024, up from $563.6 billion in 2023. This 20.4% increase is driven by the adoption of generative AI (GenAI) and the need for application modernization.</p>

<h3><strong>AWS Outlook:</strong></h3>
<p>AWS is projected to maintain its leadership position, driven by continuous innovation and expansion of its service offerings. The integration of AI, machine learning, and IoT (Internet of Things) into its cloud ecosystem will attract more enterprises looking to harness advanced technologies for competitive advantage.</p>

<h3><strong>Pantheon Outlook:</strong></h3>
<p>Pantheon is likely to strengthen its foothold in the CMS hosting market. As businesses increasingly prioritize digital experiences, Pantheon’s focus on performance, security, and developer productivity will make it a preferred choice for content-centric applications.</p>

<h3><strong>Market Trends:</strong></h3>
<ul>
  <li><strong>Hybrid and Multi-Cloud Strategies</strong>: Businesses will continue adopting hybrid and multi-cloud strategies to optimize costs, enhance resilience, and avoid vendor lock-in.</li>
  <li><strong>Edge Computing</strong>: The rise of edge computing will complement cloud services, providing faster data processing and reduced latency for IoT and real-time applications.</li>
  <li><strong>Sustainability</strong>: Environmental sustainability will become a key focus, with cloud providers investing in green technologies and energy-efficient data centers.</li>
</ul>

<p>In conclusion, while AWS offers a comprehensive, scalable solution for diverse business needs, Pantheon excels in providing a specialized, developer-friendly platform for managing content-rich websites. The choice between the two will depend on specific business requirements, technical capabilities, and strategic goals.</p>

<h2><strong>References</strong></h2>
<ul>
  <li><strong>Gartner. (2023)</strong>. Gartner forecasts worldwide public cloud end-user spending to reach $679 billion in 2024.</li>
  <li><strong>PeerSpot. (2024)</strong>. Amazon AWS vs. Pantheon comparison.</li>
  <li><strong>Datanami. (2024)</strong>. Gartner forecasts worldwide public cloud end-user spending to surpass $675B in 2024.</li>
  <li><strong>RTInsights. (2024)</strong>. Gartner forecasts robust growth in public cloud spending.</li>
</ul>`,
};

const post2 = {
  title: 'Transforming a Customer Portal into an Application Hub: Enterprise Group’s Journey',
  slug: 'transforming-a-customer-portal-into-an-application-hub-enterprise-groups-journey',
  date: 'July 11, 2024',
  category: 'Enterprise',
  tags: ['Enterprise'],
  readTime: '5 min read',
  author: 'Ian Lopez',
  coverImageUrl: `${s3BaseUrl}/blog/Transforming_a_Customer_Portal_into_an_Application_Hub_Enterprise_Groups_Journey.png`,
  summary:
    'In today’s fast-evolving digital landscape, businesses must innovate to meet customer needs. The Enterprise Group within JWay has achieved a significant milestone by transforming the customer portal of an American multinational healthcare technology company into a comprehensive application hub. This transformation integrates six crucial systems, revolutionizing customer experience, streamlining operations, and enhancing productivity.',
  contentHtml: `<p>In today’s fast-evolving digital landscape, businesses must innovate to meet customer needs. The Enterprise Group within JWay has achieved a significant milestone by transforming the customer portal of an American multinational healthcare technology company into a comprehensive application hub. This transformation integrates six crucial systems, revolutionizing customer experience, streamlining operations, and enhancing productivity.</p>

<h2><strong>The Vision: From Portal to Hub</strong></h2>
<p>Initially, the customer portal served as a simple access point for clients to manage their interactions with the healthcare technology company. Recognizing the need for a more seamless and cohesive user experience, the Enterprise Group envisioned turning the portal into an all-encompassing application hub. This hub centralizes access to various services and integrates multiple systems to provide a unified and efficient user experience.</p>

<p><img style="max-width: 100%; height: auto; display: block; margin: 1.5rem auto; border-radius: 0.75rem;" decoding="async" class="article-content-img" src="${s3BaseUrl}/blog/Image_2.png" alt="Application Hub Integration" width="920" height="607" /></p>

<h2><strong>Key Integrations: Bridging Systems for a Unified Experience</strong></h2>
<ol>
  <li><strong>Okta Single Sign-On (SSO):</strong><br />
    <p>Integrating Okta SSO allows users to access all services with a single set of credentials, enhancing security and reducing friction.</p>
  </li>
  <li><strong>Salesforce B2B Commerce Cloud:</strong><br />
    <p>Integrating Salesforce B2B Commerce Cloud enables a robust shopping experience, allowing users to browse, purchase, and manage orders seamlessly.</p>
  </li>
  <li><strong>SAP C4C:</strong><br />
    <p>Integrating SAP Cloud for Customer (C4C) focuses on managing service tickets, streamlining the process for addressing customer inquiries and ensuring timely resolution.</p>
  </li>
  <li><strong>Docebo Learning Management System (LMS):</strong><br />
    <p>The Docebo LMS integration provides a platform for training and certification programs, allowing users to access learning materials, track progress, and gain certifications.</p>
  </li>
  <li><strong>Ingeniux Content Management System (CMS):</strong><br />
    <p>Integrating Ingeniux CMS enables the healthcare technology company to manage and deliver high-quality content, ensuring users are always informed and engaged.</p>
  </li>
  <li><strong>Heretto Component Content Management System (CCMS):</strong><br />
    <p>Heretto CCMS integration allows for the efficient creation, management, and delivery of complex documents and technical content.</p>
  </li>
</ol>

<h2><strong>Federated Search: Seamless Access to Information</strong></h2>
<p><img style="max-width: 100%; height: auto; display: block; margin: 1.5rem auto; border-radius: 0.75rem;" decoding="async" class="article-content-img" src="${s3BaseUrl}/blog/Image_3.webp" alt="Federated Search" width="920" height="594" /></p>
<p>One of the standout features of the transformed application hub is its federated search capability. Using the Lucene search engine, the hub provides powerful and efficient search functionality that spans multiple data sources, including the customer portal and Docebo LMS. This federated search allows users to quickly find relevant information across different platforms without needing to navigate through each system individually. Whether users are looking for specific content or learning materials, the federated search ensures they can access what they need quickly and easily.</p>
<p>Additionally, the Enterprise Group plans to expand the federated search capability by integrating more systems in the future. This continuous improvement will further enhance the user experience by providing an even broader range of accessible information.</p>

<h2><strong>The Benefits: Enhanced Experience and Efficiency</strong></h2>
<p><img style="max-width: 100%; height: auto; display: block; margin: 1.5rem auto; border-radius: 0.75rem;" decoding="async" class="article-content-img" src="${s3BaseUrl}/blog/Image_4.jpg" alt="Enhanced Experience Benefits" width="920" height="614" /></p>
<p>The transformation into an application hub has enhanced the user experience by providing a single access point for all services. The integration of multiple systems has reduced redundancy, improved data accuracy, and streamlined operations. Users can now manage interactions, access learning resources, track service tickets, and more from one central hub.</p>
<p>Moreover, the federated search capability significantly enhances efficiency, enabling users to locate information swiftly and accurately. This strategic move positions the healthcare technology company for sustained success, ensuring agility, responsiveness, and innovation in a competitive market.</p>

<h2><strong>Conclusion</strong></h2>
<p>The Enterprise Group within JWay’s transformation of the customer portal into an application hub is a testament to its commitment to innovation and customer satisfaction. By integrating Okta SSO, Salesforce B2B Commerce Cloud, SAP C4C, Docebo LMS, Ingeniux CMS, and Heretto CCMS, and implementing federated search with Lucene, the team has created a powerful, unified platform that meets the diverse needs of its users. This strategic move not only enhances the user experience but also positions the healthcare technology company for sustained success in the digital age.</p>`,
};

const newPosts = [post1, post2];

async function run() {
  console.log('🚀 Updating databases for 2 new posts...\n');

  // 1. Update Remote Neon PostgreSQL
  const neonPool = new pg.Pool({
    connectionString: neonConnectionString.replace(/\?sslmode=.*$/, ''),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    for (const item of newPosts) {
      const res = await neonPool.query(`SELECT id FROM posts WHERE slug = $1`, [item.slug]);
      if (res.rows.length > 0) {
        await neonPool.query(
          `UPDATE posts SET title=$1, cover_image_url=$2, content_html=$3, summary=$4, author_name=$5, category=$6, tags=$7, read_time=$8, updated_at=NOW() WHERE slug=$9`,
          [
            item.title,
            item.coverImageUrl,
            item.contentHtml,
            item.summary,
            item.author,
            item.category,
            item.tags.join(', '),
            item.readTime,
            item.slug,
          ]
        );
      } else {
        await neonPool.query(
          `INSERT INTO posts (title, slug, cover_image_url, content_html, summary, author_name, category, tags, read_time, published_date, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'published', NOW(), NOW())`,
          [
            item.title,
            item.slug,
            item.coverImageUrl,
            item.contentHtml,
            item.summary,
            item.author,
            item.category,
            item.tags.join(', '),
            item.readTime,
            new Date(item.date).toISOString(),
          ]
        );
      }
    }
    console.log('✅ Remote Neon PostgreSQL DB updated with 2 new posts.');
  } catch (e: any) {
    console.error('❌ Neon DB error:', e.message || e);
  } finally {
    await neonPool.end();
  }

  // 2. AWS RDS Staging PostgreSQL
  const rdsPool = new pg.Pool({
    connectionString: rdsConnectionString.replace(/\?sslmode=.*$/, ''),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    for (const item of newPosts) {
      const res = await rdsPool.query(`SELECT id FROM posts WHERE slug = $1`, [item.slug]);
      if (res.rows.length > 0) {
        await rdsPool.query(
          `UPDATE posts SET title=$1, cover_image_url=$2, content_html=$3, summary=$4, author_name=$5, category=$6, tags=$7, read_time=$8, updated_at=NOW() WHERE slug=$9`,
          [
            item.title,
            item.coverImageUrl,
            item.contentHtml,
            item.summary,
            item.author,
            item.category,
            item.tags.join(', '),
            item.readTime,
            item.slug,
          ]
        );
      } else {
        await rdsPool.query(
          `INSERT INTO posts (title, slug, cover_image_url, content_html, summary, author_name, category, tags, read_time, published_date, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'published', NOW(), NOW())`,
          [
            item.title,
            item.slug,
            item.coverImageUrl,
            item.contentHtml,
            item.summary,
            item.author,
            item.category,
            item.tags.join(', '),
            item.readTime,
            new Date(item.date).toISOString(),
          ]
        );
      }
    }
    console.log('✅ AWS RDS Staging PostgreSQL DB updated with 2 new posts.');
  } catch (e: any) {
    console.error('❌ AWS RDS Staging DB error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  console.log('\n🎉 Both PostgreSQL databases updated!');
  process.exit(0);
}

run();
