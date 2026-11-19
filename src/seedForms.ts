import { getPayload } from 'payload';
import config from './payload.config';

async function seedForms() {
  console.log('🌱 Initializing Payload for Forms seeding...');
  const payload = await getPayload({ config });

  const sampleForms = [
    {
      formName: 'Contact Us Form',
      name: 'Sarah Jenkins',
      email: 'sarah@innovatecorp.com',
      company: 'Innovate Corp',
      phone: '+1 408 555 0100',
      subject: 'Enterprise Software Development',
      message: 'We are looking to modernize our legacy CRM and integrate custom APIs. Would like to schedule an architecture call.',
      status: 'new',
    },
    {
      formName: 'Staffing Talent Request',
      name: 'Marcus Vance',
      email: 'marcus.vance@techscale.io',
      company: 'TechScale Solutions',
      phone: '+1 650 443 8920',
      subject: 'Software Developer / Staff Augmentation',
      message: 'Need 2 Senior Full-Stack Next.js engineers for a 6-month contract starting next month.',
      status: 'in_progress',
    },
    {
      formName: 'Talent Sourcing Inquiry',
      name: 'Elena Rostova',
      email: 'elena@ai-ventures.com',
      company: 'AI Ventures Lab',
      phone: '+1 415 890 1234',
      subject: 'Inquiry regarding Talent AI-301 (Lead AI/ML Engineer)',
      message: 'Interested in interviewing Talent AI-301 for a custom LLM RAG pipeline integration.',
      status: 'contacted',
    },
    {
      formName: 'AI Solutions Inquiry',
      name: 'David Miller',
      email: 'dmiller@fintechglobal.com',
      company: 'FinTech Global',
      phone: '+1 212 901 5522',
      subject: 'AI Agentic Workflow Automation',
      message: 'Evaluating n8n and custom LangChain agents for automated compliance checking.',
      status: 'new',
    },
    {
      formName: 'Mobile Consultation',
      name: 'Amanda Chen',
      email: 'amanda@healthfirst.org',
      company: 'HealthFirst Digital',
      phone: '+1 312 770 4110',
      subject: 'Cross-Platform Flutter Mobile App',
      message: 'Looking to port our iOS native app to a unified Flutter codebase for iOS and Android.',
      status: 'new',
    },
  ];

  console.log(`📝 Seeding ${sampleForms.length} sample submissions into Forms collection...`);

  for (const form of sampleForms) {
    try {
      const existing = await payload.find({
        collection: 'forms',
        where: {
          email: { equals: form.email },
          formName: { equals: form.formName },
        },
      });

      if (existing.docs.length > 0) {
        console.log(`  ⏭  Skipped (Already exists): ${form.formName} - ${form.name}`);
      } else {
        await payload.create({
          collection: 'forms',
          data: form as any,
        });
        console.log(`  ✅ Created: ${form.formName} - ${form.name}`);
      }
    } catch (e) {
      console.error(`  ❌ Error creating form for ${form.name}:`, e);
    }
  }

  console.log('\n✨ Forms Seeding Complete!');
  process.exit(0);
}

seedForms();
