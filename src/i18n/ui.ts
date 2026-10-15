// Interface words that are not part of the site copy in src/content (labels, controls, palette commands).
import type { Localized } from '../lib/schemas';

const t = (en: string, de: string): Localized => ({ en, de });

export const UI = {
  skip: t('Skip to content', 'Zum Inhalt springen'),
  nav: {
    label: t('Sections', 'Abschnitte'),
    experience: t('Experience', 'Erfahrung'),
    how: t('How I work', 'Arbeitsweise'),
    contact: t('Contact', 'Kontakt'),
  },
  lang: { label: t('Language', 'Sprache') },
  culture: { label: t('Tone of introduction', 'Ton der Vorstellung'), formal: t('Formal', 'Förmlich'), casual: t('Casual', 'Locker') },
  scheme: { label: t('Colour scheme', 'Farbschema'), day: t('Day', 'Tag'), night: t('Night', 'Nacht') },
  palette: {
    open: t('Open search and commands (Ctrl or Cmd + K)', 'Suche und Befehle öffnen (Strg oder Cmd + K)'),
    title: t('Search and commands (⌘K / Ctrl K)', 'Suche und Befehle (⌘K / Strg K)'),
    label: t('Search and commands', 'Suche und Befehle'),
    placeholder: t('Where to, or what?', 'Wohin oder was?'),
    search: t('Search', 'Suche'),
    none: t('No match', 'Kein Treffer'),
  },
  or: t('or', 'oder'),
  experience: {
    heading: t('Experience', 'Berufserfahrung'),
    today: t('today', 'heute'),
    official: t('Official title: ', 'Offizielle Bezeichnung: '),
    filter: t('Filter by technology', 'Nach Technologie filtern'),
    technologies: t('Technologies', 'Technologien'),
    lead: t('Select one to light up the positions that used it.', 'Eine auswählen, um die Stationen hervorzuheben, in denen sie genutzt wurde.'),
    clear: t('clear', 'zurücksetzen'),
  },
  portrait: {
    pro: t('Portrait of Marvin Mai in a navy suit and white shirt', 'Porträt von Marvin Mai in dunkelblauem Anzug und weißem Hemd'),
    per: t('Marvin Mai in a cap, with his light-coloured dog among balcony plants', 'Marvin Mai mit Cap und seinem hellen Hund zwischen Balkonpflanzen'),
  },
};

/** Palette commands (spec §15); the client script binds each id to its action. */
export const COMMANDS = [
  { id: 'go-top', group: t('Go to', 'Gehe zu'), name: t('Top', 'Anfang') },
  { id: 'go-experience', group: t('Go to', 'Gehe zu'), name: t('Experience', 'Berufserfahrung') },
  { id: 'go-how', group: t('Go to', 'Gehe zu'), name: t('How I work', 'Arbeitsweise') },
  { id: 'go-contact', group: t('Go to', 'Gehe zu'), name: t('Contact', 'Kontakt') },
  { id: 'tone-pro', group: t('Tone', 'Ton'), name: t('Introduce yourself formally', 'Förmlich vorstellen') },
  { id: 'tone-per', group: t('Tone', 'Ton'), name: t('Introduce yourself casually', 'Locker vorstellen') },
  { id: 'scheme-light', group: t('Appearance', 'Darstellung'), name: t('Day (light)', 'Tag (hell)') },
  { id: 'scheme-dark', group: t('Appearance', 'Darstellung'), name: t('Night (dark)', 'Nacht (dunkel)') },
  { id: 'scheme-auto', group: t('Appearance', 'Darstellung'), name: t('Follow system setting', 'Systemeinstellung folgen') },
  { id: 'lang-de', group: t('Language', 'Sprache'), name: t('Deutsch', 'Deutsch') },
  { id: 'lang-en', group: t('Language', 'Sprache'), name: t('English', 'English') },
  { id: 'copy-mail', group: t('Contact', 'Kontakt'), name: t('Copy e-mail address', 'E-Mail-Adresse kopieren') },
  { id: 'open-github', group: t('Contact', 'Kontakt'), name: t('Open GitHub', 'GitHub öffnen') },
] as const;
