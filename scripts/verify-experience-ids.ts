import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import yaml from 'js-yaml';

interface ActivityShape {
  id?: string;
  title?: string;
}

interface CompanyShape {
  companyName?: string;
  activities?: ActivityShape[];
}

const load = (locale: 'ko' | 'en'): CompanyShape[] => {
  const filePath = join(process.cwd(), 'src', 'subjects', locale, 'experience.yaml');
  const raw = readFileSync(filePath, 'utf8');
  return yaml.load(raw) as CompanyShape[];
};

const flatten = (companies: CompanyShape[]): ActivityShape[] =>
  companies.flatMap(c => c.activities ?? []);

const ko = flatten(load('ko'));
const en = flatten(load('en'));

const errors: string[] = [];

if (ko.length !== en.length) {
  errors.push(`activities.length mismatch: ko=${ko.length}, en=${en.length}`);
}

const total = Math.max(ko.length, en.length);
for (let i = 0; i < total; i += 1) {
  const koId = ko[i]?.id;
  const enId = en[i]?.id;

  if (!koId) errors.push(`ko[${i}] missing id (title="${ko[i]?.title ?? '-'}")`);
  if (!enId) errors.push(`en[${i}] missing id (title="${en[i]?.title ?? '-'}")`);

  if (koId && enId && koId !== enId) {
    errors.push(`index ${i}: id mismatch — ko="${koId}", en="${enId}"`);
  }
}

const koIds = ko.map(a => a.id).filter(Boolean) as string[];
const dupes = koIds.filter((id, i) => koIds.indexOf(id) !== i);
if (dupes.length > 0) {
  errors.push(`duplicate ids in ko: ${[...new Set(dupes)].join(', ')}`);
}

if (errors.length > 0) {
  console.error('[verify-experience-ids] FAIL');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log(`[verify-experience-ids] OK — ${ko.length} activities matched pairwise across ko/en.`);
console.log('  ids:');
for (const id of koIds) {
  console.log(`    - ${id}`);
}
