// The site copy (design spec §6–§14). Stations are one file each; every section is one file in src/content/sections.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { contactSchema, footerSchema, heroSchema, howSchema, stationSchema } from './lib/schemas';

const section = (name: string) => glob({ pattern: `${name}.yaml`, base: './src/content/sections' });

export const collections = {
  stations: defineCollection({ loader: glob({ pattern: '*.yaml', base: './src/content/stations' }), schema: stationSchema }),
  hero: defineCollection({ loader: section('hero'), schema: heroSchema }),
  how: defineCollection({ loader: section('how-i-work'), schema: howSchema }),
  contact: defineCollection({ loader: section('contact'), schema: contactSchema }),
  footer: defineCollection({ loader: section('footer'), schema: footerSchema }),
};
