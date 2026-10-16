// schema.org Person for search engines (JSON-LD in the page head), built from the station files so it stays in sync.
import { buildSkillIndex, labelOf, type StationLike } from './experience';

interface PersonInput {
  url: string;
  description: string;
  sameAs: string[];
}

export function personJsonLd(stations: StationLike[], { url, description, sameAs }: PersonInput) {
  const current = stations.find((s) => s.to === null);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Marvin Mai',
    jobTitle: 'Backend software engineer',
    url,
    description,
    sameAs,
    ...(current && { worksFor: { '@type': 'Organization', name: labelOf(current.org).en } }),
    homeLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Stuttgart', addressCountry: 'DE' } },
    knowsLanguage: ['de', 'en'],
    knowsAbout: buildSkillIndex(stations).map((s) => s.label.en),
  };
}
