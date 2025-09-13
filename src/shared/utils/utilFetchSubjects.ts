import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export const loadSubjects = <T>(relativePath: string) => {
  try {
    const filePath = path.join(process.cwd(), 'src/subjects', relativePath);
    const file = fs.readFileSync(filePath, 'utf8');
    return yaml.load(file) as T;
  } catch (err) {
    console.error(`Failed to load subjects from ${relativePath}`, err);
    return null;
  }
};
