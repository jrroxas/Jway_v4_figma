'use client';

import { TextField, TextareaField, useFormFields } from '@payloadcms/ui';
import type { TextFieldClientComponent, TextareaFieldClientComponent } from 'payload';
import { useEffect, useState } from 'react';

const FALLBACKS: Record<string, { title: string; description: string }> = {
  home: {
    title: '28+ Years of Technology and Digital Solutions',
    description: '10M+ talent reach across multiple industries and professions. 25k+ prequalified talent database, 100+ projects.',
  },
  about: {
    title: 'Pioneering the Digital Era: 28 Years and Beyond',
    description: "Pushing the boundaries of what's possible, fueled by our resolve to anticipate and meet the future needs of our clients and the digital world.",
  },
  digital: {
    title: 'High-Impact Digital Experiences Tailored for Growth',
    description: 'We couple modern user-centric aesthetics, robust code frameworks, and strategic technology consulting to establish high-performing digital architectures for global brands.',
  },
  enterprise: {
    title: 'Scale Fearlessly with Silicon Valley Expertise',
    description: 'For over 28 years, JWay Group has delivered high-impact web, cloud, and CRM integrations to global enterprise leaders. Secure, process-driven, and meticulously engineered.',
  },
  mobile: {
    title: 'Engaging Mobile Apps. Native Speed & Scale.',
    description: 'Build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.',
  },
  staffing: {
    title: 'Scale Your Capabilities with Top-Tier Tech Talent',
    description: 'Skip the hiring headache. JWay Group bridges the gap between ambitious enterprises and exceptional, pre-vetted professionals.',
  },
  blog: {
    title: 'JWay Resources & Blogs',
    description: 'Stay updated with the latest industry insights in technology, UI/UX web design, smart staffing strategy, and global remote careers.',
  },
  testimonials: {
    title: 'Your Trust Is Our Success',
    description: 'We are proud to share words from our clients as their feedback drives our commitment to exceptional service.',
  },
  'contact-us': {
    title: 'Connect With Our Global Offices',
    description: 'Partner with a Silicon Valley powerhouse backed by premier Philippine delivery capabilities. We are here to support your scaling and product objectives.',
  },
};

const usePageFallback = (key: 'title' | 'description') => {
  return useFormFields(([fields]) => {
    if (key === 'title' && typeof fields.title?.value === 'string' && fields.title.value.trim()) {
      return fields.title.value.trim();
    }

    const slug = fields.slug?.value;
    return FALLBACKS[String(slug)]?.[key];
  });
};

export const SeoMetaTitleField: TextFieldClientComponent = (props) => {
  const fallback = usePageFallback('title');
  const [placeholder, setPlaceholder] = useState<string>();

  useEffect(() => {
    setPlaceholder(fallback);
  }, [fallback]);

  return (
    <TextField
      {...props}
      field={{
        ...props.field,
        admin: { ...props.field.admin, placeholder },
      }}
    />
  );
};

export const SeoMetaDescriptionField: TextareaFieldClientComponent = (props) => {
  const fallback = usePageFallback('description');
  const [placeholder, setPlaceholder] = useState<string>();

  useEffect(() => {
    setPlaceholder(fallback);
  }, [fallback]);

  return (
    <TextareaField
      {...props}
      field={{
        ...props.field,
        admin: { ...props.field.admin, placeholder },
      }}
    />
  );
};
