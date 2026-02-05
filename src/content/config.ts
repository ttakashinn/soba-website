import { defineCollection, z } from 'astro:content';

const caseStudiesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    index: z.number(),
    heroImage: z.string(),
    industry: z.object({
      vi: z.string(),
      en: z.string(),
      ja: z.string(),
    }),
    industryKey: z.string(),
    client: z.object({
      vi: z.string(),
      en: z.string(),
      ja: z.string(),
    }),
    teamSize: z.object({
      vi: z.string(),
      en: z.string(),
      ja: z.string(),
    }),
    challenge: z.object({
      vi: z.string(),
      en: z.string(),
      ja: z.string(),
    }),
    solution: z.object({
      vi: z.string(),
      en: z.string(),
      ja: z.string(),
    }),
    tech: z.array(z.string()),
    timeline: z.object({
      vi: z.string(),
      en: z.string(),
      ja: z.string(),
    }),
    results: z.array(z.object({
      icon: z.string(),
      vi: z.string(),
      en: z.string(),
      ja: z.string(),
    })),
    testimonial: z.object({
      quote: z.object({
        vi: z.string(),
        en: z.string(),
        ja: z.string(),
      }),
      author: z.string(),
      position: z.object({
        vi: z.string(),
        en: z.string(),
        ja: z.string(),
      }),
    }),
  }),
});

export const collections = {
  'case-studies': caseStudiesCollection,
};
