// Schemas for the site copy in src/content. Each text exists in English and German; texts that change with the tone
// exist for both tones (pro = formal, per = casual). Experience and How I work have one tone only (design spec §6).
import { z } from 'astro/zod';

const text = z.string().trim().min(1);
export const localized = z.object({ en: text, de: text }).strict();
export const toned = z.object({ pro: localized, per: localized }).strict();
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'expected YYYY-MM');

export const stationSchema = z
  .object({
    id: text,
    org: text,
    from: month,
    to: month.nullable(),
    role: localized,
    official: localized.optional(),
    area: localized,
    edu: localized.optional(),
    gist: localized,
    work: z.array(z.object({ title: localized, text: localized }).strict()).min(1),
    // a product name, or a phrase that is translated
    tech: z.array(z.union([text, localized])).min(1),
  })
  .strict();

export const heroSchema = z
  .object({
    role_line: localized,
    lede: toned,
    now_line: toned,
    onward: toned,
    gate: z.object({ question: localized, formal: localized, casual: localized }).strict(),
  })
  .strict();

export const howSchema = z
  .object({
    heading: localized,
    items: z.array(z.object({ claim: localized, text: localized }).strict()).min(1),
  })
  .strict();

export const contactSchema = z
  .object({
    heading: toned,
    lead: toned,
    reveal_label: toned,
    copy_label: localized,
    copied_label: localized,
    copied_status: localized,
    copy_fallback: localized,
    new_tab: localized,
  })
  .strict();

export const footerSchema = z
  .object({
    colophon: toned,
    credit: localized,
    source_link: localized,
  })
  .strict();

export type Localized = z.infer<typeof localized>;
export type Toned = z.infer<typeof toned>;
export type Station = z.infer<typeof stationSchema>;
export type Hero = z.infer<typeof heroSchema>;
export type How = z.infer<typeof howSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Footer = z.infer<typeof footerSchema>;
