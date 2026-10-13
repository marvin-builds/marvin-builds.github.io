#!/usr/bin/env node
// Fails if site sources or build output contain a term from the local, gitignored
// .denylist (customer and colleague names, ticket prefixes, internal hosts).
// Usage: node scripts/check-privacy.mjs [dir ...]   (default: src public dist)
// PRIVACY_DENYLIST overrides the denylist path.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEXT_EXTENSIONS = new Set([
  '.astro', '.css', '.html', '.js', '.json', '.md', '.mdx', '.mjs', '.svg', '.ts', '.txt', '.xml', '.yaml', '.yml',
]);

export function parseDenylist(content) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

// A "/pattern/flags" line is a regular expression (for short or generic terms that
// need word boundaries); any other line is a case-insensitive substring.
function toMatcher(term) {
  const regex = term.match(/^\/(.+)\/([a-z]*)$/);
  if (regex) {
    const pattern = new RegExp(regex[1], regex[2]);
    return (line) => pattern.test(line);
  }
  const needle = term.toLowerCase();
  return (line) => line.toLowerCase().includes(needle);
}

export function findHits(terms, files) {
  const hits = [];
  const matchers = terms.map((term) => ({ term, matches: toMatcher(term) }));
  for (const { path, text } of files) {
    text.split('\n').forEach((lineText, index) => {
      for (const { term, matches } of matchers) {
        if (matches(lineText)) hits.push({ path, line: index + 1, term });
      }
    });
  }
  return hits;
}

function collectFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return collectFiles(path);
    return TEXT_EXTENSIONS.has(extname(name)) ? [{ path, text: readFileSync(path, 'utf8') }] : [];
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const denylistPath = process.env.PRIVACY_DENYLIST ?? '.denylist';
  if (!existsSync(denylistPath)) {
    console.error(`No denylist at ${denylistPath} - create one from .denylist.example`);
    process.exit(1);
  }
  const dirs = process.argv.length > 2 ? process.argv.slice(2) : ['src', 'public', 'dist'];
  const hits = findHits(parseDenylist(readFileSync(denylistPath, 'utf8')), dirs.flatMap(collectFiles));
  if (hits.length) {
    console.error('Privacy check FAILED:');
    for (const hit of hits) console.error(`  ${hit.path}:${hit.line}  "${hit.term}"`);
    process.exit(1);
  }
  console.log('Privacy check passed.');
}
