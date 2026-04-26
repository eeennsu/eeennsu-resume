import { Locale } from '@shared/i18n/config';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export const loadSubjects = <T>(relativePath: string, locale: Locale) => {
  try {
    const filePath = path.join(process.cwd(), 'src/subjects', locale, relativePath);
    const file = fs.readFileSync(filePath, 'utf8');
    return yaml.load(file) as T;
  } catch (err) {
    console.error(`Failed to load subjects from ${locale}/${relativePath}`, err);
    return null;
  }
};
